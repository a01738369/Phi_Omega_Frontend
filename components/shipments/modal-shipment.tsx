"use client";
import { useState } from "react";
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
} from "@tabler/icons-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CLIENTES, USUARIOS, LUGARES } from "@/lib/mock-data";

interface ModalShipmentProps {
  abierto: boolean;
  onCerrar: () => void;
}

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

  // Simula el llamado al modelo ML
  async function calcularPrediccion() {
    if (!origen || !destino) return;
    setCalculando(true);
    // Simulamos delay del modelo ML
    await new Promise((r) => setTimeout(r, 1200));
    // Precio simulado basado en ruta
    const base = 22000;
    const extra = Math.floor(Math.random() * 45000);
    setPrecioPredecho(base + extra);
    setCalculando(false);
  }

  function handleConfirmar() {
    const precio = precioManual ? Number(precioManual) : precioPredecho;
    console.log("✅ Nuevo Shipment creado:", {
      id_cliente: idCliente,
      sales_rep: salesRep,
      id_origen: origen,
      id_destino: destino,
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
    setIdCliente("");
    setSalesRep("");
    setOrigen("");
    setDestino("");
    setFechaInicio(undefined);
    setFechaFin(undefined);
    setPrecioPredecho(null);
    setPrecioManual("");
  }

  const puedeConfirmar =
    idCliente && salesRep && origen && destino && fechaInicio && fechaFin &&
    (precioPredecho !== null || precioManual !== "");

  return (
    <Dialog open={abierto} onOpenChange={(open) => { if (!open) { resetear(); onCerrar(); } }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Shipment</DialogTitle>
          <DialogDescription>
            Completa los datos del envío. El precio puede ser calculado por el modelo o ingresado manualmente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Sección 1: Cliente y Sales Rep */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Asignación
            </p>
            <div className="grid grid-cols-2 gap-3">
              {/* Cliente */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Cliente</label>
                <Select value={idCliente} onValueChange={setIdCliente}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CLIENTES.map((c) => (
                      <SelectItem key={c.id_cliente} value={c.id_cliente}>
                        {c.Nombre}
                      </SelectItem>
                    ))}
                    <Separator className="my-1" />
                    <SelectItem value="NUEVO">
                      + Agregar nuevo cliente
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sales Rep */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Sales Rep</label>
                <Select value={salesRep} onValueChange={setSalesRep}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rep..." />
                  </SelectTrigger>
                  <SelectContent>
                    {USUARIOS.filter((u) => u.cargo === "Sales Rep").map((u) => (
                      <SelectItem key={u.id_usuarios} value={u.id_usuarios}>
                        {u.Nombre}
                      </SelectItem>
                    ))}
                    <Separator className="my-1" />
                    <SelectItem value="NUEVO">
                      + Agregar nuevo sales rep
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Sección 2: Ruta */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Ruta
            </p>
            <div className="grid grid-cols-2 gap-3">
              {/* Origen */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Origen</label>
                <Select value={origen} onValueChange={setOrigen}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ciudad de origen..." />
                  </SelectTrigger>
                  <SelectContent>
                    {LUGARES.map((l) => (
                      <SelectItem key={l.id_lugares} value={l.id_lugares}>
                        {l.ciudad}, {l.estado} — {l.pais}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Destino */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Destino</label>
                <Select value={destino} onValueChange={setDestino}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ciudad de destino..." />
                  </SelectTrigger>
                  <SelectContent>
                    {LUGARES.map((l) => (
                      <SelectItem key={l.id_lugares} value={l.id_lugares}>
                        {l.ciudad}, {l.estado} — {l.pais}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Sección 3: Fechas */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Fechas
            </p>
            <div className="grid grid-cols-2 gap-3">
              {/* Fecha Inicio */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Fecha de Inicio</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <IconCalendar size={15} className="mr-2 text-muted-foreground" />
                      {fechaInicio
                        ? format(fechaInicio, "PPP", { locale: es })
                        : <span className="text-muted-foreground">Seleccionar fecha...</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fechaInicio}
                      onSelect={setFechaInicio}
                      locale={es}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Fecha Fin */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Fecha de Entrega</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <IconCalendar size={15} className="mr-2 text-muted-foreground" />
                      {fechaFin
                        ? format(fechaFin, "PPP", { locale: es })
                        : <span className="text-muted-foreground">Seleccionar fecha...</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fechaFin}
                      onSelect={setFechaFin}
                      locale={es}
                      disabled={(date) =>
                        fechaInicio ? date < fechaInicio : false
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <Separator />

          {/* Sección 4: Precio / ML */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Precio
            </p>
            <div className="space-y-3">
              {/* Botón de predicción */}
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

              {!origen || !destino ? (
                <p className="text-xs text-muted-foreground">
                  Selecciona origen y destino para habilitar la predicción
                </p>
              ) : null}

              {/* Resultado predicción */}
              {precioPredecho !== null && (
                <div className="flex items-center gap-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center shrink-0">
                    <IconCurrencyPeso size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Precio sugerido por el modelo</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${precioPredecho.toLocaleString("es-MX")} MXN
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Basado en ruta, fechas y clientes registrados
                    </p>
                  </div>
                </div>
              )}

              {/* Campo de precio manual */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Precio manual{" "}
                  <span className="text-muted-foreground font-normal">(opcional — sobreescribe la predicción)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    $
                  </span>
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
              <>
                <IconCheck size={15} />
                ¡Agregado!
              </>
            ) : (
              "Confirmar Shipment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
