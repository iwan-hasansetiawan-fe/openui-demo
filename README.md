# OpenUI Chat + Recharts + Anthropic — Next.js Example

Contoh implementasi aplikasi chat dengan **Generative UI** menggunakan:

| | |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **LLM** | Anthropic Claude (`claude-sonnet-4-5`) |
| **Generative UI** | OpenUI (`@openuidev/react-ui`) |
| **Chart Library** | Recharts |
| **Styling** | Tailwind CSS |

---

## Struktur Project

```
openui-chat-example/
├── app/
│   ├── api/chat/
│   │   └── route.ts              # BE: Anthropic streaming → OpenAI SSE format
│   ├── chat/
│   │   └── page.tsx              # FE: Chat page dengan OpenUI FullScreen
│   ├── layout.tsx
│   ├── page.tsx                  # Redirect ke /chat
│   └── globals.css
├── lib/
│   ├── chart-library.ts          # Custom Recharts components untuk OpenUI
│   └── mock-data/
│       └── sales.ts              # Data dummy + contoh OpenUI Lang output
├── generated/
│   └── chart-system-prompt.txt   # Auto-generated — JANGAN edit manual
├── types/
│   └── txt.d.ts
├── next.config.ts
├── .env.local.example
└── package.json
```

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Setup environment variable
```bash
cp .env.local.example .env.local
# Edit .env.local → isi ANTHROPIC_API_KEY
```

### 3. Generate system prompt (WAJIB)
```bash
npm run generate:prompt
```
Ulangi setiap kali `lib/chart-library.ts` berubah.

### 4. Jalankan dev server
```bash
npm run dev
```

---

## Arsitektur

```
FE: app/chat/page.tsx
  → POST /api/chat { messages }

BE: app/api/chat/route.ts
  → inject chart-system-prompt.txt sebagai system message
  → Anthropic Claude stream
  → convert ke OpenAI SSE format
  → return ke FE

FE: openAIReadableStreamAdapter() parse SSE
  → <FullScreen componentLibrary={chartLibrary} /> render
  → Recharts chart muncul streaming
```

**Kenapa convert Anthropic → OpenAI SSE?**
OpenUI FE menggunakan `openAIReadableStreamAdapter` yang expects format SSE OpenAI.
BE melakukan konversi agar FE tidak perlu tahu provider yang digunakan.

---

## Komponen Chart

### RechartsLineChart — tren over time
```
root = Card([header, chart])
header = CardHeader("Tren Revenue 2024", "Jan – Des")
p1 = DataPoint("Jan", [1240])
p2 = DataPoint("Feb", [1580])
chart = RechartsLineChart("Revenue (juta Rp)", ["Revenue"], [p1, p2])
```

### RechartsBarChart — perbandingan kategori (multi-series)
```
root = Card([header, chart])
header = CardHeader("Penjualan per Kategori", "Q3 vs Q4")
p1 = DataPoint("Elektronik", [1240, 1840])
p2 = DataPoint("Fashion", [980, 1320])
chart = RechartsBarChart("Units Terjual", ["Q3 2024", "Q4 2024"], [p1, p2])
```

### RechartsPieChart — komposisi/proporsi
```
root = Card([header, chart])
header = CardHeader("Revenue per Channel", "Q4 2024")
s1 = RechartsPieSlice("Marketplace", 48)
s2 = RechartsPieSlice("Website", 27)
chart = RechartsPieChart("Revenue Breakdown", [s1, s2])
```

---

## Troubleshooting

| Masalah | Solusi |
|---|---|
| LLM hanya teks, tidak ada chart | Jalankan `npm run generate:prompt` |
| `Cannot find module '*.txt'` | Jalankan `npm run generate:prompt` |
| `ANTHROPIC_API_KEY is not set` | Cek `.env.local` |
| Chart kosong / data tidak muncul | Pastikan urutan `values[]` di `DataPoint` match dengan `series[]` di chart |
