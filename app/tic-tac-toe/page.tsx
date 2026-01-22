"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Player,
  Level,
  getAIMove,
  getWinningLine,
} from "@/lib/ticTacToeAI";

type Theme = "dark" | "light";

export default function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [winner, setWinner] = useState<Player>(null);
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [theme, setTheme] = useState<Theme>("dark");
  const [level, setLevel] = useState<Level>("easy");
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);
  const [isDraw, setIsDraw] = useState(false);

  function play(index: number) {
    if (!started || board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);

    const playerWin = getWinningLine(newBoard);
    if (playerWin) {
      setWinner("X");
      setWinLine(playerWin);
      return;
    }

    if (!newBoard.includes(null)) {
      setIsDraw(true);
      return;
    }

    setTimeout(() => {
      const move = getAIMove(newBoard, level);
      const aiBoard = [...newBoard];
      aiBoard[move] = "O";
      setBoard(aiBoard);

      const aiWin = getWinningLine(aiBoard);
      if (aiWin) {
        setWinner("O");
        setWinLine(aiWin);
        return;
      }

      if (!aiBoard.includes(null)) {
        setIsDraw(true);
      }
    }, 400);
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinLine(null);
    setIsDraw(false);
    setStarted(false);
  }

  return (
    <main
      className={`min-h-screen px-10 py-8 ${
        theme === "dark"
          ? "bg-[#050d1a] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/"
          className={`inline-flex items-center gap-2 transition-colors duration-200 ${
            theme === "dark"
              ? "text-green-400 hover:text-green-300"
              : "text-blue-600 hover:text-blue-500"
          }`}
        >
          <span>←</span>
          <span>Back to Home</span>
        </Link>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-2xl hover:scale-110 transition-transform duration-200"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>

      <div className="mb-12">
        <h1
          className={`text-5xl font-bold mb-3 ${
            theme === "dark" ? "text-green-400" : "text-blue-600"
          }`}
        >
          Tic Tac Toe
        </h1>
        <p
          className={`text-lg ${
            theme === "dark" ? "text-slate-400" : "text-slate-600"
          }`}
        >
          Play against AI
        </p>
      </div>

      <div className="flex flex-col items-center gap-8">
        {!started && (
          <div
            className={`rounded-2xl p-8 shadow-2xl w-full max-w-md ${
              theme === "dark" ? "bg-[#0a1628]" : "bg-white"
            }`}
          >
            <div className="flex flex-col gap-4">
              <input
                className={`px-4 py-3 rounded-lg text-lg transition-all duration-200 ${
                  theme === "dark"
                    ? "bg-slate-800/50 text-white border border-slate-700 focus:border-green-400 focus:outline-none"
                    : "bg-slate-100 text-slate-900 border border-slate-300 focus:border-blue-500 focus:outline-none"
                }`}
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <select
                className={`px-4 py-3 rounded-lg text-lg cursor-pointer transition-all duration-200 ${
                  theme === "dark"
                    ? "bg-slate-800/50 text-white border border-slate-700 focus:border-green-400 focus:outline-none"
                    : "bg-slate-100 text-slate-900 border border-slate-300 focus:border-blue-500 focus:outline-none"
                }`}
                value={level}
                onChange={(e) => setLevel(e.target.value as Level)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <button
                onClick={() => setStarted(true)}
                className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                  theme === "dark"
                    ? "bg-green-400/20 text-green-400 border-2 border-green-400/50 hover:bg-green-400/30"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Start Game
              </button>
            </div>
          </div>
        )}

        {started && (
          <>
            <div
              className={`text-2xl font-semibold px-6 py-3 rounded-xl transition-all duration-300 ${
                winner === "X"
                  ? theme === "dark"
                    ? "bg-green-400/10 text-green-400 border-2 border-green-400/50"
                    : "bg-green-500/20 text-green-600 border-2 border-green-500"
                  : winner === "O"
                  ? theme === "dark"
                    ? "bg-red-400/10 text-red-400 border-2 border-red-400/50"
                    : "bg-red-500/20 text-red-600 border-2 border-red-500"
                  : isDraw
                  ? theme === "dark"
                    ? "bg-yellow-400/10 text-yellow-400 border-2 border-yellow-400/50"
                    : "bg-yellow-500/20 text-yellow-600 border-2 border-yellow-500"
                  : theme === "dark"
                  ? "bg-blue-400/10 text-blue-400 border-2 border-blue-400/50"
                  : "bg-blue-500/20 text-blue-600 border-2 border-blue-500"
              }`}
            >
              {winner === "X" && `${name || "Player"} wins 🎉`}
              {winner === "O" && "Computer wins 🤖"}
              {isDraw && "It's a draw 🤝"}
              {!winner && !isDraw && "Your turn"}
            </div>

            <div
              className={`rounded-2xl p-8 shadow-2xl ${
                theme === "dark" ? "bg-[#0a1628]" : "bg-white"
              }`}
            >
              <div className="grid grid-cols-3 gap-3">
                {board.map((cell, i) => (
                  <button
                    key={i}
                    onClick={() => play(i)}
                    disabled={!!cell || !!winner || isDraw}
                    className={`w-24 h-24 rounded-lg text-5xl font-bold transition-all duration-200 ${
                      winLine?.includes(i)
                        ? theme === "dark"
                          ? "bg-green-500/30 border-2 border-green-400"
                          : "bg-green-500/40 border-2 border-green-500"
                        : cell === "X"
                        ? theme === "dark"
                          ? "bg-blue-500/15 text-blue-400"
                          : "bg-blue-500/20 text-blue-600"
                        : cell === "O"
                        ? theme === "dark"
                          ? "bg-pink-500/15 text-pink-400"
                          : "bg-pink-500/20 text-pink-600"
                        : theme === "dark"
                        ? "bg-slate-800/50 hover:bg-slate-700/70 cursor-pointer active:scale-95"
                        : "bg-slate-100 hover:bg-slate-200 cursor-pointer active:scale-95"
                    } ${
                      (winner || isDraw || cell) && !winLine?.includes(i)
                        ? "cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {cell}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={reset}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                theme === "dark"
                  ? "bg-slate-700/80 hover:bg-slate-600 text-white"
                  : "bg-slate-300 hover:bg-slate-400 text-slate-900"
              }`}
            >
              Reset Game
            </button>
          </>
        )}
      </div>
    </main>
  );
}