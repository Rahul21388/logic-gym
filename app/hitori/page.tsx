import Link from 'next/link';
import HitoriGame from './HitoriGame';

export default function HitoriPage() {
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
            Hitori
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl">
            A clean, number‑based logic puzzle. Shade out extra copies of numbers
            so that every row and column has only unique values in the cells that
            remain white.
          </p>
        </header>

        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
          {/* Game */}
          <div className="flex justify-center">
            <HitoriGame />
          </div>

          {/* Explanation + rules */}
          <aside className="space-y-6 rounded-2xl bg-[#071022] p-5 md:p-7 border border-slate-800/80">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-green-300">
                What is Hitori?
              </h2>
              <p className="text-slate-300 text-sm md:text-base">
                Hitori is a Japanese logic puzzle played on a grid of numbers.
                Your goal is to shade (remove) some cells so that the remaining
                white cells follow a small set of strict rules.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-green-300">
                How to play
              </h3>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-200 text-sm md:text-base">
                <li>
                  In each row and each column, every number must appear at most
                  once among the white (unshaded or circled) cells.
                </li>
                <li>
                  Shade cells to remove extra copies. Shaded cells are treated as
                  black blocks and do not count when checking for duplicates.
                </li>
                <li>
                  Shaded cells cannot touch horizontally or vertically. They may
                  touch diagonally.
                </li>
                <li>
                  All white cells must stay connected as one group via side‑to‑side
                  moves. The white region cannot split into separate islands.
                </li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-green-300">
                Controls
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-slate-200 text-sm md:text-base">
                <li>Click a cell: shade it (mark as removed).</li>
                <li>Click again: circle it to mark it as definitely white.</li>
                <li>Click a third time: clear the cell back to undecided.</li>
                <li>
                  Use the <span className="font-semibold">Reset puzzle</span>{' '}
                  button to start from a fresh grid.
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-green-300">
                Beginner tips
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-slate-200 text-sm md:text-base">
                <li>
                  Look for rows or columns with many copies of the same number;
                  at least one of them must be shaded.
                </li>
                <li>
                  Whenever shading a cell would force two black cells to touch, that
                  cell probably needs to stay white.
                </li>
                <li>
                  Keep an eye on connectivity: avoid creating isolated white
                  islands as you shade cells.
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
