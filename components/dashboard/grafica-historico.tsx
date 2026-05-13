"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { HISTORICO } from "@/lib/mock-data";

// Tooltip personalizado en español
function TooltipPersonalizado({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-muted-foreground">
              {p.name === "ordenes" ? "Órdenes" : "Utilidad"}:
            </span>
            <span className="font-medium">
              {p.name === "utilidad"
                ? `$${Number(p.value).toLocaleString("es-MX")}`
                : p.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function GraficaHistorico() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Histórico General</CardTitle>
        <CardDescription>Órdenes y utilidades por mes</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={HISTORICO} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.5} />
            <XAxis
              dataKey="mes"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <YAxis
              yAxisId="izq"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              width={35}
            />
            <YAxis
              yAxisId="der"
              orientation="right"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              width={60}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<TooltipPersonalizado />} />
            <Legend
              formatter={(value) =>
                value === "ordenes" ? "Órdenes" : "Utilidad MXN"
              }
            />
            <Line
              yAxisId="izq"
              type="monotone"
              dataKey="ordenes"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#3b82f6" }}
              activeDot={{ r: 5 }}
            />
            <Line
              yAxisId="der"
              type="monotone"
              dataKey="utilidad"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#10b981" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
