"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { panelApi, type TopClienteItem, type Period } from "@/lib/api";

function TooltipBarras({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold text-xs mb-1">{label}</p>
        <p className="text-muted-foreground">
          Utilidad:{" "}
          <span className="font-bold text-foreground">
            ${Number(payload[0].value).toLocaleString("es-MX")} MXN
          </span>
        </p>
      </div>
    );
  }
  return null;
}

function nombreCorto(nombre: string): string {
  return nombre.split(" ").slice(0, 2).join(" ");
}

interface Props { period: Period }

export function GraficaClientes({ period }: Props) {
  const [datos, setDatos] = useState<TopClienteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    panelApi.topClientesPorUtilidad(period)
      .then(setDatos)
      .finally(() => setLoading(false));
  }, [period]);

  const chartData = datos.map((c) => ({
    nombre: nombreCorto(c.cliente),
    utilidad: c.utilidad,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Clientes — Utilidad</CardTitle>
        <CardDescription>Los 5 clientes con mayor utilidad generada</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[240px] flex items-center justify-center text-muted-foreground text-sm">
            Cargando...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.4} />
              <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="nombre" tick={{ fontSize: 11 }} width={90} />
              <Tooltip content={<TooltipBarras />} />
              <Bar dataKey="utilidad" radius={[0, 6, 6, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={`cell-${i}`}
                    fill={i === 0 ? "#523d72" : i === 1 ? "#7c5fa3" : "#a888d4"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
