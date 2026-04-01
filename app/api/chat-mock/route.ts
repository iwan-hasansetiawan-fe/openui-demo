/**
 * app/api/chat-mock/route.ts
 *
 * Mock endpoint untuk simulasi tanpa API key.
 * Mengembalikan hardcoded OpenUI Lang sebagai NDJSON stream —
 * format yang dibutuhkan openAIReadableStreamAdapter di FE.
 *
 * Perbedaan SSE vs NDJSON:
 *   SSE   (SALAH): "data: {...}\n\n"
 *   NDJSON (BENAR): "{...}\n"
 */

import { NextRequest } from "next/server";

const RESPONSES: Record<string, string> = {
  line: `root = Card([header, chart, note])
header = CardHeader("Tren Penjualan Bulanan 2024", "Jan - Des")
p1  = DataPoint("Jan", [1240])
p2  = DataPoint("Feb", [1580])
p3  = DataPoint("Mar", [1420])
p4  = DataPoint("Apr", [1890])
p5  = DataPoint("Mei", [2100])
p6  = DataPoint("Jun", [1950])
p7  = DataPoint("Jul", [2350])
p8  = DataPoint("Agu", [2180])
p9  = DataPoint("Sep", [2560])
p10 = DataPoint("Okt", [2800])
p11 = DataPoint("Nov", [3200])
p12 = DataPoint("Des", [3850])
chart = RechartsLineChart("Revenue (juta Rp)", ["Revenue (juta Rp)"], [p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p12])
note = TextContent("Total revenue 2024: Rp 29,12 Miliar. Pertumbuhan YoY: +68%", "small")`,

  bar: `root = Card([header, chart])
header = CardHeader("Performa Kategori Q3 vs Q4 2024", "Perbandingan Units Terjual")
p1 = DataPoint("Elektronik",    [1240, 1840])
p2 = DataPoint("Fashion",       [980,  1320])
p3 = DataPoint("Grocery",       [2100, 2650])
p4 = DataPoint("Home & Living", [560,  780])
p5 = DataPoint("Olahraga",      [720,  950])
chart = RechartsBarChart("Units Terjual", ["Q3 2024", "Q4 2024"], [p1, p2, p3, p4, p5])`,

  pie: `root = Card([header, chart, summary])
header = CardHeader("Komposisi Revenue per Channel", "Q4 2024")
s1 = RechartsPieSlice("Marketplace", 48)
s2 = RechartsPieSlice("Website", 27)
s3 = RechartsPieSlice("Offline Store", 15)
s4 = RechartsPieSlice("Reseller", 7)
s5 = RechartsPieSlice("Social Commerce", 3)
chart = RechartsPieChart("Revenue Breakdown", [s1, s2, s3, s4, s5])
summary = TextContent("Marketplace mendominasi dengan 48% dari total revenue Q4.", "small")`,

  flowApproval: `root = Card([header, diagram])
header = CardHeader("Alur Approval Purchase Order")
n1 = FlowNode("n1", "Request PO", "input")
n2 = FlowNode("n2", "Review Manager", "default")
n3 = FlowNode("n3", "Disetujui?", "default")
n4 = FlowNode("n4", "Finance Review", "default")
n5 = FlowNode("n5", "Ditolak", "output")
n6 = FlowNode("n6", "PO Diterbitkan", "output")
e1 = FlowEdge("e1", "n1", "n2", "Submit")
e2 = FlowEdge("e2", "n2", "n3", "Review")
e3 = FlowEdge("e3", "n3", "n4", "Ya")
e4 = FlowEdge("e4", "n3", "n5", "Tidak")
e5 = FlowEdge("e5", "n4", "n6", "Approve")
diagram = FlowDiagram("Purchase Order Approval Flow", [n1,n2,n3,n4,n5,n6], [e1,e2,e3,e4,e5])`,

  flowArchitecture: `root = Card([header, diagram, note])
header = CardHeader("Arsitektur Microservice")
n1 = FlowNode("gw",      "API Gateway",     "input")
n2 = FlowNode("auth",    "Auth Service",     "default")
n3 = FlowNode("user",    "User Service",     "default")
n4 = FlowNode("order",   "Order Service",    "default")
n5 = FlowNode("payment", "Payment Service",  "default")
n6 = FlowNode("notif",   "Notif Service",    "default")
n7 = FlowNode("db",      "Database",         "output")
n8 = FlowNode("queue",   "Message Queue",    "output")
e1 = FlowEdge("e1", "gw",    "auth",    "Authenticate")
e2 = FlowEdge("e2", "gw",    "user",    "User data")
e3 = FlowEdge("e3", "gw",    "order",   "Orders")
e4 = FlowEdge("e4", "order", "payment", "Payment")
e5 = FlowEdge("e5", "order", "notif",   "Notify")
e6 = FlowEdge("e6", "auth",  "db")
e7 = FlowEdge("e7", "user",  "db")
e8 = FlowEdge("e8", "order", "db")
e9 = FlowEdge("e9", "notif", "queue")
diagram = FlowDiagram("Microservice Architecture", [n1,n2,n3,n4,n5,n6,n7,n8], [e1,e2,e3,e4,e5,e6,e7,e8,e9])
note = TextContent("Semua request masuk melalui API Gateway. Database terpusat.", "small")`,

  dashboard: `root = Card([header, bar_section, line_section])
header = CardHeader("Dashboard Penjualan", "Q4 2024")
bp1 = DataPoint("Okt", [2800, 2100])
bp2 = DataPoint("Nov", [3200, 2580])
bp3 = DataPoint("Des", [3850, 3210])
bar_section = RechartsBarChart("Revenue vs Target (juta Rp)", ["Actual", "Target"], [bp1, bp2, bp3])
lp1  = DataPoint("W1",  [620])
lp2  = DataPoint("W2",  [710])
lp3  = DataPoint("W3",  [680])
lp4  = DataPoint("W4",  [790])
lp5  = DataPoint("W5",  [850])
lp6  = DataPoint("W6",  [920])
lp7  = DataPoint("W7",  [880])
lp8  = DataPoint("W8",  [960])
lp9  = DataPoint("W9",  [1050])
lp10 = DataPoint("W10", [980])
lp11 = DataPoint("W11", [1120])
lp12 = DataPoint("W12", [1340])
line_section = RechartsLineChart("Orders per Minggu", ["Orders"], [lp1,lp2,lp3,lp4,lp5,lp6,lp7,lp8,lp9,lp10,lp11,lp12])`,
};

function pickResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  if (msg.includes("arsitektur") || msg.includes("microservice") || msg.includes("micro"))
    return RESPONSES.flowArchitecture;
  if (msg.includes("approval") || msg.includes("flow") || msg.includes("alur") || msg.includes("diagram"))
    return RESPONSES.flowApproval;
  if (msg.includes("komposisi") || msg.includes("pie") || msg.includes("channel") || msg.includes("proporsi"))
    return RESPONSES.pie;
  if (msg.includes("kategori") || msg.includes("bar") || msg.includes("bandingkan") || msg.includes("perbandingan"))
    return RESPONSES.bar;
  if (msg.includes("tren") || msg.includes("line") || msg.includes("bulanan") || msg.includes("mingguan"))
    return RESPONSES.line;
  return RESPONSES.dashboard;
}

// NDJSON format: satu JSON object per baris, tanpa "data: " prefix
// openAIReadableStreamAdapter expects format ini (bukan SSE)
async function* streamAsNDJSON(text: string) {
  const tokens = text.match(/\S+|\n/g) ?? [];

  for (const token of tokens) {
    const chunk = {
      id: `chatcmpl-mock-${Date.now()}`,
      object: "chat.completion.chunk",
      created: Math.floor(Date.now() / 1000),
      model: "mock",
      choices: [
        {
          index: 0,
          delta: { role: "assistant", content: token + " " },
          finish_reason: null,
        },
      ],
    };
    yield JSON.stringify(chunk) + "\n";
    await new Promise((r) => setTimeout(r, 40));
  }

  // Finish chunk
  yield JSON.stringify({
    id: `chatcmpl-mock-${Date.now()}`,
    object: "chat.completion.chunk",
    created: Math.floor(Date.now() / 1000),
    model: "mock",
    choices: [{ index: 0, delta: {}, finish_reason: "stop" }],
  }) + "\n";
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages: { role: string; content: string }[] = body.messages ?? [];

  const lastUserMessage =
    [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  const responseText = pickResponse(lastUserMessage);
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of streamAsNDJSON(responseText)) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
