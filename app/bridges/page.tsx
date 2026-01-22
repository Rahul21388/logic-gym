import BridgesGame from './BridgesGame';
import Link from 'next/link';

export default function BridgesPage() {
  return (
    <main className="min-h-screen bg-[#050d1a] text-white px-10 py-8">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors duration-200"
      >
        <span>←</span>
        <span>Back to Home</span>
      </Link>

      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-3 text-green-400">
          Bridges
        </h1>
        <p className="text-slate-400 text-lg">
          Connect islands with bridges according to the numbers
        </p>
      </div>

      <BridgesGame />
    </main>
  );
}