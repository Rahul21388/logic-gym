// app/2048/Game2048.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  GameState,
  createInitialState,
  applyMove,
  Direction,
  SIZE,
} from './game2048Logic';

const KEY_TO_DIR: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

export default function Game2048() {
  const [state, setState] = useState<GameState>(createInitialState);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const dir = KEY_TO_DIR[e.key];
      if (!dir) return;
      e.preventDefault();
      setState(prev => applyMove(prev, dir));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Swipe controls (mobile)
  const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = e => {
    const t = e.touches[0];
    setTouchStart({ x: t.clientX, y: t.clientY });
  };

  const handleTouchEnd: React.TouchEventHandler<HTMLDivElement> = e => {
    if (!touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const threshold = 24; // minimum swipe distance in px

    if (Math.max(absX, absY) < threshold) {
      setTouchStart(null);
      return;
    }

    let dir: Direction | null = null;
    if (absX > absY) {
      dir = dx > 0 ? 'right' : 'left';
    } else {
      dir = dy > 0 ? 'down' : 'up';
    }

    if (dir) {
      setState(prev => applyMove(prev, dir!));
    }
    setTouchStart(null);
  };

  const reset = () => setState(createInitialState());

  const getTileClasses = (value: number): string => {
    const base =
      'flex items-center justify-center rounded-md font-extrabold transition-all duration-150 text-lg md:text-2xl';

    if (value === 0) return base + ' bg-slate-800/40';

    const colourMap: Record<number, string> = {
      2: 'bg-[#eee4da] text-[#776e65]',
      4: 'bg-[#ede0c8] text-[#776e65]',
      8: 'bg-[#f2b179] text-white',
      16: 'bg-[#f59563] text-white',
      32: 'bg-[#f67c5f] text-white',
      64: 'bg-[#f65e3b] text-white',
      128: 'bg-[#edcf72] text-white text-xl md:text-3xl',
      256: 'bg-[#edcc61] text-white text-xl md:text-3xl',
      512: 'bg-[#edc850] text-white text-xl md:text-3xl',
      1024: 'bg-[#edc53f] text-white text-2xl md:text-4xl',
      2048: 'bg-[#edc22e] text-white text-2xl md:text-4xl',
    };

    const colour =
      colourMap[value] ??
      'bg-[#3c3a32] text-white text-2xl md:text-4xl';

    return `${base} ${colour}`;
  };

  const boardSizeClass =
    'w-[min(92vw,360px)] md:w-[360px] aspect-square rounded-2xl bg-[#0d1624] p-3 md:p-4 shadow-2xl';

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Status */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-3">
          <div className="rounded-lg bg-slate-900/80 px-4 py-2 text-center">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Score
            </div>
            <div className="text-lg md:text-xl font-bold text-amber-300">
              {state.score}
            </div>
          </div>
        </div>

        {state.won && !state.over && (
          <div className="rounded-lg border border-emerald-400/60 bg-emerald-500/10 px-4 py-2 text-emerald-300 text-sm md:text-base font-medium text-center">
            🎉 Tile 2048 reached! Keep playing for a higher score.
          </div>
        )}

        {state.over && (
          <div className="rounded-lg border border-red-400/60 bg-red-500/10 px-4 py-2 text-red-300 text-sm md:text-base font-medium text-center">
            Game over — no more moves.
          </div>
        )}
      </div>

      {/* Board */}
      <div
        className={boardSizeClass}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="grid h-full w-full gap-2 md:gap-3"
          style={{
            gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))`,
          }}
        >
          {state.board.map((row, r) =>
            row.map((value, c) => (
              <div key={`${r}-${c}`} className={getTileClasses(value)}>
                {value !== 0 ? value : ''}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Helper text + controls */}
      <div className="space-y-1 text-slate-300 text-xs md:text-sm text-center max-w-xs">
        <p>On desktop: use arrow keys. On mobile: swipe in any direction.</p>
        <p>Combine tiles with the same number to reach 2048 and beyond.</p>
      </div>

      <button
        onClick={reset}
        className="px-6 py-2.5 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-white text-sm md:text-base font-medium transition-all duration-200 hover:scale-105 active:scale-95"
      >
        New game
      </button>
    </div>
  );
}
