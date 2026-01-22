'use client';

import { useState } from 'react';
import {
  PUZZLE,
  CellState,
  toggleCell,
  isSolved,
  hasAdjacentShaded,
  isNoDuplicates,
} from './hitoriLogic';

export default function HitoriGame() {
  const [cells, setCells] = useState<CellState[][]>(
    PUZZLE.map(row => row.map(() => 'unshaded' as CellState))
  );

  const solved = isSolved(cells);

  const handleCellClick = (r: number, c: number) => {
    if (solved) return;
    setCells(toggleCell(cells, r, c));
  };

  const getCellStatus = (r: number, c: number): 'correct' | 'error' | 'neutral' => {
    const state = cells[r][c];
    
    if (state === 'unshaded') {
      // Check if unshaded cell has duplicates in its row/column
      const value = PUZZLE[r][c];
      const rowDuplicates = PUZZLE[r].filter((v, ci) => v === value && cells[r][ci] === 'unshaded').length > 1;
      const colDuplicates = PUZZLE.map((row, ri) => row[c]).filter((v, ri) => v === value && cells[ri][c] === 'unshaded').length > 1;
      
      if (rowDuplicates || colDuplicates) {
        return 'error';
      }
      return 'neutral';
    }
    
    if (state === 'shaded') {
      // Check if shaded cell has adjacent shaded cells
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
    <div className="flex flex-col items-center gap-8">
      {solved && (
        <div className="rounded-xl border-2 border-green-400/50 bg-green-400/10 px-8 py-4 text-green-400 text-lg font-semibold">
          ✨ Puzzle Solved — Perfect!
        </div>
      )}

      <div className="rounded-2xl bg-[#0a1628] p-10 shadow-2xl">
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
                    onContextMenu={(e) => {
                      e.preventDefault();
                      handleCellClick(r, c);
                    }}
                    className={`w-14 h-14 rounded-md font-bold text-xl transition-all duration-200 ${
                      state === 'shaded'
                        ? status === 'error'
                          ? 'bg-red-500/30 text-red-300 border-2 border-red-400'
                          : 'bg-slate-600/80 text-slate-400'
                        : state === 'circled'
                        ? 'bg-blue-500/20 text-blue-300 border-2 border-blue-400'
                        : status === 'error'
                        ? 'bg-red-500/20 text-white border-2 border-red-400/50'
                        : status === 'correct'
                        ? 'bg-green-500/15 text-white'
                        : 'bg-slate-800/50 text-white hover:bg-slate-700/70'
                    } cursor-pointer active:scale-95`}
                  >
                    {state !== 'shaded' && value}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="text-slate-400 text-sm text-center max-w-md">
        <p className="mb-2">Click to shade cells. Click again to circle, click once more to clear.</p>
        <p>Rules: No duplicates in rows/columns (unshaded), no adjacent shaded cells</p>
      </div>

      <button
        onClick={reset}
        className="px-8 py-3 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-white font-medium transition-all duration-200 hover:scale-105 active:scale-95"
      >
        Reset Puzzle
      </button>
    </div>
  );
}