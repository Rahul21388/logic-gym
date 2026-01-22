// NurikabeGame.tsx
'use client';

import { useState } from 'react';
import {
  GRID_ROWS,
  GRID_COLS,
  CLUES,
  CellState,
  makeInitialGrid,
  toggleCell,
  getClueAt,
  hasBlack2x2,
  blackConnected,
  islandsValid,
  isSolved,
} from './nurikabeLogic';

export default function NurikabeGame() {
  const [grid, setGrid] = useState<CellState[][]>(makeInitialGrid);
  const solved = isSolved(grid);

  const handleCellClick = (row: number, col: number) => {
    if (solved) return;
    // Clue cells are forced to be white; do not toggle them
    const clue = getClueAt(row, col);
    if (clue) return;
    setGrid(prev => toggleCell(prev, row, col));
  };

  const reset = () => {
    setGrid(makeInitialGrid());
  };

  const errorBlackBlock = hasBlack2x2(grid);
  const errorBlackDisconnected = !blackConnected(grid);
  const errorIslands = !islandsValid(grid);

  const getCellClasses = (row: number, col: number): string => {
    const clue = getClueAt(row, col);
    const state = clue ? 'white' : grid[row][col];

    let base =
      'w-10 h-10 md:w-12 md:h-12 rounded-md flex items-center justify-center text-sm md:text-base font-semibold transition-all duration-200 cursor-pointer select-none';

    if (clue) {
      base += ' bg-emerald-500 text-white shadow-md';
      return base;
    }

    if (state === 'unknown') {
      base += ' bg-slate-700/70 text-slate-300 hover:bg-slate-600/80';
    } else if (state === 'black') {
      base += ' bg-slate-900 text-slate-200';
      if (errorBlackBlock || errorBlackDisconnected) {
        base += ' ring-2 ring-red-400/80';
      }
    } else {
      // white
      base += ' bg-slate-100 text-slate-900';
      if (errorIslands) {
        base += ' ring-2 ring-amber-400/80';
      }
    }

    return base;
  };

  const getCellContent = (row: number, col: number): string | number | null => {
    const clue = getClueAt(row, col);
    if (clue) return clue.value;
    return null;
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {solved && (
        <div className="rounded-xl border border-green-400/60 bg-green-500/10 px-6 py-3 text-green-300 text-base md:text-lg font-semibold">
          ✨ Sea and islands complete — Nurikabe solved!
        </div>
      )}

      <div className="rounded-2xl bg-[#0a1628] p-4 md:p-6 shadow-2xl">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: GRID_ROWS }).map((_, r) =>
            Array.from({ length: GRID_COLS }).map((_, c) => (
              <button
                key={`${r}-${c}`}
                type="button"
                className={getCellClasses(r, c)}
                onClick={() => handleCellClick(r, c)}
              >
                {getCellContent(r, c)}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="space-y-1 text-slate-300 text-sm md:text-base text-center max-w-lg">
        <p>
          Click a cell to cycle: unknown → black (sea) → white (island) → unknown.
          Numbered cells are fixed island cells and cannot be toggled.
        </p>
        <p>
          Try to form white islands of the indicated sizes, surrounded by a
          single connected sea of black cells with no 2×2 black blocks.
        </p>
      </div>

      <button
        onClick={reset}
        className="px-6 py-2.5 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-white text-sm md:text-base font-medium transition-all duration-200 hover:scale-105 active:scale-95"
      >
        Reset puzzle
      </button>
    </div>
  );
}
