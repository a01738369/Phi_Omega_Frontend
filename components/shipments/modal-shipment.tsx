"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  IconCalendar,
  IconTrendingUp,
  IconCurrencyPeso,
  IconCheck,
  IconMapPin,
  IconPlus,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CLIENTES, USUARIOS, getLugares, agregarLugar } from "@/lib/mock-data";
import type { Lugar } from "@/lib/types";

interface ModalShipmentProps {
  abierto: boolean;
  onCerrar: () => void;
}

// Mini-formulario para agregar un lugar nuevo
interface FormNuevoLugar {
  ciudad: string;
  estado: string;
  pais: string;
}

const LUGAR_VACIO: FormNuevoLugar = { ciudad: "", estado: "", pais: "" };

export function ModalShipment({ abierto, onCerrar }: ModalShipmentProps) {
  const [idCliente, setIdCliente] = useState("");
  const [salesRep, setSalesRep] = useState("");
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [fechaInicio, setFechaInicio] = useState<Date | undefined>();
  const [fechaFin, setFechaFin] = useState<Date | undefined>();
  const [precioPredecho, setPrecioPredecho] = useState<number | null>(null);
  const [precioManual, setPrecioManual] = useState("");
  const [calculando, setCalculando] = useState(false);
  const [confirmado, setConfirmado] = useState(false);

  // Estado para el panel de "Nuevo lugar"
  const [mostrarNuevoOrigen, setMostrarNuevoOrigen] = useState(false);
  const [mostrarNuevoDestino, setMostrarNuevoDestino] = useState(false);
  const [formNuevoOrigen, setFormNuevoOrigen] = useState<FormNuevoLugar>(LUGAR_VACIO);
  const [formNuevoDestino, setFormNuevoDestino] = useState<FormNuevoLugar>(LUGAR_VACIO);

  // Lista de lugares reactiva (se actualiza cuando se agrega uno nuevo)
  const [lugares, setLugares] = useState<Lugar[]>(getLugares());

  // Cada vez que se abre el modal, sincroniza la lista de lugares
  useEffect(() => {
    if (abierto) setLugares(getLugares());
  }, [abierto]);

  // Guardar nuevo origen
  function guardarNuevoOrigen() {
    if (!formNuevoOrigen.ciudad || !formNuevoOrigen.estado || !formNuevoOrigen.pais) return;
    const nuevo = agregarLugar(formNuevoOrigen);
    setLugares(getLugares()); // actualiza la lista local
    setOrigen(nuevo.id_lugares); // selecciona automáticamente el nuevo lugar
    setMostrarNuevoOrigen(false);
    setFormNuevoOrigen(LUGAR_VACIO);
  }

  // Guardar nuevo destino
  function guardarNuevoDestino() {
    if (!formNuevoDestino.ciudad || !formNuevoDestino.estado || !formNuevoDestino.pais) return;
    const nuevo = agregarLugar(formNuevoDestino);
    setLugares(getLugares());
    setDestino(nuevo.id_lugares);
    setMostrarNuevoDestino(false);
    setFormNuevoDestino(LUGAR_VACIO);
  }

  async function calcularPrediccion() {
    if (!origen || !destino) return;
    setCalculando(true);
    await new Promise((r) => setTimeout(r, 1200));
    const base = 22000;
    const extra = Math.floor(Math.random() * 45000);
    setPrecioPredecho(base + extra);
    setCalculando(false);
  }

  function handleConfirmar() {
    const precio = precioManual ? Number(precioManual) : precioPredecho;
    const origenNombre = lugares.find((l) => l.id_lugares === origen);
    const destinoNombre = lugares.find((l) => l.id_lugares === destino);
    console.log("✅ Nuevo envío creado:", {
      id_cliente: idCliente,
      sales_rep: salesRep,
      origen: origenNombre ? `${origenNombre.ciudad}, ${origenNombre.estado}` : origen,
      destino: destinoNombre ? `${destinoNombre.ciudad}, ${destinoNombre.estado}` : destino,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      precio,
    });
    setConfirmado(true);
    setTimeout(() => {
      setConfirmado(false);
      resetear();
      onCerrar();
    }, 1500);
  }

  function resetear() {
    setIdCliente(""); setSalesRep(""); setOrigen(""); setDestino("");
    setFechaInicio(undefined); setFechaFin(undefined);
    setPrecioPredecho(null); setPrecioManual("");
    setMostrarNuevoOrigen(false); setMostrarNuevoDestino(false);
    setFormNuevoOrigen(LUGAR_VACIO); setFormNuevoDestino(LUGAR_VACIO);
  }

  const puedeConfirmar =
    idCliente && salesRep && origen && destino && fechaInicio && fechaFin &&
    (precioPredecho !== null || precioManual !== "");

  return (
    <Dialog open={abierto} onOpenChange={(open) => { if (!open) { resetear(); onCerrar(); } }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo Envío</DialogTitle>
          <DialogDescription>
            Completa los datos. Si el origen o destino no existe, puedes agregarlo desde los mismos selectores.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">

          {/* ── Asignación ── */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Asignación
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Cliente</label>
                <Select value={idCliente} onValueChange={setIdCliente}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar cliente..." /></SelectTrigger>
                  <SelectContent>
                    {CLIENTES.map((c) => (
                      <SelectItem key={c.id_cliente} value={c.id_cliente}>{c.Nombre}</SelectItem>
                    ))}
                    <Separator className="my-1" />
                    <SelectItem value="NUEVO_CLIENTE">+ Agregar nuevo cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Sales Rep</label>
                <Select value={salesRep} onValueChange={setSalesRep}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar rep..." /></SelectTrigger>
                  <SelectContent>
                    {USUARIOS.filter((u) => u.cargo === "Sales Rep").map((u) => (
                      <SelectItem key={u.id_usuarios} value={u.id_usuarios}>{u.Nombre}</SelectItem>
                    ))}
                    <Separator className="my-1" />
                    <SelectItem value="NUEVO_REP">+ Agregar nuevo sales rep</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* ── Ruta ── */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Ruta
            </p>
            <div className="grid grid-cols-2 gap-3">

              {/* ORIGEN */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Origen</label>
                <Select
                  value={origen}
                  onValueChange={(val) => {
                    if (val === "NUEVO_ORIGEN") {
                      setMostrarNuevoOrigen(true);
                      setOrigen("");
                    } else {
                      setOrigen(val);
                      setMostrarNuevoOrigen(false);
                    }
                  }}
                >
                  <SelectTrigger><SelectValue placeholder="Ciudad de origen..." /></SelectTrigger>
                  <SelectContent>
                    {lugares.map((l) => (
                      <SelectItem key={l.id_lugares} value={l.id_lugares}>
                        {l.ciudad}, {l.estado} — {l.pais}
                      </SelectItem>
                    ))}
                    <Separator className="my-1" />
                    <SelectItem value="NUEVO_ORIGEN">
                      <span className="flex items-center gap-1">
                        <IconMapPin size={13} /> + Registrar nuevo origen
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Sub-formulario de nuevo origen */}
                {mostrarNuevoOrigen && (
                  <div className="mt-2 p-3 bg-muted/50 rounded-lg border space-y-2">
                    <p className="text-xs font-semibold flex items-center gap-1">
                      <IconPlus size={12} /> Registrar nuevo origen
                    </p>
                    <Input
                      placeholder="Ciudad"
                      value={formNuevoOrigen.ciudad}
                      onChange={(e) => setFormNuevoOrigen((p) => ({ ...p, ciudad: e.target.value }))}
                      className="h-8 text-sm"
                    />
                    <Input
                      placeholder="Estado / Provincia"
                      value={formNuevoOrigen.estado}
                      onChange={(e) => setFormNuevoOrigen((p) => ({ ...p, estado: e.target.value }))}
                      className="h-8 text-sm"
                    />
                    <Input
                      placeholder="País"
                      value={formNuevoOrigen.pais}
                      onChange={(e) => setFormNuevoOrigen((p) => ({ ...p, pais: e.target.value }))}
                      className="h-8 text-sm"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" className="h-7 text-xs" onClick={guardarNuevoOrigen}>
                        Guardar origen
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => { setMostrarNuevoOrigen(false); setFormNuevoOrigen(LUGAR_VACIO); }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* DESTINO */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Destino</label>
                <Select
                  value={destino}
                  onValueChange={(val) => {
                    if (val === "NUEVO_DESTINO") {
                      setMostrarNuevoDestino(true);
                      setDestino("");
                    } else {
                      setDestino(val);
                      setMostrarNuevoDestino(false);
                    }
                  }}
                >
                  <SelectTrigger><SelectValue placeholder="Ciudad de destino..." /></SelectTrigger>
                  <SelectContent>
                    {lugares.map((l) => (
                      <SelectItem key={l.id_lugares} value={l.id_lugares}>
                        {l.ciudad}, {l.estado} — {l.pais}
                      </SelectItem>
                    ))}
                    <Separator className="my-1" />
                    <SelectItem value="NUEVO_DESTINO">
                      <span className="flex items-center gap-1">
                        <IconMapPin size={13} /> + Registrar nuevo destino
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Sub-formulario de nuevo destino */}
                {mostrarNuevoDestino && (
                  <div className="mt-2 p-3 bg-muted/50 rounded-lg border space-y-2">
                    <p className="text-xs font-semibold flex items-center gap-1">
                      <IconPlus size={12} /> Registrar nuevo destino
                    </p>
                    <Input
                      placeholder="Ciudad"
                      value={formNuevoDestino.ciudad}
                      onChange={(e) => setFormNuevoDestino((p) => ({ ...p, ciudad: e.target.value }))}
                      className="h-8 text-sm"
                    />
                    <Input
                      placeholder="Estado / Provincia"
                      value={formNuevoDestino.estado}
                      onChange={(e) => setFormNuevoDestino((p) => ({ ...p, estado: e.target.value }))}
                      className="h-8 text-sm"
                    />
                    <Input
                      placeholder="País"
                      value={formNuevoDestino.pais}
                      onChange={(e) => setFormNuevoDestino((p) => ({ ...p, pais: e.target.value }))}
                      className="h-8 text-sm"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" className="h-7 text-xs" onClick={guardarNuevoDestino}>
                        Guardar destino
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => { setMostrarNuevoDestino(false); setFormNuevoDestino(LUGAR_VACIO); }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* ── Fechas ── */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Fechas
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Fecha de Inicio</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start font-normal">
                      <IconCalendar size={15} className="mr-2 text-muted-foreground" />
                      {fechaInicio
                        ? format(fechaInicio, "PPP", { locale: es })
                        : <span className="text-muted-foreground">Seleccionar...</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={fechaInicio} onSelect={setFechaInicio} locale={es} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Fecha de Entrega</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start font-normal">
                      <IconCalendar size={15} className="mr-2 text-muted-foreground" />
                      {fechaFin
                        ? format(fechaFin, "PPP", { locale: es })
                        : <span className="text-muted-foreground">Seleccionar...</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fechaFin}
                      onSelect={setFechaFin}
                      locale={es}
                      disabled={(date) => fechaInicio ? date < fechaInicio : false}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <Separator />

          {/* ── Precio / ML ── */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Precio
            </p>
            <div className="space-y-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={calcularPrediccion}
                disabled={!origen || !destino || calculando}
                className="gap-2"
              >
                <IconTrendingUp size={15} />
                {calculando ? "Calculando..." : "Calcular predicción ML"}
              </Button>

              {(!origen || !destino) && (
                <p className="text-xs text-muted-foreground">
                  Selecciona origen y destino para habilitar la predicción
                </p>
              )}

              {precioPredecho !== null && (
                <div className="flex items-center gap-4 rounded-lg p-4 border"
                  style={{ background: "rgba(82,61,114,0.08)", borderColor: "rgba(82,61,114,0.2)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "rgba(82,61,114,0.15)" }}>
                    <IconCurrencyPeso size={20} style={{ color: "#523d72" }} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Precio sugerido por el modelo</p>
                    <p className="text-2xl font-bold" style={{ color: "#523d72" }}>
                      ${precioPredecho.toLocaleString("es-MX")} MXN
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Basado en ruta, fechas y datos históricos
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Precio manual{" "}
                  <span className="text-muted-foreground font-normal">(sobreescribe la predicción)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={precioManual}
                    onChange={(e) => setPrecioManual(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="ghost" onClick={() => { resetear(); onCerrar(); }}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmar}
            disabled={!puedeConfirmar || confirmado}
            className="gap-2 min-w-36"
          >
            {confirmado ? (
              <><IconCheck size={15} /> ¡Guardado!</>
            ) : (
              "Confirmar Envío"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
