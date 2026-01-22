'use client';

import { useState } from 'react';
import Link from 'next/link';

type Choice = 'Rock' | 'Paper' | 'Scissors' | null;

const choices: Choice[] = ['Rock', 'Paper', 'Scissors'];

function getResult(player: Choice, ai: Choice) {
  if (!player || !ai) return '';
  if (player === ai) return "It's a Draw 🤝";

  if (
    (player === 'Rock' && ai === 'Scissors') ||
    (player === 'Paper' && ai === 'Rock') ||
    (player === 'Scissors' && ai === 'Paper')
  ) {
    return 'You Win 🎉';
  }

  return 'AI Wins 🤖';
}

export default function RockPaperScissorsPage() {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [aiChoice, setAiChoice] = useState<Choice>(null);
  const [result, setResult] = useState('');

  function play(choice: Choice) {
    const aiMove = choices[Math.floor(Math.random() * 3)];
    setPlayerChoice(choice);
    setAiChoice(aiMove);
    setResult(getResult(choice, aiMove));
  }

  function reset() {
    setPlayerChoice(null);
    setAiChoice(null);
    setResult('');
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <Link href="/" style={styles.back}>
          ← Back to Home
        </Link>
        <h1 style={styles.title}>Rock · Paper · Scissors</h1>
        <p style={styles.subtitle}>Classic quick-play game vs AI</p>
      </header>

      <section style={styles.game}>
        <div style={styles.choices}>
          <button style={styles.button} onClick={() => play('Rock')}>✊ Rock</button>
          <button style={styles.button} onClick={() => play('Paper')}>✋ Paper</button>
          <button style={styles.button} onClick={() => play('Scissors')}>✌️ Scissors</button>
        </div>

        {playerChoice && (
          <div style={styles.resultBox}>
            <p>You chose: <strong>{playerChoice}</strong></p>
            <p>AI chose: <strong>{aiChoice}</strong></p>
            <h2 style={styles.result}>{result}</h2>
          </div>
        )}

        {playerChoice && (
          <button style={styles.reset} onClick={reset}>
            Play Again
          </button>
        )}
      </section>
    </main>
  );
}

/* ---------- Styles ---------- */

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top, #0b1220, #020617)',
    color: '#e5e7eb',
    padding: '40px',
  },
  header: {
    maxWidth: 900,
    margin: '0 auto 40px',
  },
  back: {
    color: '#22c55e',
    textDecoration: 'none',
    fontSize: 14,
  },
  title: {
    fontSize: 36,
    marginTop: 10,
  },
  subtitle: {
    color: '#9ca3af',
  },
  game: {
    maxWidth: 600,
    margin: '0 auto',
    textAlign: 'center',
  },
  choices: {
    display: 'flex',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  button: {
    background: '#111827',
    border: '1px solid #1f2933',
    color: '#e5e7eb',
    padding: '16px 24px',
    borderRadius: 12,
    fontSize: 18,
    cursor: 'pointer',
  },
  resultBox: {
    background: '#020617',
    border: '1px solid #1f2933',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  result: {
    marginTop: 10,
    fontSize: 24,
  },
  reset: {
    background: '#22c55e',
    border: 'none',
    color: '#022c22',
    padding: '12px 24px',
    borderRadius: 10,
    fontSize: 16,
    cursor: 'pointer',
  },
};
