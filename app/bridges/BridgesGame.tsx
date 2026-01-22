'use client';

import { useState } from 'react';
import {
  ISLANDS,
  Island,
  Bridge,
  canAddBridge,
  addBridge,
  removeBridge,
  isSolved,
  getBridgesBetween,
} from './bridgesLogic';

export default function BridgesGame() {
  const [bridges, setBridges] = useState<Bridge[]>([]);
  const [selectedIsland, setSelectedIsland] = useState<Island | null>(null);

  const solved = isSolved(bridges);

  const handleIslandClick = (island: Island) => {
    if (solved) return;

    if (!selectedIsland) {
      setSelectedIsland(island);
    } else {
      if (selectedIsland.id === island.id) {
        setSelectedIsland(null);
        return;
      }

      const existingBridges = getBridgesBetween(bridges, selectedIsland.id, island.id);
      
      if (existingBridges.length > 0) {
        // Remove bridges
        setBridges(removeBridge(bridges, selectedIsland.id, island.id));
      } else {
        // Try to add bridge
        const newBridges = addBridge(bridges, selectedIsland, island);
        if (newBridges) {
          setBridges(newBridges);
        }
      }
      
      setSelectedIsland(null);
    }
  };

  const getIslandStatus = (island: Island): 'correct' | 'error' | 'neutral' => {
    const connectedBridges = bridges.filter(
      b => b.from === island.id || b.to === island.id
    );
    const totalBridges = connectedBridges.reduce((sum, b) => sum + (b.double ? 2 : 1), 0);

    if (totalBridges === island.required) return 'correct';
    if (totalBridges > island.required) return 'error';
    return 'neutral';
  };

  const reset = () => {
    setBridges([]);
    setSelectedIsland(null);
  };

  const gridSize = 7;
  const cellSize = 60;

  return (
    <div className="flex flex-col items-center gap-8">
      {solved && (
        <div className="rounded-xl border-2 border-green-400/50 bg-green-400/10 px-8 py-4 text-green-400 text-lg font-semibold">
          ✨ Puzzle Solved — All islands connected!
        </div>
      )}

      <div className="rounded-2xl bg-[#0a1628] p-10 shadow-2xl">
        <div
          className="relative"
          style={{
            width: gridSize * cellSize,
            height: gridSize * cellSize,
          }}
        >
          {/* Draw bridges */}
          <svg
            className="absolute top-0 left-0 pointer-events-none"
            width={gridSize * cellSize}
            height={gridSize * cellSize}
          >
            {bridges.map((bridge, idx) => {
              const fromIsland = ISLANDS.find(i => i.id === bridge.from)!;
              const toIsland = ISLANDS.find(i => i.id === bridge.to)!;

              const x1 = fromIsland.col * cellSize + cellSize / 2;
              const y1 = fromIsland.row * cellSize + cellSize / 2;
              const x2 = toIsland.col * cellSize + cellSize / 2;
              const y2 = toIsland.row * cellSize + cellSize / 2;

              const isHorizontal = fromIsland.row === toIsland.row;
              const offset = bridge.double ? 3 : 0;

              return (
                <g key={idx}>
                  <line
                    x1={x1}
                    y1={isHorizontal ? y1 - offset : y1}
                    x2={x2}
                    y2={isHorizontal ? y2 - offset : y2}
                    stroke="#22c55e"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {bridge.double && (
                    <line
                      x1={x1}
                      y1={isHorizontal ? y1 + offset : y1}
                      x2={x2}
                      y2={isHorizontal ? y2 + offset : y2}
                      stroke="#22c55e"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Draw islands */}
          {ISLANDS.map((island) => {
            const status = getIslandStatus(island);
            const isSelected = selectedIsland?.id === island.id;

            return (
              <button
                key={island.id}
                onClick={() => handleIslandClick(island)}
                className={`absolute rounded-full w-12 h-12 font-bold text-xl transition-all duration-200 cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-blue-500 text-white border-2 border-blue-300 scale-110 z-10'
                    : status === 'correct'
                    ? 'bg-green-500/20 text-green-400 border-2 border-green-400'
                    : status === 'error'
                    ? 'bg-red-500/20 text-red-400 border-2 border-red-400'
                    : 'bg-slate-700 text-white hover:bg-slate-600 border-2 border-slate-500'
                }`}
                style={{
                  left: island.col * cellSize + cellSize / 2 - 24,
                  top: island.row * cellSize + cellSize / 2 - 24,
                }}
              >
                {island.required}
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-slate-400 text-sm text-center max-w-md">
        <p className="mb-2">Click two islands to connect them with bridges</p>
        <p>Click again to toggle single/double bridges, or click a third time to remove</p>
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