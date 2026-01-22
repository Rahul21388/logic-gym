// app/2048/game2048Logic.ts

export type Direction = 'up' | 'down' | 'left' | 'right';

export type Board = number[][]; // 0 means empty

export interface GameState {
  board: Board;
  score: number;
  won: boolean;
  over: boolean;
}

export const SIZE = 4;

function createEmptyBoard(): Board {
  return Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => 0)
  );
}

function getEmptyCells(board: Board): [number, number][] {
  const cells: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) cells.push([r, c]);
    }
  }
  return cells;
}

function randomChoice<T>(arr: T[]): T | null {
  if (arr.length === 0) return null;
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx] ?? null;
}

export function addRandomTile(board: Board): Board {
  const empty = getEmptyCells(board);
  if (empty.length === 0) return board;

  const [r, c] = randomChoice(empty)!;
  const value = Math.random() < 0.9 ? 2 : 4;
  const newBoard = board.map(row => [...row]);
  newBoard[r][c] = value;
  return newBoard;
}

export function createInitialState(): GameState {
  let board = createEmptyBoard();
  board = addRandomTile(board);
  board = addRandomTile(board);

  return {
    board,
    score: 0,
    won: false,
    over: false,
  };
}

// Slide a single row/column to the left, returning new row and score gained.
function slideAndMerge(line: number[]): { line: number[]; gained: number } {
  const nonZero = line.filter(v => v !== 0);
  const merged: number[] = [];
  let gained = 0;

  let i = 0;
  while (i < nonZero.length) {
    if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
      const value = nonZero[i] * 2;
      merged.push(value);
      gained += value;
      i += 2;
    } else {
      merged.push(nonZero[i]);
      i += 1;
    }
  }

  while (merged.length < SIZE) merged.push(0);
  return { line: merged, gained };
}

export function move(board: Board, dir: Direction): { board: Board; gained: number } {
  let rotated: Board;

  const rotateLeft = (b: Board): Board => {
    const res = createEmptyBoard();
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        res[SIZE - 1 - c][r] = b[r][c];
      }
    }
    return res;
  };

  const rotateRight = (b: Board): Board => {
    const res = createEmptyBoard();
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        res[c][SIZE - 1 - r] = b[r][c];
      }
    }
    return res;
  };

  const flip = (b: Board): Board => b.map(row => [...row].reverse());

  if (dir === 'left') {
    rotated = board;
  } else if (dir === 'right') {
    rotated = flip(board);
  } else if (dir === 'up') {
    rotated = rotateLeft(board);
  } else {
    // down
    rotated = rotateRight(board);
  }

  const newRotated: Board = createEmptyBoard();
  let totalGained = 0;

  for (let r = 0; r < SIZE; r++) {
    const { line, gained } = slideAndMerge(rotated[r]);
    newRotated[r] = line;
    totalGained += gained;
  }

  let newBoard: Board;
  if (dir === 'left') {
    newBoard = newRotated;
  } else if (dir === 'right') {
    newBoard = flip(newRotated);
  } else if (dir === 'up') {
    // inverse of rotateLeft is rotateRight
    newBoard = rotateRight(newRotated);
  } else {
    // down, inverse of rotateRight is rotateLeft
    newBoard = rotateLeft(newRotated);
  }

  return { board: newBoard, gained: totalGained };
}

export function boardsEqual(a: Board, b: Board): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }
  return true;
}

export function canMove(board: Board): boolean {
  if (getEmptyCells(board).length > 0) return true;

  // Check for any adjacent equal tiles
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = board[r][c];
      if (r + 1 < SIZE && board[r + 1][c] === v) return true;
      if (c + 1 < SIZE && board[r][c + 1] === v) return true;
    }
  }
  return false;
}

export function contains2048(board: Board): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] >= 2048) return true;
    }
  }
  return false;
}

export function applyMove(state: GameState, dir: Direction): GameState {
  if (state.over) return state;

  const { board: movedBoard, gained } = move(state.board, dir);
  if (boardsEqual(state.board, movedBoard)) {
    // no tiles moved, do nothing
    return state;
  }

  const board = addRandomTile(movedBoard); // changed 'let' to 'const'
  const score = state.score + gained;
  const won = state.won || contains2048(board);
  const over = !canMove(board);

  return {
    board,
    score,
    won,
    over,
  };
}
