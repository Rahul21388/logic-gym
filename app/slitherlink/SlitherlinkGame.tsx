'use client';

import { useState } from 'react';
import {
  SIZE,
  CLUES,
  edgeKey,
  toggleEdge,
  isSolved,
  countEdgesAroundCell,
} from './slitherlinkLogic';

const CELL = 64;
const DOT = 5;
const STROKE = 6;
const PADDING = 14;

export default function SlitherlinkGame() {
  const [edges, setEdges] = useState<Set<string>>(new Set());
  const solved = isSolved(edges);

  const svgSize = SIZE * CELL + PADDING * 2;

  const cellStatus = (r: number, c: number) => {
    const clue = CLUES[r]?.[c];
    if (clue == null) return 'neutral';
    const count = countEdgesAroundCell(edges, r, c);
    if (count === clue) return 'correct';
    if (count > clue) return 'wrong';
    return 'neutral';
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {solved && (
        <div className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-8 py-4 text-emerald-300 text-lg font-semibold shadow-lg">
          ✨ Puzzle Solved — Perfect single loop!
        </div>
      )}

      <div className="rounded-3xl bg-gradient-to-br from-[#0b162a] to-[#050b18] p-10 shadow-2xl">
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
        >
          {/* CSS for flowing animation */}
          <defs>
            <style>{`
              .edge-flow {
                stroke-dasharray: 14 10;
                animation: flow 1.2s linear infinite;
              }
              @keyframes flow {
                from { stroke-dashoffset: 0; }
                to   { stroke-dashoffset: -24; }
              }
            `}</style>
          </defs>

          {/* CELLS */}
          {CLUES.map((row, r) =>
            row.map((val, c) => {
              if (val == null) return null;
              const status = cellStatus(r, c);

              return (
                <g key={`cell-${r}-${c}`}>
                  <rect
                    x={PADDING + c * CELL + 10}
                    y={PADDING + r * CELL + 10}
                    width={CELL - 20}
                    height={CELL - 20}
                    rx={12}
                    className={
                      status === 'correct'
                        ? 'fill-emerald-400/15'
                        : status === 'wrong'
                        ? 'fill-red-500/20'
                        : 'fill-slate-700/40'
                    }
                  />
                  <text
                    x={PADDING + c * CELL + CELL / 2}
                    y={PADDING + r * CELL + CELL / 2 + 6}
                    textAnchor="middle"
                    fontSize="22"
                    fontWeight="700"
                    className={
                      status === 'correct'
                        ? 'fill-emerald-300'
                        : status === 'wrong'
                        ? 'fill-red-400'
                        : 'fill-white'
                    }
                  >
                    {val}
                  </text>
                </g>
              );
            })
          )}

          {/* HORIZONTAL EDGES */}
          {Array.from({ length: SIZE + 1 }).map((_, r) =>
            Array.from({ length: SIZE }).map((_, c) => {
              const key = edgeKey(r, c, 'h');
              const active = edges.has(key);
              if (!active && solved) return null;

              const x = PADDING + c * CELL;
              const y = PADDING + r * CELL;

              return (
                <line
                  key={key}
                  x1={x + DOT}
                  y1={y}
                  x2={x + CELL - DOT}
                  y2={y}
                  stroke={active ? '#34f5a6' : '#2a3446'}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  className={
                    solved && active
                      ? 'edge-flow'
                      : !solved
                      ? 'cursor-pointer hover:stroke-slate-400'
                      : ''
                  }
                  onClick={() => !solved && setEdges(toggleEdge(edges, key))}
                />
              );
            })
          )}

          {/* VERTICAL EDGES */}
          {Array.from({ length: SIZE }).map((_, r) =>
            Array.from({ length: SIZE + 1 }).map((_, c) => {
              const key = edgeKey(r, c, 'v');
              const active = edges.has(key);
              if (!active && solved) return null;

              const x = PADDING + c * CELL;
              const y = PADDING + r * CELL;

              return (
                <line
                  key={key}
                  x1={x}
                  y1={y + DOT}
                  x2={x}
                  y2={y + CELL - DOT}
                  stroke={active ? '#34f5a6' : '#2a3446'}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  className={
                    solved && active
                      ? 'edge-flow'
                      : !solved
                      ? 'cursor-pointer hover:stroke-slate-400'
                      : ''
                  }
                  onClick={() => !solved && setEdges(toggleEdge(edges, key))}
                />
              );
            })
          )}

          {/* DOTS */}
          {Array.from({ length: SIZE + 1 }).map((_, r) =>
            Array.from({ length: SIZE + 1 }).map((_, c) => (
              <circle
                key={`dot-${r}-${c}`}
                cx={PADDING + c * CELL}
                cy={PADDING + r * CELL}
                r={DOT}
                fill="#64748b"
              />
            ))
          )}
        </svg>
      </div>

      <button
        onClick={() => setEdges(new Set())}
        className="px-6 py-3 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-white font-medium transition-all"
      >
        Reset Puzzle
      </button>
    </div>
  );
}
