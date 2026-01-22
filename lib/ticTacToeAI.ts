export type Player = "X" | "O" | null;
export type Level = "easy" | "medium" | "hard";

export function getWinningLine(board: Player[]): number[] | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [a, b, c];
    }
  }
  return null;
}

function minimax(
  board: Player[],
  depth: number,
  isMaximizing: boolean
): number {
  const winner = getWinningLine(board);

  if (winner) {
    const player = board[winner[0]];
    return player === "O" ? 10 - depth : depth - 10;
  }

  if (!board.includes(null)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "O";
        const score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "X";
        const score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

export function getAIMove(board: Player[], level: Level): number {
  const available = board
    .map((cell, i) => (cell === null ? i : null))
    .filter((i) => i !== null) as number[];

  if (available.length === 0) return -1;

  if (level === "easy") {
    return available[Math.floor(Math.random() * available.length)];
  }

  if (level === "medium") {
    if (Math.random() < 0.5) {
      return available[Math.floor(Math.random() * available.length)];
    }
  }

  let bestScore = -Infinity;
  let bestMove = available[0];

  for (const i of available) {
    board[i] = "O";
    const score = minimax(board, 0, false);
    board[i] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }

  return bestMove;
}