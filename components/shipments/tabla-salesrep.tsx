"use client";
import { useEffect, useState } from "react";
import * as React from "react";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconChevronDown, IconMail, IconPackage, IconCurrencyPeso, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { operacionesApi, type RepDbRow } from "@/lib/api";
import { formatMXN } from "@/lib/mock-data";

export function TablaSalesRep() {
  const [datos, setDatos] = useState<RepDbRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    operacionesApi.reps()
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
      <CardHeader><CardTitle>Sales Rep</CardTitle></CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="text-xs font-semibold">Representante</TableHead>
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
            ) : mostrado.map((r) => (
              <React.Fragment key={r.sales_rep}>
                <TableRow key={r.sales_rep} className="cursor-pointer hover:bg-muted/30"
                  onClick={() => toggle(r.sales_rep)}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <IconChevronDown size={15}
                        className={`text-muted-foreground transition-transform duration-200 shrink-0 ${
                          expandido === r.sales_rep ? "rotate-180" : ""}`} />
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {r.sales_rep.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{r.sales_rep}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-right py-3 font-medium">{r.ordenes}</TableCell>
                  <TableCell className="text-sm text-right py-3 font-medium text-green-600">
                    {formatMXN(r.utilidad)}
                  </TableCell>
                </TableRow>

                {expandido === r.sales_rep && (
                  <TableRow key={`det-${r.sales_rep}`} className="bg-muted/20">
                    <TableCell colSpan={3} className="py-3 px-6">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <IconMail size={13} className="text-muted-foreground" />
                          <span className="text-xs">{r.correo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IconPackage size={13} className="text-muted-foreground" />
                          <span className="text-xs">{r.ordenes} órdenes totales</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IconCurrencyPeso size={13} className="text-muted-foreground" />
                          <span className="text-xs font-semibold text-green-600">
                            {formatMXN(r.utilidad)} utilidad
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
