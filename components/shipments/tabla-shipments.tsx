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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SHIPMENTS, ESTATUS_LISTA, COLOR_ESTATUS, formatMXN } from "@/lib/mock-data";
import { IconSearch } from "@tabler/icons-react";

export function TablaShipments() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstatus, setFiltroEstatus] = useState("todos");

  const datos = SHIPMENTS.filter((s) => {
    const b = busqueda.toLowerCase();
    const coincide =
      s.id_transaccion.toLowerCase().includes(b) ||
      s.cliente.toLowerCase().includes(b) ||
      s.origen.toLowerCase().includes(b) ||
      s.destino.toLowerCase().includes(b);
    const est =
      filtroEstatus === "todos" || s.estatus === filtroEstatus;
    return coincide && est;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipments</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Barra de búsqueda y filtro */}
        <div className="flex gap-2 p-4 border-b">
          <div className="relative flex-1 max-w-xs">
            <IconSearch
              size={15}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Buscar ID, cliente, ruta..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>
          <Select value={filtroEstatus} onValueChange={setFiltroEstatus}>
            <SelectTrigger className="h-9 text-sm w-44">
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
        </div>

        {/* Tabla */}
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="text-xs font-semibold">ID</TableHead>
              <TableHead className="text-xs font-semibold">Fecha</TableHead>
              <TableHead className="text-xs font-semibold">Origen → Destino</TableHead>
              <TableHead className="text-xs font-semibold">Estatus</TableHead>
              <TableHead className="text-xs font-semibold text-right">Venta MXN</TableHead>
              <TableHead className="text-xs font-semibold">Cliente</TableHead>
              <TableHead className="text-xs font-semibold">Sales Rep</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Sin resultados para tu búsqueda
                </TableCell>
              </TableRow>
            ) : (
              datos.map((s) => (
                <TableRow key={s.id_transaccion} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs py-3">
                    {s.id_transaccion}
                  </TableCell>
                  <TableCell className="text-sm py-3">{s.fecha}</TableCell>
                  <TableCell className="text-sm py-3">
                    <span className="text-muted-foreground">{s.origen}</span>
                    <span className="mx-1 text-muted-foreground">→</span>
                    <span>{s.destino}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${COLOR_ESTATUS[s.estatusId] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {s.estatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm py-3 text-right font-medium">
                    {s.venta_mxn > 0 ? formatMXN(s.venta_mxn) : "—"}
                  </TableCell>
                  <TableCell className="text-sm py-3">{s.cliente}</TableCell>
                  <TableCell className="text-sm py-3">{s.sales_rep}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Footer con conteo */}
        <div className="px-4 py-2 border-t bg-muted/20">
          <p className="text-xs text-muted-foreground">
            Mostrando {datos.length} de {SHIPMENTS.length} registros
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
