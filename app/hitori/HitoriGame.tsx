'use client';

import { useState } from 'react';
import {
  PUZZLE,
  CellState,
  toggleCell,
  isSolved,
  hasAdjacentShaded,
} from './hitoriLogic';

export default function HitoriGame() {
  const [cells, setCells] = useState<CellState[][]>(
    PUZZLE.map(row => row.map(() => 'unshaded' as CellState))
  );

  const solved = isSolved(cells);

  const handleCellClick = (r: number, c: number) => {
    if (solved) return;
    setCells(prev => toggleCell(prev, r, c));
  };

  const getCellStatus = (
    r: number,
    c: number
  ): 'error' | 'neutral' => {
    const state = cells[r][c];

    if (state === 'unshaded') {
      const value = PUZZLE[r][c];
      const rowDuplicates =
        PUZZLE[r].filter(
          (v, ci) => v === value && cells[r][ci] === 'unshaded'
        ).length > 1;
      const colDuplicates =
        PUZZLE.map(row => row[c]).filter(
          (v, ri) => v === value && cells[ri][c] === 'unshaded'
        ).length > 1;

      if (rowDuplicates || colDuplicates) {
        return 'error';
      }
      return 'neutral';
    }

    if (state === 'shaded') {
      if (hasAdjacentShaded(cells, r, c)) {
        return 'error';
      }
      return 'neutral';
    }

    return 'neutral';
  };

  const reset = () => {
    setCells(PUZZLE.map(row => row.map(() => 'unshaded' as CellState)));
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {solved && (
        <div className="rounded-xl border border-green-400/60 bg-green-500/10 px-6 py-3 text-green-300 text-base md:text-lg font-semibold">
          ✨ Puzzle solved — all rules satisfied!
        </div>
      )}

      <div className="rounded-2xl bg-[#0a1628] p-4 md:p-8 shadow-2xl">
        <div className="grid gap-1">
          {PUZZLE.map((row, r) => (
            <div key={r} className="flex gap-1">
              {row.map((value, c) => {
                const state = cells[r][c];
                const status = getCellStatus(r, c);

                return (
                  <button
                    key={c}
                    onClick={() => handleCellClick(r, c)}
                    onContextMenu={e => {
                      e.preventDefault();
                      handleCellClick(r, c);
                    }}
                    className={`w-10 h-10 md:w-14 md:h-14 rounded-md font-bold text-lg md:text-xl transition-all duration-200
                      ${
                        state === 'shaded'
                          ? status === 'error'
                            ? 'bg-red-500/30 text-red-200 border-2 border-red-400'
                            : 'bg-slate-600/80 text-slate-300'
                          : state === 'circled'
                          ? 'bg-blue-500/20 text-blue-300 border-2 border-blue-400'
                          : status === 'error'
                          ? 'bg-red-500/20 text-white border-2 border-red-400/60'
                          : 'bg-slate-800/60 text-white hover:bg-slate-700/80'
                      }
                      cursor-pointer active:scale-95`}
                  >
                    {state !== 'shaded' && value}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1 text-slate-300 text-sm md:text-base text-center max-w-lg">
        <p>
          Click a cell to shade it (remove it). Click again to circle it (keep
          it white). Click a third time to clear your mark.
        </p>
        <p>
          Try to leave exactly one copy of each number in every row and column,
          with all white cells connected and no black cells touching side by
          side.
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
