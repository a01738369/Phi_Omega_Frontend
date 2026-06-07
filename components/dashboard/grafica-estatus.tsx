"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { panelApi, type PieItem, type Period } from "@/lib/api";

// Support both Spanish and common English status labels (backend may return either)
const COLORES: Record<string, string> = {
  // Spanish
  "Entregado":    "#10b981",
  "En tránsito":  "#f6cc54",
  "Cancelado":    "#ef4444",
  "Activo":       "#3b82f6",
  "En aduana":    "#f59e0b",
  "En espera":    "#94a3b8",
  // English equivalents / variants
  "Delivered":              "#10b981",
  "Delivered Without POD":  "#60a5fa",
  "In Transit":             "#f6cc54",
  "Cancelled":              "#ef4444",
  "Active":                 "#3b82f6",
  "At Border":              "#f59e0b",
  "At Delivery":           "#a78bfa",
  "At Shipper":             "#f59e0b",
  "Picked Up":              "#06b6d4",
  "Booked":                 "#60a5fa",
  "Available":              "#93c5fd",
  "Dispatched":             "#f97316",
  "Draft":                  "#94a3af",
  "Hold":                   "#94a3af",
  "Invoiced":               "#60a5fa",
  "Ready to Invoice":       "#60a5fa",
};
const COLOR_DEFAULT = "#9ca3af";

function TooltipDona({ active, payload, total }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-muted-foreground">
          {payload[0].value} envíos ({total ? ((payload[0].value / total) * 100).toFixed(1) : 0}%)
        </p>
      </div>
    );
  }
  return null;
}

interface Props { period: Period }

export function GraficaEstatus({ period }: Props) {
  const [datos, setDatos] = useState<PieItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    panelApi.pie(period)
      .then(setDatos)
      .finally(() => setLoading(false));
  }, [period]);

  const total = datos.reduce((s, d) => s + d.total, 0);
  const chartData = datos.map((d) => {
    const est = (d.estatus || "").toLowerCase();
    const key = Object.keys(COLORES).find((k) => k.toLowerCase() === est);
    return {
      nombre: d.estatus,
      valor: d.total,
      color: (key ? COLORES[key] : COLORES[d.estatus]) ?? COLOR_DEFAULT,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución por Estatus</CardTitle>
        <CardDescription>Envíos clasificados por estatus</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[240px] flex items-center justify-center text-muted-foreground text-sm">
            Cargando...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={chartData} nameKey="nombre" cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                paddingAngle={3} dataKey="valor">
                {chartData.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={(props) => <TooltipDona {...props} total={total} />} />
              <Legend formatter={(value) => <span className="text-xs">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
