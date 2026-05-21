"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DATOS = [
  { nombre: "En tránsito", valor: 38, color: "#f6cc54" },
  { nombre: "Activo", valor: 27, color: "#523d72" },
  { nombre: "En aduana", valor: 18, color: "#7c5fa3" },
  { nombre: "Entregado", valor: 52, color: "#10b981" },
  { nombre: "En espera", valor: 12, color: "#94a3b8" },
  { nombre: "Cancelado", valor: 5, color: "#ef4444" },
];

function TooltipDona({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-muted-foreground">
          {payload[0].value} envíos ({((payload[0].value / 152) * 100).toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
}

export function GraficaEstatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución por Estatus</CardTitle>
        <CardDescription>Envíos activos clasificados</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={DATOS}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              dataKey="valor"
            >
              {DATOS.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<TooltipDona />} />
            <Legend
              formatter={(value) => (
                <span className="text-xs">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
