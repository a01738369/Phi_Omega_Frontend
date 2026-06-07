"use client";
import { useEffect, useState } from "react";
import * as React from "react";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconChevronDown, IconPackage, IconCurrencyPeso, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { operacionesApi, type ClienteDbRow } from "@/lib/api";
import { formatMXN } from "@/lib/mock-data";

export function TablaClientes() {
  const [datos, setDatos] = useState<ClienteDbRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    operacionesApi.clientes()
      .then(setDatos)
      .finally(() => setLoading(false));
  }, []);

  const toggle = (nombre: string) =>
    setExpandido((prev) => (prev === nombre ? null : nombre));

  const mostrado = datos.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.max(1, Math.ceil(datos.length / pageSize));

  useEffect(() => setPage(0), [datos]);

  return (
    <Card>
      <CardHeader><CardTitle>Clientes</CardTitle></CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="text-xs font-semibold">Cliente</TableHead>
              <TableHead className="text-xs font-semibold text-right">Órdenes</TableHead>
              <TableHead className="text-xs font-semibold text-right">Utilidad</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground text-sm">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : mostrado.map((c) => (
              <React.Fragment key={c.cliente}>
                <TableRow key={c.cliente} className="cursor-pointer hover:bg-muted/30"
                  onClick={() => toggle(c.cliente)}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <IconChevronDown size={15}
                        className={`text-muted-foreground transition-transform duration-200 shrink-0 ${
                          expandido === c.cliente ? "rotate-180" : ""}`} />
                      <span className="text-sm font-medium">{c.cliente}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-right py-3 font-medium">{c.ordenes}</TableCell>
                  <TableCell className="text-sm text-right py-3 font-medium">{formatMXN(c.utilidad)}</TableCell>
                </TableRow>

                {expandido === c.cliente && (
                  <TableRow key={`det-${c.cliente}`} className="bg-muted/20">
                    <TableCell colSpan={3} className="py-3 px-6">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <IconPackage size={13} className="text-muted-foreground" />
                          <span className="text-xs">{c.ordenes} órdenes totales</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IconCurrencyPeso size={13} className="text-muted-foreground" />
                          <span className="text-xs font-semibold text-green-600">
                            {formatMXN(c.utilidad)} utilidad
                          </span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        <div className="px-4 py-2 border-t bg-muted/20 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Mostrando {datos.length === 0 ? 0 : page * pageSize + 1}-{Math.min((page + 1) * pageSize, datos.length)} de {datos.length} registros
          </p>
          <div className="flex items-center gap-2">
            <button
              className="p-1 rounded disabled:opacity-40"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Anterior"
            >
              <IconChevronLeft />
            </button>
            <button
              className="p-1 rounded disabled:opacity-40"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              aria-label="Siguiente"
            >
              <IconChevronRight />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
