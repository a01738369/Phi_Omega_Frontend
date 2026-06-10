"use client";
import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COLOR_ESTATUS, ESTATUS_LISTA, formatMXN } from "@/lib/mock-data";
import { operacionesApi, type ShipmentRow } from "@/lib/api";
import { IconSearch, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

// Return a Tailwind class for the status badge. Handles Spanish and common English labels.
function getColorForStatus(estatus: string): string {
  // If caller passed an id (string or number), map it back to the known color
  const maybeId = Number(estatus as any);
  if (!Number.isNaN(maybeId) && maybeId > 0) {
    return COLOR_ESTATUS[maybeId] ?? "bg-gray-100 text-gray-700 border-gray-200";
  }
  const found = ESTATUS_LISTA.find((e) => e.estatus.toLowerCase() === (estatus || "").toLowerCase());
  if (found) return COLOR_ESTATUS[found.id_estatus] ?? "bg-gray-100 text-gray-700 border-gray-200";
  const s = (estatus || "").toLowerCase();
  if (/deliver|delivered|entreg/i.test(s)) return COLOR_ESTATUS[4];
  if (/transit|in transit|en tránsito/i.test(s)) return COLOR_ESTATUS[2];
  if (/cancel|cancelled|cancelado/i.test(s)) return COLOR_ESTATUS[5];
  if (/active|activo|booked/i.test(s)) return COLOR_ESTATUS[1];
  if (/aduana|customs|border/i.test(s)) return COLOR_ESTATUS[3];
  if (/hold|wait|espera/i.test(s)) return COLOR_ESTATUS[6];
  return "bg-gray-100 text-gray-700 border-gray-200";
}

export function TablaShipments() {
  const [todos, setTodos] = useState<ShipmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstatus, setFiltroEstatus] = useState("todos");
  const [allStatusOptions, setAllStatusOptions] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const cargar = (estatus: string) => {
    setLoading(true);
    const statusParam = estatus === "todos" ? "all" : estatus;
    // debug log to help verify what we're sending
    if (process.env.NEXT_PUBLIC_API_DEBUG === "1") {
      // eslint-disable-next-line no-console
      console.debug("cargar shipments statusParam:", statusParam);
    }
    operacionesApi.shipments({ status: statusParam as any })
      .then((res) => {
        if (process.env.NEXT_PUBLIC_API_DEBUG === "1") {
          // eslint-disable-next-line no-console
          console.debug("shipments result count:", Array.isArray(res) ? res.length : typeof res);
        }
        setTodos(res);
        // If we loaded the unfiltered list, extract the available status options
        if (estatus === "todos") {
          try {
            const statuses = Array.from(new Set((res || []).map((r: any) => String(r.estatus || "")).filter(Boolean)));
            statuses.sort((a,b) => a.localeCompare(b));
            setAllStatusOptions(statuses);
          } catch (e) {
            setAllStatusOptions([]);
          }
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargar("todos"); }, []);

  const datos = todos.filter((s) => {
    const b = busqueda.toLowerCase();
    const matchesSearch = (
      s.id.toLowerCase().includes(b) ||
      s.cliente.toLowerCase().includes(b) ||
      s.origen.toLowerCase().includes(b) ||
      s.destino.toLowerCase().includes(b)
    );
    const matchesStatus = filtroEstatus === "todos" ? true : ((s.estatus || "").toLowerCase() === filtroEstatus.toLowerCase());
    return matchesSearch && matchesStatus;
  });
  const mostrado = datos.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.max(1, Math.ceil(datos.length / pageSize));

  // Reset page when filters/search/data change
  useEffect(() => {
    setPage(0);
  }, [busqueda, filtroEstatus, todos]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipments</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex gap-2 p-4 border-b">
          <div className="relative flex-1 max-w-xs">
            <IconSearch size={15}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar ID, cliente, ruta..."
              value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
              className="pl-8 h-9 text-sm" />
          </div>
          <Select value={filtroEstatus} onValueChange={(val) => {
            setFiltroEstatus(val);
            cargar(val);
          }}>
            <SelectTrigger className="h-9 text-sm w-44">
              <SelectValue placeholder="Estatus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estatus</SelectItem>
              {(allStatusOptions.length ? allStatusOptions : Array.from(new Set(todos.map(s => s.estatus || "")))).map((estatus) => (
                <SelectItem key={estatus} value={estatus}>{estatus}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="text-xs font-semibold">ID</TableHead>
              <TableHead className="text-xs font-semibold">Fecha</TableHead>
              <TableHead className="text-xs font-semibold">Origen → Destino</TableHead>
              <TableHead className="text-xs font-semibold">Estatus</TableHead>
              <TableHead className="text-xs font-semibold text-right">Venta MXN</TableHead>
              <TableHead className="text-xs font-semibold">Cliente</TableHead>
              <TableHead className="text-xs font-semibold">Carrier</TableHead>
              <TableHead className="text-xs font-semibold">Sales Rep</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : datos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Sin resultados
                </TableCell>
              </TableRow>
            ) : mostrado.map((s) => (
              <TableRow key={s.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-xs py-3">{s.id}</TableCell>
                <TableCell className="text-sm py-3">{s.fecha}</TableCell>
                <TableCell className="text-sm py-3">
                  <span className="text-muted-foreground">{s.origen}</span>
                  <span className="mx-1 text-muted-foreground">→</span>
                  <span>{s.destino}</span>
                </TableCell>
                <TableCell className="py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    getColorForStatus(s.estatus)
                  }`}>
                    {s.estatus}
                  </span>
                </TableCell>
                <TableCell className="text-sm py-3 text-right font-medium">
                  {s.venta_mxn > 0 ? formatMXN(s.venta_mxn) : "—"}
                </TableCell>
                <TableCell className="text-sm py-3">{s.cliente}</TableCell>
                <TableCell className="text-sm py-3">{s.carrier ?? "—"}</TableCell>
                <TableCell className="text-sm py-3">{s.sales_rep}</TableCell>
              </TableRow>
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
