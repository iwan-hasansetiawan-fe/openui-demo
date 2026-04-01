/**
 * lib/chart-library.cli.ts
 *
 * Versi stripped dari chart-library.ts khusus untuk CLI prompt generation.
 * File ini TIDAK mengimpor openuiChatLibrary atau React — hanya schema Zod murni.
 *
 * Digunakan oleh perintah:
 *   npm run generate:prompt
 * yang di package.json diarahkan ke file ini (bukan chart-library.ts).
 */

import { defineComponent, createLibrary } from "@openuidev/react-lang";
import { z } from "zod";

// ── DataPoint ─────────────────────────────────────────────────────────────────
const DataPoint = defineComponent({
  name: "DataPoint",
  description:
    "A single data entry with a label and one or more numeric values. " +
    "Used as child elements in RechartsLineChart and RechartsBarChart.",
  props: z.object({
    label: z.string().describe("Label for X-axis (e.g. 'Jan', 'Q1', 'Product A')"),
    values: z
      .array(z.number())
      .describe(
        "Numeric values — one per series. Order must match the `series` array of the parent chart."
      ),
  }),
  component: () => null,
});

// ── RechartsLineChart ─────────────────────────────────────────────────────────
const RechartsLineChart = defineComponent({
  name: "RechartsLineChart",
  description:
    "Line chart using Recharts. Best for trends over time or continuous data. " +
    "Supports multiple series (multi-line).",
  props: z.object({
    title: z.string().describe("Chart title displayed above the chart"),
    series: z
      .array(z.string())
      .describe("Names of each series/line. Must match the order of values in each DataPoint."),
    points: z.array(DataPoint.ref).describe("Array of DataPoint references"),
  }),
  component: () => null,
});

// ── RechartsBarChart ──────────────────────────────────────────────────────────
const RechartsBarChart = defineComponent({
  name: "RechartsBarChart",
  description:
    "Bar chart using Recharts. Best for comparing values across categories. " +
    "Supports multiple series (grouped bars).",
  props: z.object({
    title: z.string().describe("Chart title displayed above the chart"),
    series: z
      .array(z.string())
      .describe("Names of each series/bar group. Must match the order of values in each DataPoint."),
    points: z.array(DataPoint.ref).describe("Array of DataPoint references"),
  }),
  component: () => null,
});

// ── RechartsPieSlice ──────────────────────────────────────────────────────────
const RechartsPieSlice = defineComponent({
  name: "RechartsPieSlice",
  description: "A single slice/segment of a pie chart with a label and numeric value.",
  props: z.object({
    label: z.string().describe("Name of this segment (e.g. 'Marketplace', 'Website')"),
    value: z.number().describe("Numeric value. Percentages are calculated automatically."),
  }),
  component: () => null,
});

// ── RechartsPieChart ──────────────────────────────────────────────────────────
const RechartsPieChart = defineComponent({
  name: "RechartsPieChart",
  description:
    "Pie chart using Recharts. Best for showing proportions or composition of a whole. " +
    "Use RechartsPieSlice for each segment.",
  props: z.object({
    title: z.string().describe("Chart title displayed above the chart"),
    slices: z.array(RechartsPieSlice.ref).describe("Array of RechartsPieSlice references"),
  }),
  component: () => null,
});

// ── FlowNode ──────────────────────────────────────────────────────────────────
const FlowNode = defineComponent({
  name: "FlowNode",
  description:
    "A single node in a flow diagram. Position is calculated automatically — do NOT include x/y coordinates.",
  props: z.object({
    id: z
      .string()
      .describe("Unique node ID (e.g. 'n1', 'auth_service'). Must be unique across all nodes."),
    label: z.string().describe("Text displayed inside the node."),
    type: z
      .enum(["default", "input", "output"])
      .optional()
      .describe(
        "'input' = start/entry node, 'output' = end/terminal node, 'default' = intermediate node."
      ),
  }),
  component: () => null,
});

// ── FlowEdge ──────────────────────────────────────────────────────────────────
const FlowEdge = defineComponent({
  name: "FlowEdge",
  description: "A directed connection (arrow) between two nodes in a flow diagram.",
  props: z.object({
    id: z.string().describe("Unique edge ID (e.g. 'e1')."),
    source: z.string().describe("ID of the source (origin) node."),
    target: z.string().describe("ID of the target (destination) node."),
    label: z.string().optional().describe("Optional short label displayed on the edge/arrow."),
  }),
  component: () => null,
});

// ── FlowDiagram ───────────────────────────────────────────────────────────────
const FlowDiagram = defineComponent({
  name: "FlowDiagram",
  description:
    "Interactive node-based diagram using React Flow with automatic layout. " +
    "Use for: process flows, approval workflows, system architecture, org charts, " +
    "data pipelines, or any visualization showing relationships between entities. " +
    "Do NOT use for numeric data — use Recharts components instead.",
  props: z.object({
    title: z.string().describe("Diagram title displayed above the diagram."),
    nodes: z.array(FlowNode.ref).describe("Array of FlowNode references."),
    edges: z.array(FlowEdge.ref).describe("Array of FlowEdge references."),
  }),
  component: () => null,
});

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT & LAYOUT COMPONENTS
// Diperlukan oleh createLibrary karena root: "Card" harus ada di components[].
// Ini mirror dari openuiChatLibrary — cukup schema-nya saja (tanpa renderer).
// ═══════════════════════════════════════════════════════════════════════════════

const CardHeader = defineComponent({
  name: "CardHeader",
  description: "Title and optional subtitle displayed at the top of a Card.",
  props: z.object({
    title: z.string().describe("Main heading text"),
    subtitle: z.string().optional().describe("Optional secondary text below the title"),
  }),
  component: () => null,
});

const TextContent = defineComponent({
  name: "TextContent",
  description: "A block of text with optional size variant.",
  props: z.object({
    text: z.string().describe("Text content to display"),
    variant: z.string().optional().describe("Size variant: 'small', 'large', 'large-heavy'"),
  }),
  component: () => null,
});

const Card = defineComponent({
  name: "Card",
  description:
    "Root container for a chat response. Every response must start with Card as root. " +
    "Always include a CardHeader as the first child.",
  props: z.object({
    children: z.array(z.any()).describe("Child components rendered inside the card"),
  }),
  component: () => null,
});

// ═══════════════════════════════════════════════════════════════════════════════
// LIBRARY — root "Card" tanpa extend openuiChatLibrary
// ═══════════════════════════════════════════════════════════════════════════════

export const chartLibrary = createLibrary({
  root: "Card",
  componentGroups: [
    {
      name: "Layout",
      components: ["Card", "CardHeader", "TextContent"],
      notes: [
        "- Every response MUST start with: root = Card([...])",
        "- Always include CardHeader as the first child of Card.",
        "- Use TextContent for additional notes or summaries inside a Card.",
      ],
    },
    {
      name: "Recharts Charts",
      components: [
        "DataPoint",
        "RechartsLineChart",
        "RechartsBarChart",
        "RechartsPieSlice",
        "RechartsPieChart",
      ],
      notes: [
        "- ALWAYS define each DataPoint as a separate reference before the chart.",
        "- The `series` array MUST match the order of values[] in each DataPoint.",
        "- Use RechartsLineChart for time series or continuous trends.",
        "- Use RechartsBarChart for comparing discrete categories.",
        "- Use RechartsPieChart for proportions/composition (parts of a whole).",
        "- For RechartsPieChart, use RechartsPieSlice (not DataPoint) for each segment.",
        "- Always include a descriptive `title` for every chart.",
        "- Do NOT use Recharts for relational/structural data — use FlowDiagram instead.",
      ],
    },
    {
      name: "React Flow Diagrams",
      components: ["FlowNode", "FlowEdge", "FlowDiagram"],
      notes: [
        "- Use FlowDiagram for process flows, approval workflows, system architecture, org charts, pipelines, or any relational visualization.",
        "- Do NOT include x/y coordinates in FlowNode — layout is calculated automatically.",
        "- Always define all FlowNode and FlowEdge references BEFORE FlowDiagram.",
        "- Use type='input' for start/entry nodes, type='output' for end/terminal nodes.",
        "- Edge source and target must exactly match existing FlowNode IDs.",
        "- Do NOT use FlowDiagram for numeric data — use Recharts components instead.",
      ],
    },
  ],
  components: [
    // Layout (root)
    Card,
    CardHeader,
    TextContent,
    // Recharts
    DataPoint,
    RechartsLineChart,
    RechartsBarChart,
    RechartsPieSlice,
    RechartsPieChart,
    // React Flow
    FlowNode,
    FlowEdge,
    FlowDiagram,
  ],
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROMPT OPTIONS — auto-detected oleh CLI
// ═══════════════════════════════════════════════════════════════════════════════

export const chartPromptOptions = {
  preamble:
    "You are a helpful data and visualization assistant embedded in a chat application. " +
    "Use Recharts components for numeric data visualization (trends, comparisons, proportions). " +
    "Use FlowDiagram for relational or structural visualizations (flows, architectures, org charts). " +
    "Always wrap responses inside a Card with a CardHeader.",
  additionalRules: [
    "Use RechartsLineChart for time-series or trend data.",
    "Use RechartsBarChart for comparing values across categories.",
    "Use RechartsPieChart for proportions or composition data.",
    "Use FlowDiagram for process flows, approval workflows, system architectures, org charts, or pipelines.",
    "Define all child references (DataPoint, RechartsPieSlice, FlowNode, FlowEdge) BEFORE the parent component.",
    "Never include x/y coordinates in FlowNode — layout is automatic.",
    "Never use built-in LineChart, BarChart, PieChart, Series, or Slice — use the Recharts variants.",
  ],
  examples: [
    `// Line chart
root = Card([header, chart])
header = CardHeader("Monthly Revenue", "Jan-Jun 2024")
p1 = DataPoint("Jan", [4200])
p2 = DataPoint("Feb", [5800])
p3 = DataPoint("Mar", [5100])
chart = RechartsLineChart("Revenue (USD)", ["Revenue"], [p1, p2, p3])`,

    `// Multi-series bar chart
root = Card([header, chart])
header = CardHeader("Sales by Category", "Q3 vs Q4")
p1 = DataPoint("Electronics", [980, 1240])
p2 = DataPoint("Fashion", [720, 890])
chart = RechartsBarChart("Units Sold", ["Q3", "Q4"], [p1, p2])`,

    `// Pie chart
root = Card([header, chart])
header = CardHeader("Revenue by Channel", "Q4 2024")
s1 = RechartsPieSlice("Marketplace", 52)
s2 = RechartsPieSlice("Website", 28)
s3 = RechartsPieSlice("Offline", 20)
chart = RechartsPieChart("Revenue Breakdown", [s1, s2, s3])`,

    `// Flow diagram
root = Card([header, diagram])
header = CardHeader("Order Approval Flow")
n1 = FlowNode("n1", "Submit Order", "input")
n2 = FlowNode("n2", "Manager Review", "default")
n3 = FlowNode("n3", "Approved?", "default")
n4 = FlowNode("n4", "Rejected", "output")
n5 = FlowNode("n5", "Order Confirmed", "output")
e1 = FlowEdge("e1", "n1", "n2", "Submit")
e2 = FlowEdge("e2", "n2", "n3", "Review")
e3 = FlowEdge("e3", "n3", "n4", "No")
e4 = FlowEdge("e4", "n3", "n5", "Yes")
diagram = FlowDiagram("Order Approval Flow", [n1,n2,n3,n4,n5], [e1,e2,e3,e4])`,
  ],
};
