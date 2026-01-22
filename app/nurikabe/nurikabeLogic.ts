// nurikabeLogic.ts

export type CellState = 'unknown' | 'black' | 'white';

export interface Clue {
  row: number;
  col: number;
  value: number;
}

// 5x5 beginner Nurikabe puzzle.
// 0 = no clue, other numbers are island sizes.
//
//   . 2 . . 1
//   . . . . .
//   3 . . . .
//   . . . . .
//   . . 2 . .
//
export const GRID_ROWS = 5;
export const GRID_COLS = 5;

export const CLUES: Clue[] = [
  { row: 0, col: 1, value: 2 },
  { row: 0, col: 4, value: 1 },
  { row: 2, col: 0, value: 3 },
  { row: 4, col: 2, value: 2 },
];

// Create initial grid with all cells unknown
export function makeInitialGrid(): CellState[][] {
  const grid = Array.from({ length: GRID_ROWS }, () =>
    Array.from({ length: GRID_COLS }, () => 'unknown' as CellState)
  );

  // Force clue cells to be white
  for (const clue of CLUES) {
    grid[clue.row][clue.col] = 'white';
  }

  return grid;
}


// Helper: check if a cell has a clue
export function getClueAt(row: number, col: number): Clue | undefined {
  return CLUES.find(c => c.row === row && c.col === col);
}

// Toggle cycle: unknown -> black -> white -> unknown
export function toggleCell(
  grid: CellState[][],
  row: number,
  col: number
): CellState[][] {
  const next = grid.map(r => [...r]);
  const current = next[row][col];

  if (current === 'unknown') {
    next[row][col] = 'black';
  } else if (current === 'black') {
    next[row][col] = 'white';
  } else {
    next[row][col] = 'unknown';
  }

  return next;
}

// Directions (4‑way)
const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < GRID_ROWS && c >= 0 && c < GRID_COLS;
}

// ---- Rule checks ----

// 1) No 2x2 all‑black block
export function hasBlack2x2(grid: CellState[][]): boolean {
  for (let r = 0; r < GRID_ROWS - 1; r++) {
    for (let c = 0; c < GRID_COLS - 1; c++) {
      const cells = [
        grid[r][c],
        grid[r][c + 1],
        grid[r + 1][c],
        grid[r + 1][c + 1],
      ];
      if (cells.every(s => s === 'black')) return true;
    }
  }
  return false;
}

// 2) All black cells form a single connected group (4‑way)
export function blackConnected(grid: CellState[][]): boolean {
  let start: [number, number] | null = null;

  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      if (grid[r][c] === 'black') {
        start = [r, c];
        break;
      }
    }
    if (start) break;
  }

  if (!start) return true; // no black cells yet (still valid partially)

  const visited = new Set<string>();
  const stack: [number, number][] = [start];

  while (stack.length) {
    const [r, c] = stack.pop()!;
    const key = `${r},${c}`;
    if (visited.has(key)) continue;
    visited.add(key);

    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (!inBounds(nr, nc)) continue;
      if (grid[nr][nc] !== 'black') continue;
      const nKey = `${nr},${nc}`;
      if (!visited.has(nKey)) stack.push([nr, nc]);
    }
  }

  // If any black cell is not visited, disconnected
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      if (grid[r][c] === 'black' && !visited.has(`${r},${c}`)) {
        return false;
      }
    }
  }

  return true;
}

// 3) Islands: for every clue, its connected white region must have
// exactly that many cells and exactly one clue; islands do not touch
// horizontally/vertically.
export function islandsValid(grid: CellState[][]): boolean {
  const visited = new Set<string>();

  for (const clue of CLUES) {
    const { row, col, value } = clue;
    const region: [number, number][] = [];
    const stack: [number, number][] = [[row, col]];

    while (stack.length) {
      const [r, c] = stack.pop()!;
      const key = `${r},${c}`;
      if (visited.has(key)) continue;
      visited.add(key);

      if (grid[r][c] !== 'white') continue;
      region.push([r, c]);

      for (const [dr, dc] of DIRS) {
        const nr = r + dr;
        const nc = c + dc;
        if (!inBounds(nr, nc)) continue;
        if (grid[nr][nc] !== 'white') continue;
        stack.push([nr, nc]);
      }
    }

    // If clue cell is not white yet, island is incomplete but not invalid
    if (!region.length) continue;

    // Count clues in this region
    let clueCount = 0;
    for (const [r, c] of region) {
      if (getClueAt(r, c)) clueCount++;
    }
    if (clueCount !== 1) return false;

    // Island must not exceed its target size; it can be smaller while solving
    if (region.length > value) return false;
  }

  // Additionally ensure that white regions without any clue do not exist
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      if (grid[r][c] !== 'white') continue;
      const key = `${r},${c}`;
      if (visited.has(key)) continue;

      // Found a white region without having started from a clue earlier
      const stack: [number, number][] = [[r, c]];
      let hasClue = false;

      while (stack.length) {
        const [cr, cc] = stack.pop()!;
        const k = `${cr},${cc}`;
        if (visited.has(k)) continue;
        visited.add(k);

        if (getClueAt(cr, cc)) hasClue = true;

        for (const [dr, dc] of DIRS) {
          const nr = cr + dr;
          const nc = cc + dc;
          if (!inBounds(nr, nc)) continue;
          if (grid[nr][nc] !== 'white') continue;
          if (!visited.has(`${nr},${nc}`)) stack.push([nr, nc]);
        }
      }

      if (!hasClue) return false;
    }
  }

  // Check islands do not touch orthogonally
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      if (grid[r][c] !== 'white') continue;
      for (const [dr, dc] of DIRS) {
        const nr = r + dr;
        const nc = c + dc;
        if (!inBounds(nr, nc)) continue;
        if (grid[nr][nc] !== 'white') continue;

        // If neighbour is white too, ensure they belong to same island (same clue region)
        const clue1 = findIslandClue(grid, r, c);
        const clue2 = findIslandClue(grid, nr, nc);
        if (clue1 && clue2 && clue1 !== clue2) {
          return false;
        }
      }
    }
  }

  return true;
}

// Helper to find which clue-region a white cell belongs to
function findIslandClue(
  grid: CellState[][],
  row: number,
  col: number
): string | null {
  const visited = new Set<string>();
  const stack: [number, number][] = [[row, col]];
  const clues = new Set<string>();

  while (stack.length) {
    const [r, c] = stack.pop()!;
    const key = `${r},${c}`;
    if (visited.has(key)) continue;
    visited.add(key);

    if (grid[r][c] !== 'white') continue;
    const clue = getClueAt(r, c);
    if (clue) clues.add(`${clue.row},${clue.col}`);

    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (!inBounds(nr, nc)) continue;
      if (grid[nr][nc] !== 'white') continue;
      if (!visited.has(`${nr},${nc}`)) stack.push([nr, nc]);
    }
  }

  if (clues.size === 0) return null;
  // All cells in a valid island should share one clue
  return [...clues][0];
}

// Final solved check (strict)
export function isSolved(grid: CellState[][]): boolean {
  // Every clue's island must have exact size
  for (const clue of CLUES) {
    const { row, col, value } = clue;
    if (grid[row][col] !== 'white') return false;

    const visited = new Set<string>();
    const stack: [number, number][] = [[row, col]];
    const region: [number, number][] = [];

    while (stack.length) {
      const [r, c] = stack.pop()!;
      const key = `${r},${c}`;
      if (visited.has(key)) continue;
      visited.add(key);

      if (grid[r][c] !== 'white') continue;
      region.push([r, c]);

      for (const [dr, dc] of DIRS) {
        const nr = r + dr;
        const nc = c + dc;
        if (!inBounds(nr, nc)) continue;
        if (grid[nr][nc] !== 'white') continue;
        stack.push([nr, nc]);
      }
    }

    if (region.length !== value) return false;
  }

  return !hasBlack2x2(grid) && blackConnected(grid) && islandsValid(grid);
}
