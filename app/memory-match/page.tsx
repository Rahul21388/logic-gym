'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Card = {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
};

const EMOJIS = ['🍎', '🚗', '🐶', '🎧', '📚', '⚽', '🎮', '🧠'];

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function createDeck(): Card[] {
  return shuffle([...EMOJIS, ...EMOJIS]).map((value, i) => ({
    id: i,
    value,
    flipped: false,
    matched: false,
  }));
}

export default function MemoryMatchPage() {
  const [cards, setCards] = useState<Card[]>(createDeck);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  const won = cards.every(c => c.matched);

  function flip(index: number) {
    if (locked) return;
    if (cards[index].flipped || cards[index].matched) return;
    if (selected.length === 2) return;

    setCards(prev =>
      prev.map((c, i) =>
        i === index ? { ...c, flipped: true } : c
      )
    );
    setSelected(prev => [...prev, index]);
  }

  useEffect(() => {
    if (selected.length !== 2) return;

    const [a, b] = selected;

    const timer = setTimeout(() => {
      setLocked(true);
      setMoves(m => m + 1);

      setCards(prev => {
        if (prev[a].value === prev[b].value) {
          return prev.map((c, i) =>
            i === a || i === b ? { ...c, matched: true } : c
          );
        } else {
          return prev.map((c, i) =>
            i === a || i === b ? { ...c, flipped: false } : c
          );
        }
      });

      setSelected([]);
      setLocked(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [selected]);

  function reset() {
    setCards(createDeck());
    setSelected([]);
    setMoves(0);
    setLocked(false);
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <Link href="/" style={styles.back}>← Back to Home</Link>
        <h1 style={styles.title}>Memory Match</h1>
        <p style={styles.subtitle}>Match all pairs using memory</p>
      </header>

      <p style={styles.stats}>
        Moves: <strong>{moves}</strong>
      </p>

      <section style={styles.grid}>
        {cards.map((card, i) => (
          <button
            key={card.id}
            onClick={() => flip(i)}
            style={{
              ...styles.card,
              ...(card.flipped || card.matched ? styles.cardOpen : {}),
            }}
          >
            {(card.flipped || card.matched) && card.value}
          </button>
        ))}
      </section>

      {won && <p style={styles.win}>🎉 You won in {moves} moves!</p>}

      <button style={styles.reset} onClick={reset}>
        Reset Game
      </button>
    </main>
  );
}

/* ---------- Styles (NO shorthand conflicts) ---------- */

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top, #0b1220, #020617)',
    color: '#e5e7eb',
    padding: 40,
    textAlign: 'center',
  },
  header: { marginBottom: 20 },
  back: { color: '#22c55e', textDecoration: 'none', fontSize: 14 },
  title: { fontSize: 36 },
  subtitle: { color: '#9ca3af' },
  stats: { marginBottom: 12 },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 80px)',
    gap: 14,
    justifyContent: 'center',
    margin: '30px auto',
  },

  card: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#1f2937',
    borderRadius: 12,
    background: '#111827',
    fontSize: 32,
    cursor: 'pointer',
    color: 'transparent',
  },

  cardOpen: {
    background: '#1f2937',
    color: '#e5e7eb',
    borderColor: '#22c55e',
  },

  reset: {
    marginTop: 20,
    background: '#22c55e',
    border: 'none',
    color: '#022c22',
    padding: '12px 24px',
    borderRadius: 10,
    cursor: 'pointer',
  },

  win: {
    fontSize: 20,
    color: '#22c55e',
    marginTop: 10,
  },
};
