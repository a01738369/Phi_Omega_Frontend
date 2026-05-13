import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconTrendingUp, IconTrendingDown, IconMinus } from "@tabler/icons-react";
import type { ReactNode } from "react";

interface KpiCardProps {
  titulo: string;
  valor: string | number;
  icono: ReactNode;
  descripcion?: string;
  variacion?: number; // porcentaje vs periodo anterior
  colorIcono?: string;
}

export function KpiCard({
  titulo,
  valor,
  icono,
  descripcion,
  variacion,
  colorIcono = "text-primary",
}: KpiCardProps) {
  const mostrarVariacion = variacion !== undefined;
  const subiendo = variacion !== undefined && variacion > 0;
  const bajando = variacion !== undefined && variacion < 0;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {titulo}
        </CardTitle>
        <div className={`${colorIcono} opacity-80`}>{icono}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{valor}</div>
        {mostrarVariacion && (
          <div
            className={`flex items-center gap-1 mt-1 text-xs font-medium ${
              subiendo
                ? "text-green-600"
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
