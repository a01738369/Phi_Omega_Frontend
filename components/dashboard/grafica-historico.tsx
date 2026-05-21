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

function TooltipPersonalizado({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
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
            <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
            <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="izq" tick={{ fontSize: 12 }} width={35} />
            <YAxis
              yAxisId="der"
              orientation="right"
              tick={{ fontSize: 12 }}
              width={60}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<TooltipPersonalizado />} />
            <Legend
              formatter={(value) =>
                value === "ordenes" ? "Órdenes" : "Utilidad MXN"
              }
            />
            {/* Morado VAX para órdenes */}
            <Line
              yAxisId="izq"
              type="monotone"
              dataKey="ordenes"
              stroke="#523d72"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#523d72" }}
              activeDot={{ r: 5 }}
            />
            {/* Amarillo VAX para utilidad */}
            <Line
              yAxisId="der"
              type="monotone"
              dataKey="utilidad"
              stroke="#f6cc54"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#f6cc54" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
