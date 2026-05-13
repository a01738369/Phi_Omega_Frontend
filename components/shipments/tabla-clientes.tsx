"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TOP_CLIENTES, formatMXN } from "@/lib/mock-data";
import { IconChevronDown, IconMapPin, IconPackage, IconCurrencyPeso } from "@tabler/icons-react";

export function TablaClientes() {
  const [expandido, setExpandido] = useState<string | null>(null);

  const toggle = (id: string) =>
    setExpandido((prev) => (prev === id ? null : id));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes</CardTitle>
      </CardHeader>
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
            {TOP_CLIENTES.map((c) => (
              <>
                <TableRow
                  key={c.id_cliente}
                  className="cursor-pointer hover:bg-muted/30"
                  onClick={() => toggle(c.id_cliente)}
                >
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <IconChevronDown
                        size={15}
                        className={`text-muted-foreground transition-transform duration-200 shrink-0 ${
                          expandido === c.id_cliente ? "rotate-180" : ""
                        }`}
                      />
                      <span className="text-sm font-medium hover:underline">
                        {c.nombre}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-right py-3 font-medium">
                    {c.totalOrdenes}
                  </TableCell>
                  <TableCell className="text-sm text-right py-3 font-medium">
                    {formatMXN(c.totalUtilidad)}
                  </TableCell>
                </TableRow>

                {/* Fila expandible con detalle */}
                {expandido === c.id_cliente && (
                  <TableRow key={`det-${c.id_cliente}`} className="bg-muted/20">
                    <TableCell colSpan={3} className="py-3 px-6">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                            ID
                          </span>
                          <span className="font-mono text-xs">{c.id_cliente}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IconMapPin size={13} className="text-muted-foreground" />
                          <span className="text-xs">{c.ubicacion}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IconPackage size={13} className="text-muted-foreground" />
                          <span className="text-xs">
                            {c.totalOrdenes} órdenes totales
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IconCurrencyPeso size={13} className="text-muted-foreground" />
                          <span className="text-xs font-semibold text-green-600">
                            {formatMXN(c.totalUtilidad)} utilidad
                          </span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
