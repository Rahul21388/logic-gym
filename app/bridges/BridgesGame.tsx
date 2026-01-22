'use client';

import { useState } from 'react';
import {
  GRID_ROWS,
  GRID_COLS,
  ISLANDS,
  Bridge,
  findIsland,
  lineOfSight,
  toggleBridge,
  countBridgesForIsland,
  isSolved,
} from './bridgesLogic';

const cellSize = 52;

export default function BridgesGame() {
  const [bridges, setBridges] = useState<Bridge[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const solved = isSolved(bridges);

  const reset = () => {
    setBridges([]);
    setSelected(null);
  };

  const islandFill = (id: number) => {
    const total = countBridgesForIsland(bridges, id);
    const req = ISLANDS.find(i => i.id === id)!.required;

    if (selected === id) return 'bg-blue-500';
    if (total === req) return 'bg-green-500';
    if (total > req) return 'bg-red-500';
    return 'bg-slate-600';
  };

  const handleClick = (id: number) => {
    if (selected === null) {
      setSelected(id);
      return;
    }

    if (selected === id) {
      setSelected(null);
      return;
    }

    const a = findIsland(selected);
    const b = findIsland(id);
    const orientation = lineOfSight(a, b);

    if (!orientation) {
      setSelected(id);
      return;
    }

    setBridges(prev => toggleBridge(prev, a, b));
    setSelected(id);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {solved && (
        <div className="rounded-xl bg-green-500/15 border border-green-400 px-6 py-3 text-green-300 font-semibold">
          ✨ Puzzle solved!
        </div>
      )}

      <div className="rounded-2xl bg-[#0a1628] p-5 shadow-xl">
        <div
          className="relative"
          style={{ width: GRID_COLS * cellSize, height: GRID_ROWS * cellSize }}
        >
          {/* Bridges */}
          {bridges.map((b, i) => {
            const a = findIsland(b.from);
            const c = findIsland(b.to);

            const x1 = a.col * cellSize + cellSize / 2;
            const y1 = a.row * cellSize + cellSize / 2;
            const x2 = c.col * cellSize + cellSize / 2;
            const y2 = c.row * cellSize + cellSize / 2;

            const isH = a.row === c.row;
            const offset = b.count === 2 ? 6 : 0;

            return (
              <div key={i}>
                <div
                  className="absolute bg-blue-400 rounded-full"
                  style={
                    isH
                      ? {
                          left: Math.min(x1, x2),
                          top: y1 - 3 - offset,
                          width: Math.abs(x1 - x2),
                          height: 6,
                        }
                      : {
                          left: x1 - 3 - offset,
                          top: Math.min(y1, y2),
                          width: 6,
                          height: Math.abs(y1 - y2),
                        }
                  }
                />
                {b.count === 2 && (
                  <div
                    className="absolute bg-blue-400 rounded-full"
                    style={
                      isH
                        ? {
                            left: Math.min(x1, x2),
                            top: y1 + offset,
                            width: Math.abs(x1 - x2),
                            height: 6,
                          }
                        : {
                            left: x1 + offset,
                            top: Math.min(y1, y2),
                            width: 6,
                            height: Math.abs(y1 - y2),
                          }
                    }
                  />
                )}
              </div>
            );
          })}

          {/* Islands */}
          {ISLANDS.map(island => {
            const size = 40;
            const x = island.col * cellSize + cellSize / 2 - size / 2;
            const y = island.row * cellSize + cellSize / 2 - size / 2;

            return (
              <button
                key={island.id}
                onClick={() => handleClick(island.id)}
                className={`absolute rounded-full flex items-center justify-center text-white font-semibold shadow-md transition ${islandFill(
                  island.id
                )}`}
                style={{ width: size, height: size, left: x, top: y }}
              >
                {island.required}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={reset}
        className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600"
      >
        Reset puzzle
      </button>
    </div>
  );
}
