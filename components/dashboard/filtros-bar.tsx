"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IconFilter, IconX, IconCalendar } from "@tabler/icons-react";
import { subDays, subYears, differenceInDays, isSameDay } from "date-fns";
import { CLIENTES, ESTATUS_LISTA, USUARIOS } from "@/lib/mock-data";
import type { FiltrosGlobales } from "@/lib/types";

interface FiltrosBarProps {
  filtros: FiltrosGlobales;
  onCambiar: <K extends keyof FiltrosGlobales>(
    clave: K,
    valor: FiltrosGlobales[K]
  ) => void;
  onLimpiar: () => void;
}

export function FiltrosBar({ filtros, onCambiar, onLimpiar }: FiltrosBarProps) {
  const hayFiltros = Object.values(filtros).some((v) => v !== undefined);

  // determine selected period from fechas
  const now = new Date();
  const end = filtros.fechaFin ?? now;
  const start = filtros.fechaInicio;

  const selectedPeriod = (() => {
    if (!start) return undefined;
    const days = differenceInDays(end, start);
    if (days === 6) return "7d"; // inclusive range: today and 6 days before
    if (days === 29) return "30d";
    if (days === 89) return "90d";
    // year approximation: check year difference or 365 days
    const yearDiff = end.getFullYear() - start.getFullYear();
    if (yearDiff >= 1 || differenceInDays(end, start) >= 365) return "1y";
    return undefined;
  })();

  const applyPeriod = (p: "7d" | "30d" | "90d" | "1y") => {
    const now = new Date();
    let from: Date;
    if (p === "1y") from = subYears(now, 1);
    else if (p === "90d") from = subDays(now, 89);
    else if (p === "30d") from = subDays(now, 29);
    else from = subDays(now, 6);
    onCambiar("fechaInicio", from);
    onCambiar("fechaFin", now);
  };

  return (
    <div className="flex flex-wrap gap-2 items-center bg-card border rounded-xl px-4 py-3 mb-6 shadow-sm">
      <div className="flex items-center gap-3 text-muted-foreground mr-2">
        <IconFilter size={15} />
        <span className="text-sm font-medium">Filtros</span>
        <div className="flex items-center gap-1 ml-2">
          {(["7d", "30d", "90d", "1y"] as const).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={selectedPeriod === p ? "default" : "ghost"}
              onClick={() => applyPeriod(p)}
              className="flex items-center gap-2 h-8 text-xs"
            >
              <IconCalendar size={14} />
              <span className="font-medium">{p}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Filtro Estatus */}
      <Select
        value={filtros.estatus ?? "todos"}
        onValueChange={(val) =>
          onCambiar("estatus", val === "todos" ? undefined : val)
        }
      >
        <SelectTrigger className="h-8 text-sm w-40">
          <SelectValue placeholder="Estatus" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos los estatus</SelectItem>
          {ESTATUS_LISTA.map((e) => (
            <SelectItem key={e.id_estatus} value={e.estatus}>
              {e.estatus}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Filtro Cliente */}
      <Select
        value={filtros.cliente ?? "todos"}
        onValueChange={(val) =>
          onCambiar("cliente", val === "todos" ? undefined : val)
        }
      >
        <SelectTrigger className="h-8 text-sm w-52">
          <SelectValue placeholder="Cliente" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos los clientes</SelectItem>
          {CLIENTES.map((c) => (
            <SelectItem key={c.id_cliente} value={c.id_cliente}>
              {c.Nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Filtro Sales Rep */}
      <Select
        value={filtros.salesRep ?? "todos"}
        onValueChange={(val) =>
          onCambiar("salesRep", val === "todos" ? undefined : val)
        }
      >
        <SelectTrigger className="h-8 text-sm w-44">
          <SelectValue placeholder="Sales Rep" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos los reps</SelectItem>
          {USUARIOS.filter((u) => u.cargo === "Sales Rep").map((u) => (
            <SelectItem key={u.id_usuarios} value={u.id_usuarios}>
              {u.Nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Botón limpiar */}
      {hayFiltros && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onLimpiar}
          className="h-8 gap-1 text-muted-foreground hover:text-foreground"
        >
          <IconX size={13} />
          Limpiar
        </Button>
      )}
    </div>
  );
}
