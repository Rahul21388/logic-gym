// page.tsx
import Link from 'next/link';
import NurikabeGame from './NurikabeGame';

export default function NurikabePage() {
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
            Nurikabe
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl">
            Build islands and seas on a grid. Numbered cells show the size of
            each island. The black cells form a single sea with no 2×2 pools.
          </p>
        </header>

        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
          {/* Game */}
          <div className="flex justify-center">
            <NurikabeGame />
          </div>

          {/* Explanation */}
          <aside className="space-y-6 rounded-2xl bg-[#071022] p-5 md:p-7 border border-slate-800/80">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-green-300">
                What is Nurikabe?
              </h2>
              <p className="text-slate-300 text-sm md:text-base">
                Nurikabe is a Japanese logic puzzle about islands and sea. The
                numbered cells are islands, and the black cells form the sea.
                Each number tells you how many white cells belong to that island.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-green-300">
                How to play
              </h3>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-200 text-sm md:text-base">
                <li>
                  Each number is part of a white island of exactly that many
                  orthogonally connected white cells.
                </li>
                <li>
                  Every island contains exactly one number; islands cannot touch
                  horizontally or vertically (only diagonally).
                </li>
                <li>
                  Black cells form the sea. All black cells must be connected in
                  one group, with no 2×2 block of black cells.
                </li>
                <li>
                  When all islands and sea rules are satisfied, the puzzle is
                  solved.
                </li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-green-300">
                Controls
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-slate-200 text-sm md:text-base">
                <li>
                  Click an empty cell to cycle: unknown → black (sea) → white
                  (island) → unknown.
                </li>
                <li>
                  Numbered cells are fixed white cells (island cores) and cannot
                  be changed.
                </li>
                <li>
                  Red outlines highlight sea errors; amber outlines highlight
                  island issues while you experiment.
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-green-300">
                Beginner tips
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-slate-200 text-sm md:text-base">
                <li>
                  Large numbers usually force several neighbours to be white to
                  reach the required island size.
                </li>
                <li>
                  Whenever a 2×2 block of potential black cells appears, at
                  least one of them must stay white.
                </li>
                <li>
                  Use the connectivity rule: avoid cutting the sea into
                  separated lakes as you mark black cells.
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
