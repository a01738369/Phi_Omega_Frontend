"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { panelApi, type TimeseriesItem } from "@/lib/api";

function TooltipPersonalizado({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-muted-foreground">
              {p.name === "orders" ? "Órdenes" : "Utilidad"}:
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
  const [datos, setDatos] = useState<TimeseriesItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    panelApi.timeseries()
      .then(setDatos)
      .finally(() => setLoading(false));
  }, []);

  // Format "YYYY-MM" -> "Ene", "Feb", etc. for the X axis
  const datosFormateados = datos.map((d) => ({
    ...d,
    mes: new Date(d.month + "-01").toLocaleString("es-MX", { month: "short" }),
  }));

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Histórico General</CardTitle>
        <CardDescription>Órdenes y utilidades por mes</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
            Cargando...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={datosFormateados} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
              <Legend formatter={(value) => value === "orders" ? "Órdenes" : "Utilidad MXN"} />
              <Line yAxisId="izq" type="monotone" dataKey="orders" stroke="#523d72" strokeWidth={2.5}
                dot={{ r: 3, fill: "#523d72" }} activeDot={{ r: 5 }} />
              <Line yAxisId="der" type="monotone" dataKey="utilidad" stroke="#f6cc54" strokeWidth={2.5}
                dot={{ r: 3, fill: "#f6cc54" }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
