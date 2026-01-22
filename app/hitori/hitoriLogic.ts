export type CellState = 'unshaded' | 'shaded' | 'circled';

export const PUZZLE: number[][] = [
  [4, 8, 1, 6, 3, 2, 5, 7],
  [3, 6, 7, 2, 1, 6, 5, 4],
  [2, 3, 4, 8, 2, 8, 6, 1],
  [4, 1, 6, 5, 7, 7, 3, 5],
  [7, 2, 3, 1, 8, 5, 1, 2],
  [3, 5, 6, 7, 3, 1, 8, 4],
  [6, 4, 2, 3, 5, 4, 7, 8],
  [8, 7, 1, 4, 2, 3, 5, 6],
];

export function toggleCell(
  cells: CellState[][],
  r: number,
  c: number
): CellState[][] {
  const newCells = cells.map(row => [...row]);
  const current = newCells[r][c];
  
  if (current === 'unshaded') {
    newCells[r][c] = 'shaded';
  } else if (current === 'shaded') {
    newCells[r][c] = 'circled';
  } else {
    newCells[r][c] = 'unshaded';
  }
  
  return newCells;
}

export function hasAdjacentShaded(
  cells: CellState[][],
  r: number,
  c: number
): boolean {
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1]
  ];
  
  for (const [dr, dc] of directions) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr >= 0 && nr < cells.length && nc >= 0 && nc < cells[0].length) {
      if (cells[nr][nc] === 'shaded') {
        return true;
      }
    }
  }
  
  return false;
}

export function isConnected(cells: CellState[][]): boolean {
  const rows = cells.length;
  const cols = cells[0].length;
  const visited = Array(rows).fill(0).map(() => Array(cols).fill(false));
  
  // Find first unshaded cell
  let startR = -1, startC = -1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (cells[r][c] !== 'shaded') {
        startR = r;
        startC = c;
        break;
      }
    }
    if (startR !== -1) break;
  }
  
  if (startR === -1) return false; // All shaded
  
  // BFS to check connectivity
  const queue: [number, number][] = [[startR, startC]];
  visited[startR][startC] = true;
  let unshadedCount = 0;
  
  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    unshadedCount++;
    
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && 
          !visited[nr][nc] && cells[nr][nc] !== 'shaded') {
        visited[nr][nc] = true;
        queue.push([nr, nc]);
      }
    }
  }
  
  // Count total unshaded cells
  let totalUnshaded = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (cells[r][c] !== 'shaded') totalUnshaded++;
    }
  }
  
  return unshadedCount === totalUnshaded;
}

export function isNoDuplicates(cells: CellState[][]): boolean {
  const rows = cells.length;
  const cols = cells[0].length;
  
  // Check rows
  for (let r = 0; r < rows; r++) {
    const unshaded = new Set<number>();
    for (let c = 0; c < cols; c++) {
      if (cells[r][c] !== 'shaded') {
        const value = PUZZLE[r][c];
        if (unshaded.has(value)) return false;
        unshaded.add(value);
      }
    }
  }
  
  // Check columns
  for (let c = 0; c < cols; c++) {
    const unshaded = new Set<number>();
    for (let r = 0; r < rows; r++) {
      if (cells[r][c] !== 'shaded') {
        const value = PUZZLE[r][c];
        if (unshaded.has(value)) return false;
        unshaded.add(value);
      }
    }
  }
  
  return true;
}

export function isSolved(cells: CellState[][]): boolean {
  // Rule 1: No adjacent shaded cells
  for (let r = 0; r < cells.length; r++) {
    for (let c = 0; c < cells[0].length; c++) {
      if (cells[r][c] === 'shaded' && hasAdjacentShaded(cells, r, c)) {
        return false;
      }
    }
  }
  
  // Rule 2: No duplicates in rows/columns
  if (!isNoDuplicates(cells)) {
    return false;
  }
  
  // Rule 3: All unshaded cells are connected
  if (!isConnected(cells)) {
    return false;
  }
  
  return true;
}