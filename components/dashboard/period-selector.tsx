"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconCalendar } from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import type { FiltrosGlobales } from "@/lib/types";

interface PeriodSelectorProps {
  filtros: FiltrosGlobales;
  onCambiar: <K extends keyof FiltrosGlobales>(
    clave: K,
    valor: FiltrosGlobales[K]
  ) => void;
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function PeriodSelector({ filtros, onCambiar }: PeriodSelectorProps) {
  const hoy = startOfToday();

  const initialized = useRef(false);

  // default to 90d when no range is set
  useEffect(() => {
    if (initialized.current) return;
    if (!filtros.fechaInicio && !filtros.fechaFin) {
      aplicarRango("90d");
    }
    initialized.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const aplicarRango = (option: string) => {
    let inicio: Date | undefined = undefined;
    let fin: Date | undefined = undefined;

    switch (option) {
      case "7d":
        fin = new Date(hoy);
        inicio = new Date(hoy);
        inicio.setDate(hoy.getDate() - 6);
        break;
      case "30d":
        fin = new Date(hoy);
        inicio = new Date(hoy);
        inicio.setDate(hoy.getDate() - 29);
        break;
      case "90d":
        fin = new Date(hoy);
        inicio = new Date(hoy);
        inicio.setDate(hoy.getDate() - 89);
        break;
      case "1y":
        fin = new Date(hoy);
        inicio = new Date(hoy);
        inicio.setFullYear(hoy.getFullYear() - 1);
        break;
      case "all":
      default:
        inicio = undefined;
        fin = undefined;
    }

    onCambiar("fechaInicio", inicio as FiltrosGlobales["fechaInicio"]);
    onCambiar("fechaFin", fin as FiltrosGlobales["fechaFin"]);
  };

  const label = () => {
    if (filtros.fechaInicio && filtros.fechaFin) {
      // derive period name
      const days = Math.round((filtros.fechaFin!.getTime() - filtros.fechaInicio!.getTime()) / (1000 * 60 * 60 * 24));
      if (days <= 6) return "7d";
      if (days <= 29) return "30d";
      if (days <= 89) return "90d";
      if (days >= 365) return "1y";
      return "Período seleccionado";
    }
    return "90d"; // default label when not explicitly set
  };

  return (
    <div className="flex flex-wrap gap-2 items-center bg-card border rounded-xl px-4 py-3 mb-6 shadow-sm">
      <div className="flex items-center gap-2 text-muted-foreground mr-1">
        <IconCalendar size={15} />
        <span className="text-sm font-medium">{label()}</span>
      </div>

      <Select
        value={(function () {
          if (filtros.fechaInicio && filtros.fechaFin) {
            const days = Math.round((filtros.fechaFin!.getTime() - filtros.fechaInicio!.getTime()) / (1000 * 60 * 60 * 24));
            if (days <= 6) return "7d";
            if (days <= 29) return "30d";
            if (days <= 89) return "90d";
            if (days >= 365) return "1y";
            return "custom";
          }
          return "90d";
        })()}
        onValueChange={(val) => aplicarRango(val)}
      >
        <SelectTrigger className="h-8 text-sm w-48">
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">Últimos 7 días</SelectItem>
          <SelectItem value="30d">Últimos 30 días</SelectItem>
          <SelectItem value="90d">Últimos 90 días</SelectItem>
          <SelectItem value="1y">Último año</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default PeriodSelector;
