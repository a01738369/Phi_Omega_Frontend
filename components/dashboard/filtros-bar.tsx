"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IconFilter, IconX } from "@tabler/icons-react";
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

  return (
    <div className="flex flex-wrap gap-2 items-center bg-card border rounded-xl px-4 py-3 mb-6 shadow-sm">
      <div className="flex items-center gap-2 text-muted-foreground mr-1">
        <IconFilter size={15} />
        <span className="text-sm font-medium">Filtros</span>
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
