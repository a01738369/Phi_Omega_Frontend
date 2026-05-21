import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconTrendingUp, IconTrendingDown, IconMinus } from "@tabler/icons-react";
import type { ReactNode } from "react";

interface KpiCardProps {
  titulo: string;
  valor: string | number;
  icono: ReactNode;
  descripcion?: string;
  variacion?: number;
  acento?: "primario" | "amarillo" | "verde" | "rojo";
}

const ACENTO_CLASES: Record<string, string> = {
  primario: "text-primary",
  amarillo: "text-yellow-500",
  verde: "text-emerald-500",
  rojo: "text-red-500",
};

const ACENTO_BG: Record<string, string> = {
  primario: "bg-primary/10",
  amarillo: "bg-yellow-500/10",
  verde: "bg-emerald-500/10",
  rojo: "bg-red-500/10",
};

export function KpiCard({
  titulo,
  valor,
  icono,
  descripcion,
  variacion,
  acento = "primario",
}: KpiCardProps) {
  const mostrarVariacion = variacion !== undefined;
  const subiendo = variacion !== undefined && variacion > 0;
  const bajando = variacion !== undefined && variacion < 0;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Barra superior de acento VAX */}
      <div
        className="h-1 w-full"
        style={
          acento === "amarillo"
            ? { background: "#f6cc54" }
            : acento === "primario"
              ? { background: "#523d72" }
              : undefined
        }
      />
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {titulo}
        </CardTitle>
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${ACENTO_BG[acento]} ${ACENTO_CLASES[acento]}`}
        >
          {icono}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{valor}</div>
        {mostrarVariacion && (
          <div
            className={`flex items-center gap-1 mt-1 text-xs font-medium ${
              subiendo
                ? "text-emerald-600"
                : bajando
                  ? "text-red-500"
                  : "text-muted-foreground"
            }`}
          >
            {subiendo ? (
              <IconTrendingUp size={13} />
            ) : bajando ? (
              <IconTrendingDown size={13} />
            ) : (
              <IconMinus size={13} />
            )}
            <span>
              {variacion !== undefined
                ? `${Math.abs(variacion)}% vs mes anterior`
                : ""}
            </span>
          </div>
        )}
        {descripcion && !mostrarVariacion && (
          <p className="text-xs text-muted-foreground mt-1">{descripcion}</p>
        )}
      </CardContent>
    </Card>
  );
}
