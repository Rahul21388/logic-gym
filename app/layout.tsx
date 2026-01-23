import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Logic Gym | Trailblazer",
    template: "%s | Logic Gym",
  },
  description: "Train your brain with pure logic puzzles and classic games.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Explicit PWA manifest link (required for Chrome detection) */}
        <link rel="manifest" href="/manifest.json" />

        {/* Optional but recommended */}
        <meta name="theme-color" content="#00e676" />
      </head>
      <body>{children}</body>
    </html>
  );
}
