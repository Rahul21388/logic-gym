'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Grid = number[][];

const SIZE = 4;

function emptyGrid(): Grid {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function addRandomTile(grid: Grid): Grid {
  const empty: [number, number][] = [];
  grid.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell === 0) empty.push([r, c]);
    })
  );

  if (empty.length === 0) return grid;

  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const newGrid = grid.map(row => [...row]);
  newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newGrid;
}

function slide(row: number[]) {
  const filtered = row.filter(n => n !== 0);
  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2;
      filtered[i + 1] = 0;
    }
  }
  const result = filtered.filter(n => n !== 0);
  while (result.length < SIZE) result.push(0);
  return result;
}

function moveLeft(grid: Grid) {
  return grid.map(slide);
}

function rotate(grid: Grid): Grid {
  return grid[0].map((_, i) => grid.map(row => row[i]).reverse());
}

function move(grid: Grid, dir: 'left' | 'right' | 'up' | 'down') {
  let newGrid = grid.map(row => [...row]);

  if (dir === 'left') newGrid = moveLeft(newGrid);
  if (dir === 'right') newGrid = moveLeft(newGrid.map(r => r.reverse())).map(r => r.reverse());
  if (dir === 'up') newGrid = rotate(moveLeft(rotate(newGrid)));
  if (dir === 'down') newGrid = rotate(rotate(moveLeft(rotate(rotate(newGrid)))));

  return newGrid;
}

function gridsEqual(a: Grid, b: Grid) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export default function Game2048Page() {
  const [grid, setGrid] = useState<Grid>(() => addRandomTile(addRandomTile(emptyGrid())));
  const [gameOver, setGameOver] = useState(false);

  function handleMove(dir: 'left' | 'right' | 'up' | 'down') {
    if (gameOver) return;

    const moved = move(grid, dir);
    if (gridsEqual(grid, moved)) return;

    const withTile = addRandomTile(moved);
    setGrid(withTile);

    if (!hasMoves(withTile)) setGameOver(true);
  }

  function hasMoves(grid: Grid) {
    for (const dir of ['left', 'right', 'up', 'down'] as const) {
      if (!gridsEqual(grid, move(grid, dir))) return true;
    }
    return false;
  }

  function reset() {
    setGrid(addRandomTile(addRandomTile(emptyGrid())));
    setGameOver(false);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') handleMove('left');
      if (e.key === 'ArrowRight') handleMove('right');
      if (e.key === 'ArrowUp') handleMove('up');
      if (e.key === 'ArrowDown') handleMove('down');
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <Link href="/" style={styles.back}>← Back to Home</Link>
        <h1 style={styles.title}>2048</h1>
        <p style={styles.subtitle}>Slide tiles and reach 2048</p>
      </header>

      <section style={styles.board}>
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div key={`${r}-${c}`} style={{ ...styles.cell, ...tileStyle(cell) }}>
              {cell !== 0 && cell}
            </div>
          ))
        )}
      </section>

      {gameOver && <p style={styles.gameOver}>Game Over ☠️</p>}

      <div style={styles.controls}>
        <button onClick={() => handleMove('up')}>↑</button>
        <div>
          <button onClick={() => handleMove('left')}>←</button>
          <button onClick={() => handleMove('down')}>↓</button>
          <button onClick={() => handleMove('right')}>→</button>
        </div>
      </div>

      <button style={styles.reset} onClick={reset}>Reset Game</button>
    </main>
  );
}

/* ---------- Styles ---------- */

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top, #0b1220, #020617)',
    color: '#e5e7eb',
    padding: 40,
    textAlign: 'center',
  },
  header: { marginBottom: 20 },
  back: { color: '#22c55e', textDecoration: 'none', fontSize: 14 },
  title: { fontSize: 40 },
  subtitle: { color: '#9ca3af' },
  board: {
    display: 'grid',
    gridTemplateColumns: `repeat(${SIZE}, 80px)`,
    gap: 12,
    justifyContent: 'center',
    margin: '30px auto',
  },
  cell: {
    width: 80,
    height: 80,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    fontWeight: 700,
    background: '#111827',
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
  },
  reset: {
    marginTop: 20,
    background: '#22c55e',
    border: 'none',
    color: '#022c22',
    padding: '12px 24px',
    borderRadius: 10,
    cursor: 'pointer',
  },
  gameOver: {
    color: '#f87171',
    fontSize: 20,
    marginTop: 10,
  },
};

function tileStyle(value: number): React.CSSProperties {
  const colors: Record<number, string> = {
    2: '#1e293b',
    4: '#334155',
    8: '#0ea5e9',
    16: '#22c55e',
    32: '#a3e635',
    64: '#facc15',
    128: '#fb7185',
    256: '#f472b6',
    512: '#c084fc',
    1024: '#818cf8',
    2048: '#f59e0b',
  };

  return {
    background: colors[value] || '#020617',
    color: value <= 4 ? '#e5e7eb' : '#020617',
  };
}
