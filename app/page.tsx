"use client";

import { useState } from "react";
import Link from "next/link";
import React from "react";

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(true);
  const theme = darkMode ? dark : light;

  return (
    <main style={{ ...styles.container, background: theme.bg, color: theme.text }}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Logic Gym</h1>
          <p style={{ ...styles.subtitle, color: theme.subtext }}>
            Train your brain with pure logic puzzles
          </p>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{ ...styles.themeToggle, background: theme.card }}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </header>

      {/* Featured Games */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Featured Games</h2>

        <div style={styles.grid}>
          {FEATURED.map((game) => (
            <div key={game.title} style={{ ...styles.card, background: theme.card }}>
              <div style={styles.cardHeader}>
                <span style={styles.icon}>{game.icon}</span>
                <h3>{game.title}</h3>
              </div>
              <p style={{ color: theme.subtext }}>{game.desc}</p>

              {game.link ? (
                <Link href={game.link} style={styles.playButton}>
                  Play →
                </Link>
              ) : (
                <span style={styles.comingSoon}>Coming Soon</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Logic Gym */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Logic Gym</h2>

        <div style={styles.grid}>
          {LOGIC_GYM.map((game) => (
            <div key={game.title} style={{ ...styles.card, background: theme.card }}>
              <div style={styles.cardHeader}>
                <span style={styles.icon}>{game.icon}</span>
                <h3>{game.title}</h3>
              </div>
              <p style={{ color: theme.subtext }}>{game.desc}</p>

              {game.link ? (
                <Link href={game.link} style={styles.playButton}>
                  Play →
                </Link>
              ) : (
                <span style={styles.comingSoon}>Coming Soon</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <footer style={{ ...styles.footer, color: theme.subtext }}>
        Built by Rahul · Logic Gym
      </footer>
    </main>
  );
}

/* ================= DATA ================= */

const FEATURED = [
  {
    title: "Tic Tac Toe",
    icon: "❌⭕",
    desc: "Classic 1v1 or vs AI",
    link: "/tic-tac-toe",
  },
  {
    title: "Rock Paper Scissors",
    icon: "✊✋✌️",
    desc: "Quick matches. Solo or with friends.",
    link: "/rock-paper-scissors",
  },
  {
    title: "2048",
    icon: "🔢",
    desc: "Slide tiles and reach 2048.",
    link: "/2048",
  },
  {
    title: "Memory Match",
    icon: "🧠",
    desc: "Train your memory by matching cards.",
    link: "/memory-match",
  },
];

const LOGIC_GYM = [
  {
    title: "Hitori",
    icon: "🧩",
    desc: "Shade cells to remove duplicates",
    link: "/hitori",
  },
  {
    title: "Nurikabe",
    icon: "🏝️",
    desc: "Create islands of correct size",
    link: "/nurikabe",
  },
  {
    title: "Bridges",
    icon: "🌉",
    desc: "Connect islands with bridges",
    link: "/bridges",
  },
  {
    title: "Slitherlink",
    icon: "🔗",
    desc: "Draw a single closed loop",
    link: "/slitherlink",
  },
];

/* ================= THEMES ================= */

const dark = {
  bg: "radial-gradient(circle at top, #020617, #000)",
  card: "rgba(15,23,42,0.85)",
  text: "#f8fafc",
  subtext: "rgba(248,250,252,0.65)",
};

const light = {
  bg: "#f8fafc",
  card: "#ffffff",
  text: "#020617",
  subtext: "rgba(2,6,23,0.65)",
};

/* ================= STYLES ================= */

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    padding: "2rem",
    fontFamily: "system-ui, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2.5rem",
  },
  title: {
    fontSize: "2.4rem",
    marginBottom: "0.3rem",
  },
  subtitle: {
    fontSize: "0.95rem",
  },
  themeToggle: {
    fontSize: "1.2rem",
    padding: "0.5rem 0.7rem",
    borderRadius: "50%",
    border: "1px solid #334155",
    cursor: "pointer",
  },
  section: {
    marginBottom: "3rem",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    marginBottom: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    border: "1px solid rgba(148,163,184,0.25)",
    borderRadius: "18px",
    padding: "1.5rem",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    marginBottom: "0.5rem",
  },
  icon: {
    fontSize: "1.6rem",
  },
  playButton: {
    display: "inline-block",
    marginTop: "1rem",
    padding: "0.45rem 0.9rem",
    borderRadius: "8px",
    background: "#22c55e",
    color: "#020617",
    textDecoration: "none",
    fontWeight: 600,
  },
  comingSoon: {
    display: "inline-block",
    marginTop: "1rem",
    fontSize: "0.85rem",
    opacity: 0.6,
  },
  footer: {
    marginTop: "4rem",
    textAlign: "center",
    fontSize: "0.85rem",
  },
};
