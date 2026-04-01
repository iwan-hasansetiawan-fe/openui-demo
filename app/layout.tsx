/**
 * app/layout.tsx
 */

import type { Metadata } from "next";
import "./globals.css";

// Import OpenUI styles — path yang benar sesuai package exports
import "@openuidev/react-ui/styles/index.css";
import "@openuidev/react-ui/defaults.css";

export const metadata: Metadata = {
  title: "OpenUI Chat + Recharts",
  description: "Example chat app with Generative UI charts using OpenUI + Recharts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
