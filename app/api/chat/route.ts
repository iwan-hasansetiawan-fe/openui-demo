/**
 * app/api/chat/route.ts
 *
 * BE endpoint untuk chat menggunakan OpenAI.
 * Menerima messages dari FE, meng-inject system prompt OpenUI + Recharts,
 * lalu pipe OpenAI stream langsung ke FE.
 *
 * Flow:
 *   FE → POST /api/chat { messages }
 *      → inject system prompt
 *      → OpenAI GPT-4o (stream)
 *      → SSE stream langsung ke FE
 */

import { NextRequest } from "next/server";
import OpenAI from "openai";

// System prompt di-generate dari lib/chart-library.ts via:
//   npm run generate:prompt
// WAJIB ada sebelum menjalankan app.
import systemPromptContent from "@/generated/chart-system-prompt.txt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body as {
      messages: { role: "user" | "assistant" | "system"; content: string }[];
    };

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Inject system prompt ke awal conversation
    const messagesWithSystem = [
      { role: "system" as const, content: systemPromptContent },
      ...messages,
    ];

    // Stream dari OpenAI — pipe langsung ke FE tanpa konversi
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      stream: true,
      temperature: 0.3, // lebih rendah = output OpenUI Lang lebih konsisten
      messages: messagesWithSystem,
    });

    return new Response(stream.toReadableStream(), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[/api/chat] Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
