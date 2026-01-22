// page.tsx
import Link from 'next/link';
import BridgesGame from './BridgesGame';

export default function BridgesPage() {
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
            Bridges
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl">
            Connect numbered islands with bridges to form a single network. Each
            island must have exactly the number of bridges shown on it.
          </p>
        </header>

        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
          {/* Game */}
          <div className="flex justify-center">
            <BridgesGame />
          </div>

          {/* Explanation */}
          <aside className="space-y-6 rounded-2xl bg-[#071022] p-5 md:p-7 border border-slate-800/80">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-green-300">
                What is Bridges?
              </h2>
              <p className="text-slate-300 text-sm md:text-base">
                Bridges (also called Hashiwokakero) is a logic puzzle where you
                connect islands with bridges. The number on each island tells
                you how many bridges must touch it in the final solution.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-green-300">
                How to play
              </h3>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-200 text-sm md:text-base">
                <li>Bridges must run horizontally or vertically between islands.</li>
                <li>You can place up to two parallel bridges between the same pair of islands.</li>
                <li>
                  The number on an island is the total number of bridges that must connect to it.
                </li>
                <li>
                  All islands must be part of a single connected network – there cannot be isolated groups.
                </li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-green-300">
                Controls
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-slate-200 text-sm md:text-base">
                <li>
                  Click an island to cycle one of its bridges: 0 → 1 → 2 → 0
                  bridges on one of its connections.
                </li>
                <li>
                  The colour of an island helps you track progress: green when
                  its bridge count is exactly right, red if it is overloaded.
                </li>
                <li>
                  Use the <span className="font-semibold">Reset puzzle</span>{' '}
                  button to clear all bridges.
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-green-300">
                Beginner tips
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-slate-200 text-sm md:text-base">
                <li>
                  Islands with high numbers often need two bridges in most directions.
                </li>
                <li>
                  Avoid creating separate groups of islands; everything must stay connected.
                </li>
                <li>
                  When an island reaches its required number, treat its bridges as fixed.
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
