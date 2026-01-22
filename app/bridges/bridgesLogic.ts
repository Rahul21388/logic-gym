export interface Island {
  id: number;
  row: number;
  col: number;
  required: number;
}

export interface Bridge {
  from: number;
  to: number;
  double: boolean;
}

export const ISLANDS: Island[] = [
  { id: 1, row: 0, col: 1, required: 3 },
  { id: 2, row: 0, col: 5, required: 2 },
  { id: 3, row: 1, col: 3, required: 3 },
  { id: 4, row: 2, col: 1, required: 2 },
  { id: 5, row: 2, col: 5, required: 4 },
  { id: 6, row: 3, col: 3, required: 6 },
  { id: 7, row: 4, col: 1, required: 3 },
  { id: 8, row: 4, col: 5, required: 3 },
  { id: 9, row: 5, col: 3, required: 4 },
  { id: 10, row: 6, col: 1, required: 2 },
  { id: 11, row: 6, col: 5, required: 1 },
];

export function getBridgesBetween(
  bridges: Bridge[],
  id1: number,
  id2: number
): Bridge[] {
  return bridges.filter(
    b =>
      (b.from === id1 && b.to === id2) ||
      (b.from === id2 && b.to === id1)
  );
}

export function canAddBridge(
  bridges: Bridge[],
  island1: Island,
  island2: Island
): boolean {
  // Must be in same row or column
  if (island1.row !== island2.row && island1.col !== island2.col) {
    return false;
  }

  // Check if islands already have max bridges between them
  const existing = getBridgesBetween(bridges, island1.id, island2.id);
  if (existing.length > 0 && existing[0].double) {
    return false; // Already double bridge
  }

  // Check if bridges would cross
  const isHorizontal = island1.row === island2.row;
  
  for (const bridge of bridges) {
    const fromIsland = ISLANDS.find(i => i.id === bridge.from)!;
    const toIsland = ISLANDS.find(i => i.id === bridge.to)!;
    const bridgeIsHorizontal = fromIsland.row === toIsland.row;

    // Only check crossing if one is horizontal and one is vertical
    if (isHorizontal !== bridgeIsHorizontal) {
      if (isHorizontal) {
        // New bridge is horizontal
        const newRow = island1.row;
        const newColMin = Math.min(island1.col, island2.col);
        const newColMax = Math.max(island1.col, island2.col);
        
        const bridgeCol = fromIsland.col;
        const bridgeRowMin = Math.min(fromIsland.row, toIsland.row);
        const bridgeRowMax = Math.max(fromIsland.row, toIsland.row);

        if (
          bridgeCol > newColMin &&
          bridgeCol < newColMax &&
          newRow > bridgeRowMin &&
          newRow < bridgeRowMax
        ) {
          return false; // Would cross
        }
      } else {
        // New bridge is vertical
        const newCol = island1.col;
        const newRowMin = Math.min(island1.row, island2.row);
        const newRowMax = Math.max(island1.row, island2.row);
        
        const bridgeRow = fromIsland.row;
        const bridgeColMin = Math.min(fromIsland.col, toIsland.col);
        const bridgeColMax = Math.max(fromIsland.col, toIsland.col);

        if (
          bridgeRow > newRowMin &&
          bridgeRow < newRowMax &&
          newCol > bridgeColMin &&
          newCol < bridgeColMax
        ) {
          return false; // Would cross
        }
      }
    }
  }

  // Check if there's an island in between
  if (isHorizontal) {
    const minCol = Math.min(island1.col, island2.col);
    const maxCol = Math.max(island1.col, island2.col);
    for (const island of ISLANDS) {
      if (
        island.id !== island1.id &&
        island.id !== island2.id &&
        island.row === island1.row &&
        island.col > minCol &&
        island.col < maxCol
      ) {
        return false; // Island in between
      }
    }
  } else {
    const minRow = Math.min(island1.row, island2.row);
    const maxRow = Math.max(island1.row, island2.row);
    for (const island of ISLANDS) {
      if (
        island.id !== island1.id &&
        island.id !== island2.id &&
        island.col === island1.col &&
        island.row > minRow &&
        island.row < maxRow
      ) {
        return false; // Island in between
      }
    }
  }

  // Check if islands would exceed their required bridges
  const island1Bridges = bridges.filter(
    b => b.from === island1.id || b.to === island1.id
  );
  const island1Count = island1Bridges.reduce((sum, b) => sum + (b.double ? 2 : 1), 0);
  
  const island2Bridges = bridges.filter(
    b => b.from === island2.id || b.to === island2.id
  );
  const island2Count = island2Bridges.reduce((sum, b) => sum + (b.double ? 2 : 1), 0);

  const additional = existing.length > 0 ? 1 : 1; // Adding one more bridge
  
  if (island1Count + additional > island1.required) return false;
  if (island2Count + additional > island2.required) return false;

  return true;
}

export function addBridge(
  bridges: Bridge[],
  island1: Island,
  island2: Island
): Bridge[] | null {
  if (!canAddBridge(bridges, island1, island2)) {
    return null;
  }

  const existing = getBridgesBetween(bridges, island1.id, island2.id);
  
  if (existing.length > 0) {
    // Upgrade to double bridge
    return bridges.map(b =>
      (b.from === island1.id && b.to === island2.id) ||
      (b.from === island2.id && b.to === island1.id)
        ? { ...b, double: true }
        : b
    );
  } else {
    // Add new single bridge
    return [
      ...bridges,
      {
        from: Math.min(island1.id, island2.id),
        to: Math.max(island1.id, island2.id),
        double: false,
      },
    ];
  }
}

export function removeBridge(
  bridges: Bridge[],
  id1: number,
  id2: number
): Bridge[] {
  const existing = getBridgesBetween(bridges, id1, id2);
  
  if (existing.length === 0) return bridges;
  
  if (existing[0].double) {
    // Downgrade to single bridge
    return bridges.map(b =>
      (b.from === id1 && b.to === id2) || (b.from === id2 && b.to === id1)
        ? { ...b, double: false }
        : b
    );
  } else {
    // Remove bridge entirely
    return bridges.filter(
      b =>
        !((b.from === id1 && b.to === id2) || (b.from === id2 && b.to === id1))
    );
  }
}

export function isConnected(bridges: Bridge[]): boolean {
  if (bridges.length === 0) return false;

  const visited = new Set<number>();
  const queue: number[] = [ISLANDS[0].id];
  visited.add(ISLANDS[0].id);

  while (queue.length > 0) {
    const current = queue.shift()!;

    for (const bridge of bridges) {
      let next: number | null = null;
      if (bridge.from === current && !visited.has(bridge.to)) {
        next = bridge.to;
      } else if (bridge.to === current && !visited.has(bridge.from)) {
        next = bridge.from;
      }

      if (next !== null) {
        visited.add(next);
        queue.push(next);
      }
    }
  }

  return visited.size === ISLANDS.length;
}

export function isSolved(bridges: Bridge[]): boolean {
  // Check if all islands have correct number of bridges
  for (const island of ISLANDS) {
    const connectedBridges = bridges.filter(
      b => b.from === island.id || b.to === island.id
    );
    const totalBridges = connectedBridges.reduce(
      (sum, b) => sum + (b.double ? 2 : 1),
      0
    );

    if (totalBridges !== island.required) {
      return false;
    }
  }

  // Check if all islands are connected
  if (!isConnected(bridges)) {
    return false;
  }

  return true;
}