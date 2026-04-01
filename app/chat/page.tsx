/**
 * app/chat/page.tsx
 *
 * Halaman chat utama dengan dua mode:
 *  - MOCK mode : tidak butuh API key, response dari hardcoded OpenUI Lang
 *  - LIVE mode : menggunakan OpenAI GPT-4o via /api/chat
 *
 * Toggle mode via tombol di pojok kanan atas.
 */

"use client";

import { useState } from "react";
import { FullScreen } from "@openuidev/react-ui";
import {
  openAIReadableStreamAdapter,
  openAIMessageFormat,
} from "@openuidev/react-headless";
import { chartLibrary } from "@/lib/chart-library";

type Mode = "mock" | "live";

export default function ChatPage() {
  const [mode, setMode] = useState<Mode>("mock");

  return (
    <div className="h-screen w-full relative">
      {/* ── Mode toggle ──────────────────────────────────────────────────── */}
      <div className="absolute top-3 right-4 z-50 flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm text-xs font-medium">
        <span className={mode === "mock" ? "text-gray-400" : "text-indigo-600"}>
          Live
        </span>
        <button
          onClick={() => setMode((m) => (m === "mock" ? "live" : "mock"))}
          className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
            mode === "mock" ? "bg-indigo-500" : "bg-gray-300"
          }`}
          title={
            mode === "mock"
              ? "Switch to Live (requires API key)"
              : "Switch to Mock"
          }
        >
          <span
            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
              mode === "mock" ? "translate-x-0.5" : "translate-x-5"
            }`}
          />
        </button>
        <span className={mode === "mock" ? "text-indigo-600" : "text-gray-400"}>
          Mock
        </span>
      </div>

      {/* ── Chat UI ─────────────────────────────────────────────────────── */}
      <FullScreen
        key={mode} // re-mount saat mode berubah agar conversation reset
        processMessage={async ({ messages, abortController }) => {
          const endpoint = mode === "mock" ? "/api/chat-mock" : "/api/chat";
          return fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: openAIMessageFormat.toApi(messages),
            }),
            signal: abortController.signal,
          });
        }}
        streamProtocol={openAIReadableStreamAdapter()}
        componentLibrary={chartLibrary}
        agentName={mode === "mock" ? "Data Assistant (Mock)" : "Data Assistant"}
        welcomeMessage={{
          title:
            mode === "mock"
              ? "Mock Mode — Tanpa API Key"
              : "Data & Diagram Assistant",
          description:
            mode === "mock"
              ? "Mode simulasi aktif. Response menggunakan data dummy — tidak perlu API key. Gunakan toggle di pojok kanan atas untuk beralih ke mode Live."
              : "Powered by OpenAI GPT-4o. Tanyakan tentang data atau minta diagram interaktif.",
        }}
        conversationStarters={{
          variant: "long",
          options: [
            {
              displayText: "📈 Tren penjualan bulanan",
              prompt:
                "Tampilkan tren penjualan bulanan sepanjang 2024 dalam bentuk line chart. " +
                "Data: Jan 1.24M, Feb 1.58M, Mar 1.42M, Apr 1.89M, Mei 2.10M, Jun 1.95M, " +
                "Jul 2.35M, Agu 2.18M, Sep 2.56M, Okt 2.80M, Nov 3.20M, Des 3.85M (dalam juta Rp).",
            },
            {
              displayText: "📊 Perbandingan kategori produk",
              prompt:
                "Bandingkan penjualan per kategori antara Q3 dan Q4 2024 menggunakan bar chart. " +
                "Data Q3 vs Q4: Elektronik 1240 vs 1840, Fashion 980 vs 1320, " +
                "Grocery 2100 vs 2650, Home & Living 560 vs 780, Olahraga 720 vs 950 unit.",
            },
            {
              displayText: "🔀 Alur approval purchase order",
              prompt:
                "Gambarkan alur approval purchase order menggunakan diagram interaktif. " +
                "Alurnya: Request PO → Review Manager → Disetujui? " +
                "Jika Ya → Finance Review → PO Diterbitkan. Jika Tidak → Ditolak.",
            },
            {
              displayText: "🏗️ Arsitektur microservice",
              prompt:
                "Visualisasikan arsitektur microservice: API Gateway meneruskan ke Auth, User, dan Order Service. " +
                "Order Service terhubung ke Payment dan Notification Service. " +
                "Semua service terhubung ke Database terpusat.",
            },
            {
              displayText: "🥧 Komposisi revenue per channel",
              prompt:
                "Tampilkan komposisi revenue per channel Q4 2024 dalam pie chart. " +
                "Data: Marketplace 48%, Website 27%, Offline Store 15%, Reseller 7%, Social Commerce 3%.",
            },
          ],
        }}
      />
    </div>
  );
}
