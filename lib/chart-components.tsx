/**
 * lib/chart-components.tsx
 *
 * React renderers untuk semua custom OpenUI components.
 * File ini mengandung JSX dan diimpor oleh chart-library.ts.
 *
 * Dipisah dari chart-library.ts agar CLI (@openuidev/cli) bisa
 * mem-parse chart-library.ts tanpa tersandung syntax JSX.
 */

"use client";

import React from "react";
import {
  LineChart,
  BarChart,
  PieChart,
  Line,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "@dagrejs/dagre";

// ─── Shared color palette ─────────────────────────────────────────────────────
const COLORS = [
  "#6366f1", // indigo
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ef4444", // red
  "#3b82f6", // blue
  "#8b5cf6", // violet
];

const tooltipStyle = {
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
};

// ─── RechartsLineChartRenderer ────────────────────────────────────────────────
export function RechartsLineChartRenderer({ props }: { props: any }) {
  // OpenUI resolves child components ke SubComponentOf shape:
  // { type: "element", typeName: "DataPoint", props: { label, values }, partial }
  // Sehingga akses data via p.props.label dan p.props.values
  const data = (props.points as any[]).map((p: any) => {
    const pointProps = p?.props ?? p; // fallback jika sudah di-flatten
    const obj: Record<string, string | number> = { label: pointProps.label };
    (props.series as string[]).forEach((s: string, i: number) => {
      obj[s] = pointProps.values?.[i] ?? 0;
    });
    return obj;
  });

  return (
    <div className="w-full py-2">
      {props.title && (
        <p className="font-semibold text-sm mb-3 text-gray-800">{props.title}</p>
      )}
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} />
          <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          {(props.series as string[]).map((s: string, i: number) => (
            <Line
              key={s}
              type="monotone"
              dataKey={s}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── RechartsBarChartRenderer ─────────────────────────────────────────────────
export function RechartsBarChartRenderer({ props }: { props: any }) {
  const data = (props.points as any[]).map((p: any) => {
    const pointProps = p?.props ?? p;
    const obj: Record<string, string | number> = { label: pointProps.label };
    (props.series as string[]).forEach((s: string, i: number) => {
      obj[s] = pointProps.values?.[i] ?? 0;
    });
    return obj;
  });

  return (
    <div className="w-full py-2">
      {props.title && (
        <p className="font-semibold text-sm mb-3 text-gray-800">{props.title}</p>
      )}
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} />
          <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          {(props.series as string[]).map((s: string, i: number) => (
            <Bar key={s} dataKey={s} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── RechartsPieChartRenderer ─────────────────────────────────────────────────
export function RechartsPieChartRenderer({ props }: { props: any }) {
  // Flatten slices: setiap slice adalah SubComponentOf { props: { label, value } }
  const slices = (props.slices as any[]).map((s: any) => s?.props ?? s);

  return (
    <div className="w-full py-2">
      {props.title && (
        <p className="font-semibold text-sm mb-3 text-gray-800">{props.title}</p>
      )}
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={slices}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ label, percent }: any) => `${label} ${(percent * 100).toFixed(0)}%`}
            labelLine={true}
          >
            {slices.map((_: any, i: number) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Dagre auto-layout helper ─────────────────────────────────────────────────
function applyDagreLayout(
  nodes: { id: string; data: { label: string }; type?: string }[],
  edges: { id: string; source: string; target: string }[]
) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "LR", nodesep: 60, ranksep: 140 });
  g.setDefaultEdgeLabel(() => ({}));
  nodes.forEach((n) => g.setNode(n.id, { width: 160, height: 48 }));
  edges.forEach((e) => g.setEdge(e.source, e.target));
  dagre.layout(g);
  return nodes.map((n) => ({
    ...n,
    position: { x: g.node(n.id).x - 80, y: g.node(n.id).y - 24 },
  }));
}

// ─── FlowDiagramRenderer ──────────────────────────────────────────────────────
export function FlowDiagramRenderer({ props }: { props: any }) {
  // FlowNode dan FlowEdge adalah SubComponentOf — data ada di .props
  const baseNodes = (props.nodes as any[]).map((n: any) => {
    const p = n?.props ?? n;
    return {
      id:       p.id,
      data:     { label: p.label },
      type:     p.type ?? "default",
      position: { x: 0, y: 0 },
    };
  });

  const rfEdges = (props.edges as any[]).map((e: any) => {
    const p = e?.props ?? e;
    return {
      id:           p.id,
      source:       p.source,
      target:       p.target,
      label:        p.label,
      animated:     true,
      style:        { stroke: "#6366f1", strokeWidth: 2 },
      labelStyle:   { fontSize: 11, fill: "#6b7280" },
      labelBgStyle: { fill: "#f9fafb", fillOpacity: 0.8 },
    };
  });

  const layoutedNodes = applyDagreLayout(baseNodes, rfEdges);

  return (
    <div className="w-full py-2">
      {props.title && (
        <p className="font-semibold text-sm mb-3 text-gray-800">{props.title}</p>
      )}
      <div
        style={{
          height: 380,
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <ReactFlow
          nodes={layoutedNodes}
          edges={rfEdges}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          zoomOnScroll={false}
          nodesDraggable={true}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#f0f0f0" gap={20} />
          <Controls showInteractive={false} />
          <MiniMap
            nodeColor="#6366f1"
            maskColor="rgb(240, 240, 255, 0.6)"
            style={{ borderRadius: 6 }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
