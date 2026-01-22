// bridgesLogic.ts

export type Orientation = 'horizontal' | 'vertical';

export interface Island {
  id: number;
  row: number;
  col: number;
  required: number;
}

export interface Bridge {
  from: number;
  to: number;
  count: 1 | 2;
  orientation: Orientation;
}

export const GRID_ROWS = 7;
export const GRID_COLS = 7;

export const ISLANDS: Island[] = [
  // Top row
  { id: 1, row: 1, col: 2, required: 2 },
  { id: 2, row: 1, col: 4, required: 2 },

  // Centre
  { id: 3, row: 3, col: 2, required: 2 },

  // Bottom row
  { id: 4, row: 5, col: 2, required: 1 },
  { id: 5, row: 5, col: 4, required: 1 },
];




export function findIsland(id: number): Island {
  const island = ISLANDS.find(i => i.id === id);
  if (!island) throw new Error(`Island ${id} not found`);
  return island;
}

export function lineOfSight(a: Island, b: Island): Orientation | null {
  if (a.row === b.row) {
    const min = Math.min(a.col, b.col);
    const max = Math.max(a.col, b.col);
    for (const i of ISLANDS) {
      if (i.row === a.row && i.col > min && i.col < max) return null;
    }
    return 'horizontal';
  }

  if (a.col === b.col) {
    const min = Math.min(a.row, b.row);
    const max = Math.max(a.row, b.row);
    for (const i of ISLANDS) {
      if (i.col === a.col && i.row > min && i.row < max) return null;
    }
    return 'vertical';
  }

  return null;
}

const key = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);

export function toggleBridge(
  bridges: Bridge[],
  a: Island,
  b: Island
): Bridge[] {
  const k = key(a.id, b.id);
  const idx = bridges.findIndex(
    br => key(br.from, br.to) === k
  );

  if (idx === -1) {
    return [...bridges, { from: a.id, to: b.id, count: 1, orientation: lineOfSight(a, b)! }];
  }

  const existing = bridges[idx];
  if (existing.count === 1) {
    const updated = [...bridges];
    updated[idx] = { ...existing, count: 2 };
    return updated;
  }

  return bridges.filter((_, i) => i !== idx);
}

export function countBridgesForIsland(
  bridges: Bridge[],
  islandId: number
): number {
  return bridges.reduce((sum, b) => {
    if (b.from === islandId || b.to === islandId) {
      return sum + b.count;
    }
    return sum;
  }, 0);
}

export function isSolved(bridges: Bridge[]): boolean {
  // Exact counts
  for (const island of ISLANDS) {
    if (countBridgesForIsland(bridges, island.id) !== island.required) {
      return false;
    }
  }

  // Connectivity
  const adj = new Map<number, number[]>();
  ISLANDS.forEach(i => adj.set(i.id, []));

  bridges.forEach(b => {
    adj.get(b.from)!.push(b.to);
    adj.get(b.to)!.push(b.from);
  });

  const visited = new Set<number>();
  const stack = [ISLANDS[0].id];

  while (stack.length) {
    const cur = stack.pop()!;
    if (visited.has(cur)) continue;
    visited.add(cur);
    adj.get(cur)!.forEach(n => stack.push(n));
  }

  return visited.size === ISLANDS.length;
}
