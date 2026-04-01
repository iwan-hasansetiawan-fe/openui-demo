/**
 * lib/mock-data/sales.ts
 *
 * Contoh data dummy yang merepresentasikan response dari BE.
 * Data ini menunjukkan format OpenUI Lang yang diharapkan FE
 * untuk masing-masing jenis visualisasi.
 *
 * Dalam production, data ini akan dihasilkan LLM secara dinamis
 * berdasarkan query user dan data real dari database.
 */

// ─────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export type TimeSeriesPoint = { label: string; values: number[] };
export type CategoryPoint   = { label: string; values: number[] };
export type PieSlice        = { label: string; value: number };
export type FlowNodeData    = { id: string; label: string; type?: "input" | "output" | "default" };
export type FlowEdgeData    = { id: string; source: string; target: string; label?: string };

export type ChartData =
  | { type: "line"; title: string; series: string[]; points: TimeSeriesPoint[] }
  | { type: "bar";  title: string; series: string[]; points: CategoryPoint[] }
  | { type: "pie";  title: string; slices: PieSlice[] };

export type DiagramData = {
  type: "flow";
  title: string;
  nodes: FlowNodeData[];
  edges: FlowEdgeData[];
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — LINE CHART
// ─────────────────────────────────────────────────────────────────────────────

export const mockMonthlySalesTrend: ChartData = {
  type: "line",
  title: "Tren Penjualan Bulanan 2024",
  series: ["Revenue (juta Rp)"],
  points: [
    { label: "Jan", values: [1240] }, { label: "Feb", values: [1580] },
    { label: "Mar", values: [1420] }, { label: "Apr", values: [1890] },
    { label: "Mei", values: [2100] }, { label: "Jun", values: [1950] },
    { label: "Jul", values: [2350] }, { label: "Agu", values: [2180] },
    { label: "Sep", values: [2560] }, { label: "Okt", values: [2800] },
    { label: "Nov", values: [3200] }, { label: "Des", values: [3850] },
  ],
};

export const mockYearComparisonTrend: ChartData = {
  type: "line",
  title: "Perbandingan Revenue 2023 vs 2024",
  series: ["2023 (juta Rp)", "2024 (juta Rp)"],
  points: [
    { label: "Q1", values: [3200, 4240] }, { label: "Q2", values: [4100, 5940] },
    { label: "Q3", values: [3800, 7090] }, { label: "Q4", values: [5500, 9850] },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — BAR CHART
// ─────────────────────────────────────────────────────────────────────────────

export const mockCategorySales: ChartData = {
  type: "bar",
  title: "Penjualan per Kategori Q4 2024",
  series: ["Units Terjual"],
  points: [
    { label: "Elektronik",    values: [1840] }, { label: "Fashion",    values: [1320] },
    { label: "Grocery",       values: [2650] }, { label: "Home & Living", values: [780] },
    { label: "Olahraga",      values: [950]  }, { label: "Beauty",     values: [1100] },
  ],
};

export const mockQuarterComparison: ChartData = {
  type: "bar",
  title: "Performa Kategori Q3 vs Q4 2024",
  series: ["Q3 2024", "Q4 2024"],
  points: [
    { label: "Elektronik",    values: [1240, 1840] }, { label: "Fashion",       values: [980, 1320] },
    { label: "Grocery",       values: [2100, 2650] }, { label: "Home & Living", values: [560, 780]  },
    { label: "Olahraga",      values: [720, 950]   },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — PIE CHART
// ─────────────────────────────────────────────────────────────────────────────

export const mockRevenueByChannel: ChartData = {
  type: "pie",
  title: "Komposisi Revenue per Channel Q4 2024",
  slices: [
    { label: "Marketplace", value: 48 }, { label: "Website",        value: 27 },
    { label: "Offline Store", value: 15 }, { label: "Reseller",     value: 7  },
    { label: "Social Commerce", value: 3 },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — FLOW DIAGRAM
// ─────────────────────────────────────────────────────────────────────────────

export const mockOrderApprovalFlow: DiagramData = {
  type: "flow",
  title: "Alur Approval Purchase Order",
  nodes: [
    { id: "n1", label: "Request PO",      type: "input"   },
    { id: "n2", label: "Review Manager",  type: "default" },
    { id: "n3", label: "Disetujui?",      type: "default" },
    { id: "n4", label: "Finance Review",  type: "default" },
    { id: "n5", label: "Ditolak",         type: "output"  },
    { id: "n6", label: "PO Diterbitkan",  type: "output"  },
  ],
  edges: [
    { id: "e1", source: "n1", target: "n2", label: "Submit"  },
    { id: "e2", source: "n2", target: "n3", label: "Review"  },
    { id: "e3", source: "n3", target: "n4", label: "Ya"      },
    { id: "e4", source: "n3", target: "n5", label: "Tidak"   },
    { id: "e5", source: "n4", target: "n6", label: "Approve" },
  ],
};

export const mockMicroserviceArchitecture: DiagramData = {
  type: "flow",
  title: "Arsitektur Microservice",
  nodes: [
    { id: "gw",      label: "API Gateway",      type: "input"   },
    { id: "auth",    label: "Auth Service",      type: "default" },
    { id: "user",    label: "User Service",      type: "default" },
    { id: "order",   label: "Order Service",     type: "default" },
    { id: "payment", label: "Payment Service",   type: "default" },
    { id: "notif",   label: "Notif Service",     type: "default" },
    { id: "db",      label: "Database",          type: "output"  },
    { id: "queue",   label: "Message Queue",     type: "output"  },
  ],
  edges: [
    { id: "e1", source: "gw",    target: "auth",    label: "Authenticate" },
    { id: "e2", source: "gw",    target: "user",    label: "User data"    },
    { id: "e3", source: "gw",    target: "order",   label: "Orders"       },
    { id: "e4", source: "order", target: "payment", label: "Payment"      },
    { id: "e5", source: "order", target: "notif",   label: "Notify"       },
    { id: "e6", source: "auth",  target: "db"                             },
    { id: "e7", source: "user",  target: "db"                             },
    { id: "e8", source: "order", target: "db"                             },
    { id: "e9", source: "notif", target: "queue"                          },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// OPENUI LANG EXAMPLES
// Format output LLM yang diharapkan untuk setiap data di atas.
// Bukan kode yang dijalankan — hanya referensi untuk dokumentasi & debugging.
// ─────────────────────────────────────────────────────────────────────────────

export const openUILangExamples = {
  lineChart: `
root = Card([header, chart, note])
header = CardHeader("Tren Penjualan Bulanan 2024", "Jan – Des")
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
note = TextContent("Total revenue 2024: Rp 29,12 Miliar. Pertumbuhan YoY: +68%", "small")
`.trim(),

  barChart: `
root = Card([header, chart])
header = CardHeader("Performa Kategori Q3 vs Q4 2024", "Perbandingan Units Terjual")
p1 = DataPoint("Elektronik",    [1240, 1840])
p2 = DataPoint("Fashion",       [980,  1320])
p3 = DataPoint("Grocery",       [2100, 2650])
p4 = DataPoint("Home & Living", [560,  780])
p5 = DataPoint("Olahraga",      [720,  950])
chart = RechartsBarChart("Units Terjual", ["Q3 2024", "Q4 2024"], [p1, p2, p3, p4, p5])
`.trim(),

  pieChart: `
root = Card([header, chart, summary])
header = CardHeader("Komposisi Revenue per Channel", "Q4 2024")
s1 = RechartsPieSlice("Marketplace", 48)
s2 = RechartsPieSlice("Website", 27)
s3 = RechartsPieSlice("Offline Store", 15)
s4 = RechartsPieSlice("Reseller", 7)
s5 = RechartsPieSlice("Social Commerce", 3)
chart = RechartsPieChart("Revenue Breakdown", [s1, s2, s3, s4, s5])
summary = TextContent("Marketplace mendominasi dengan 48% dari total revenue Q4.", "small")
`.trim(),

  flowApproval: `
root = Card([header, diagram])
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
diagram = FlowDiagram("Purchase Order Approval Flow", [n1,n2,n3,n4,n5,n6], [e1,e2,e3,e4,e5])
`.trim(),

  flowArchitecture: `
root = Card([header, diagram, note])
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
note = TextContent("Semua request masuk melalui API Gateway. Database terpusat.", "small")
`.trim(),
};

export const allMockData = {
  lineCharts:  [mockMonthlySalesTrend, mockYearComparisonTrend],
  barCharts:   [mockCategorySales, mockQuarterComparison],
  pieCharts:   [mockRevenueByChannel],
  flowDiagrams: [mockOrderApprovalFlow, mockMicroserviceArchitecture],
};
