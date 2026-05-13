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
import { TOP_SALESREP, formatMXN } from "@/lib/mock-data";
import { IconChevronDown, IconMail, IconPackage, IconCurrencyPeso } from "@tabler/icons-react";

export function TablaSalesRep() {
  const [expandido, setExpandido] = useState<string | null>(null);

  const toggle = (id: string) =>
    setExpandido((prev) => (prev === id ? null : id));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Rep</CardTitle>
      </CardHeader>
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
            {TOP_SALESREP.map((r) => (
              <>
                <TableRow
                  key={r.id_usuario}
                  className="cursor-pointer hover:bg-muted/30"
                  onClick={() => toggle(r.id_usuario)}
                >
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <IconChevronDown
                        size={15}
                        className={`text-muted-foreground transition-transform duration-200 shrink-0 ${
                          expandido === r.id_usuario ? "rotate-180" : ""
                        }`}
                      />
                      {/* Avatar con iniciales */}
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {r.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{r.nombre}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-right py-3 font-medium">
                    {r.totalOrdenes}
                  </TableCell>
                  <TableCell className="text-sm text-right py-3 font-medium text-green-600">
                    {formatMXN(r.totalUtilidad)}
                  </TableCell>
                </TableRow>

                {expandido === r.id_usuario && (
                  <TableRow key={`det-${r.id_usuario}`} className="bg-muted/20">
                    <TableCell colSpan={3} className="py-3 px-6">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                            ID
                          </span>
                          <span className="font-mono text-xs">{r.id_usuario}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IconMail size={13} className="text-muted-foreground" />
                          <span className="text-xs">{r.correo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IconPackage size={13} className="text-muted-foreground" />
                          <span className="text-xs">{r.totalOrdenes} órdenes totales</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IconCurrencyPeso size={13} className="text-muted-foreground" />
                          <span className="text-xs font-semibold text-green-600">
                            {formatMXN(r.totalUtilidad)} utilidad
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
