// app/2048/page.tsx
import Link from 'next/link';
import Game2048 from './Game2048';

export default function Game2048Page() {
  return (
    <main className="min-h-screen bg-[#050d1a] text-white px-4 md:px-10 py-8">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors duration-200"
      >
        <span>←</span>
        <span>Back to home</span>
      </Link>

      <div className="mx-auto max-w-6xl space-y-10">
        {/* Header */}
        <header className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold text-green-400">
            2048
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl">
            Slide numbered tiles on a 4×4 grid to merge them and create the 2048
            tile. Every move adds a new tile, so plan ahead to avoid running out
            of space.
          </p>
        </header>

        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
          {/* Game */}
          <div className="flex justify-center">
            <Game2048 />
          </div>

          {/* Explanation */}
          <aside className="space-y-6 rounded-2xl bg-[#071022] p-5 md:p-7 border border-slate-800/80">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-green-300">
                What is 2048?
              </h2>
              <p className="text-slate-300 text-sm md:text-base">
                2048 is a single‑player sliding tile game. Combine tiles with
                the same number by moving them in one of four directions. Each
                merge doubles the number and adds to your score. [web:55]
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-green-300">
                How to play
              </h3>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-200 text-sm md:text-base">
                <li>All tiles slide as far as possible in the chosen direction.</li>
                <li>
                  When two tiles with the same value collide, they merge into a
                  single tile with double the value, and that value is added to
                  your score. [web:55][web:59]
                </li>
                <li>
                  After each move, a new tile (2 or occasionally 4) appears in a
                  random empty cell. [web:55][web:57]
                </li>
                <li>
                  The game is over when no moves are left; reaching 2048 is the
                  classic win condition, but you can keep playing for a higher
                  score. [web:55]
                </li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-green-300">
                Controls
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-slate-200 text-sm md:text-base">
                <li>Desktop: Use the arrow keys to move tiles.</li>
                <li>Mobile: Swipe up, down, left, or right on the board.</li>
                <li>
                  Press <span className="font-semibold">New game</span> to reset
                  the grid and start again.
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-green-300">
                Strategy tips
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-slate-200 text-sm md:text-base">
                <li>
                  Keep your highest tile in a corner and build around that
                  corner whenever possible. [web:58]
                </li>
                <li>
                  Avoid random swiping; favour two main directions (e.g. left
                  and down) and use the others only when necessary. [web:58]
                </li>
                <li>
                  Look two or three moves ahead so new tiles do not block your
                  large merges.
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
