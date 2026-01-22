'use client';

import { useState } from 'react';
import Link from 'next/link';

type Cell = 'empty' | 'black' | 'white';

const SIZE = 5;

/* ---------- SAFE PUZZLE SET (ALL SOLVABLE) ---------- */
const PUZZLES: (number | null)[][][] = [
  [
    [1, null, null, 2, null],
    [null, null, null, null, null],
    [null, 3, null, null, null],
    [null, null, null, null, null],
    [null, null, 1, null, null],
  ],
  [
    [null, 2, null, null, 1],
    [null, null, null, null, null],
    [3, null, null, null, null],
    [null, null, null, null, null],
    [1, null, null, 2, null],
  ],
  [
    [null, null, 3, null, null],
    [null, null, null, null, null],
    [2, null, null, null, 1],
    [null, null, null, null, null],
    [null, 1, null, 2, null],
  ],
];

function randomPuzzle() {
  return PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
}

export default function NurikabePage() {
  const [puzzle, setPuzzle] = useState(() => randomPuzzle());
  const [grid, setGrid] = useState<Cell[][]>(
    Array.from({ length: SIZE }, () =>
      Array.from({ length: SIZE }, () => 'empty')
    )
  );

  function toggle(r: number, c: number) {
    if (puzzle[r][c]) return;

    setGrid(prev => {
      const copy = prev.map(row => [...row]);
      copy[r][c] =
        prev[r][c] === 'empty'
          ? 'black'
          : prev[r][c] === 'black'
          ? 'white'
          : 'empty';
      return copy;
    });
  }

  function reset() {
    setPuzzle(randomPuzzle());
    setGrid(
      Array.from({ length: SIZE }, () =>
        Array.from({ length: SIZE }, () => 'empty')
      )
    );
  }

  /* ---------- HELPERS ---------- */

  function neighbors(r: number, c: number) {
    return [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ].filter(([nr, nc]) => nr >= 0 && nc >= 0 && nr < SIZE && nc < SIZE);
  }

  function flood(
    r: number,
    c: number,
    visited: boolean[][],
    match: (r: number, c: number) => boolean
  ): [number, [number, number][]] {
    const stack = [[r, c]];
    const cells: [number, number][] = [];
    visited[r][c] = true;

    while (stack.length) {
      const [cr, cc] = stack.pop()!;
      cells.push([cr, cc]);

      for (const [nr, nc] of neighbors(cr, cc)) {
        if (!visited[nr][nc] && match(nr, nc)) {
          visited[nr][nc] = true;
          stack.push([nr, nc]);
        }
      }
    }

    return [cells.length, cells];
  }

  /* ---------- VALIDATION ---------- */

  const invalid = new Set<string>();

  function mark(r: number, c: number) {
    invalid.add(`${r}-${c}`);
  }

  function check2x2Black() {
    for (let r = 0; r < SIZE - 1; r++) {
      for (let c = 0; c < SIZE - 1; c++) {
        const cells = [
          [r, c],
          [r + 1, c],
          [r, c + 1],
          [r + 1, c + 1],
        ];
        if (cells.every(([rr, cc]) => grid[rr][cc] === 'black')) {
          cells.forEach(([rr, cc]) => mark(rr, cc));
        }
      }
    }
  }

  function checkIslands() {
    const visited = Array.from({ length: SIZE }, () =>
      Array(SIZE).fill(false)
    );

    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (puzzle[r][c]) {
          const [count, cells] = flood(
            r,
            c,
            visited,
            (rr, cc) => grid[rr][cc] !== 'black'
          );
          if (count !== puzzle[r][c]) {
            cells.forEach(([rr, cc]) => mark(rr, cc));
          }
        }
      }
    }
  }

  function checkBlackConnectivity() {
    const visited = Array.from({ length: SIZE }, () =>
      Array(SIZE).fill(false)
    );

    let start: [number, number] | null = null;
    const blacks: [number, number][] = [];


    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (grid[r][c] === 'black') {
          blacks.push([r, c]);
          if (!start) start = [r, c];
        }
      }
    }

    if (!start || blacks.length === 0) return;

    const [, connected] = flood(
      start[0],
      start[1],
      visited,
      (r, c) => grid[r][c] === 'black'
    );

    if (connected.length !== blacks.length) {
      blacks.forEach(([r, c]) => mark(r, c));
    }
  }

  function solved() {
    invalid.clear();
    check2x2Black();
    checkIslands();
    checkBlackConnectivity();

    return (
      invalid.size === 0 &&
      grid.every(row => row.every(c => c !== 'empty'))
    );
  }

  const isSolved = solved();

  /* ---------- UI ---------- */

  return (
    <main style={styles.page}>
      <header>
        <Link href="/" style={styles.back}>
          ← Back to Home
        </Link>
        <h1>Nurikabe</h1>
        <p style={styles.subtitle}>
          Shade black cells so islands match numbers.
        </p>
      </header>

      <section style={styles.board}>
        {puzzle.map((row, r) =>
          row.map((cell, c) => {
            const key = `${r}-${c}`;
            const error = invalid.has(key);

            return (
              <button
                key={key}
                onClick={() => toggle(r, c)}
                style={{
                  ...styles.cell,
                  background:
                    grid[r][c] === 'black'
                      ? '#000'
                      : grid[r][c] === 'white'
                      ? '#e5e7eb'
                      : '#1f2937',
                  color: grid[r][c] === 'black' ? '#000' : '#fff',
                  boxShadow: isSolved
                    ? '0 0 12px #22c55e'
                    : error
                    ? '0 0 12px #ef4444'
                    : 'none',
                }}
              >
                {cell ?? ''}
              </button>
            );
          })
        )}
      </section>

      <div style={styles.status}>
        {isSolved ? '🎉 Puzzle Solved!' : 'Fix highlighted cells'}
      </div>

      <button style={styles.reset} onClick={reset}>
        New Puzzle
      </button>
    </main>
  );
}

/* ---------- STYLES ---------- */

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    padding: '40px',
    background: 'radial-gradient(circle at top, #020617, #000)',
    color: '#fff',
  },
  back: {
    color: '#4ade80',
    textDecoration: 'none',
    fontSize: '14px',
  },
  subtitle: {
    opacity: 0.7,
    fontSize: '14px',
  },
  board: {
    display: 'grid',
    gridTemplateColumns: `repeat(${SIZE}, 60px)`,
    gap: '10px',
    marginTop: '30px',
  },
  cell: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    border: '1px solid #334155',
    fontSize: '20px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'box-shadow 0.2s',
  },
  status: {
    marginTop: '20px',
    fontSize: '14px',
  },
  reset: {
    marginTop: '16px',
    padding: '10px 16px',
    borderRadius: '10px',
    background: '#22c55e',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
  },
};
