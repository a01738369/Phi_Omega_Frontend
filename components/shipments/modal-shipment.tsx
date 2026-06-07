"use client";
import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  IconCalendar, IconTrendingUp, IconCurrencyPeso,
  IconCheck, IconMapPin, IconPlus, IconSearch,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { operacionesApi, type ModelSaleResponse } from "@/lib/api";
import type { Lugar } from "@/lib/types";

// Fetched at runtime from the backend instead of mock-data
interface ClienteOption { nombre: string }
interface RepOption     { nombre: string }

interface ModalShipmentProps {
  abierto: boolean;
  onCerrar: () => void;
}

interface FormNuevoLugar { ciudad: string; estado: string; pais: string }
const LUGAR_VACIO: FormNuevoLugar = { ciudad: "", estado: "", pais: "" };

export function ModalShipment({ abierto, onCerrar }: ModalShipmentProps) {
  const [clientes, setClientes]     = useState<ClienteOption[]>([]);
  const [reps, setReps]             = useState<RepOption[]>([]);
  const [lugares, setLugares]       = useState<{ label: string; value: string }[]>([]);
  const [carriers, setCarriers]     = useState<{ label: string; value: string }[]>([]);

  const [idCliente, setIdCliente]   = useState("");
  const [salesRep, setSalesRep]     = useState("");
  const [origen, setOrigen]         = useState("");
  const [destino, setDestino]       = useState("");
  const [carrier, setCarrier]       = useState("");
  const [predictedCarriers, setPredictedCarriers] = useState<string[]>([]);
  const [predictingCarrier, setPredictingCarrier] = useState(false);
  const [fechaInicio, setFechaInicio] = useState<Date | undefined>();
  const [fechaFin, setFechaFin]     = useState<Date | undefined>();

  const [prediccion, setPrediccion] = useState<ModelSaleResponse | null>(null);
  const [precioManual, setPrecioManual] = useState("");
  const [calculando, setCalculando] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [guardando, setGuardando]   = useState(false);
  const [vehicleType, setVehicleType] = useState("");
  const [divisionField, setDivisionField] = useState("");

  const [mostrarNuevoOrigen, setMostrarNuevoOrigen]   = useState(false);
  const [mostrarNuevoDestino, setMostrarNuevoDestino] = useState(false);
  const [formNuevoOrigen, setFormNuevoOrigen]   = useState<FormNuevoLugar>(LUGAR_VACIO);
  const [formNuevoDestino, setFormNuevoDestino] = useState<FormNuevoLugar>(LUGAR_VACIO);
  const [mostrarNuevoCliente, setMostrarNuevoCliente] = useState(false);
  const [nuevoClienteName, setNuevoClienteName] = useState("");
  const [mostrarNuevoRep, setMostrarNuevoRep] = useState(false);
  const [nuevoRepName, setNuevoRepName] = useState("");
  const [nuevoRepMail, setNuevoRepMail] = useState("");
  const [mostrarNuevoLugar, setMostrarNuevoLugar] = useState(false);
  const [formNuevoLugar, setFormNuevoLugar] = useState<FormNuevoLugar>(LUGAR_VACIO);
  const [nuevoLugarTarget, setNuevoLugarTarget] = useState<"origen" | "destino">("origen");
  const [clienteQuery, setClienteQuery] = useState("");
  const [repQuery, setRepQuery] = useState("");
  const [origenQuery, setOrigenQuery] = useState("");
  const [destinoQuery, setDestinoQuery] = useState("");
  const [carrierQuery, setCarrierQuery] = useState("");
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [divisions, setDivisions] = useState<string[]>([]);
  const [vehicleTypeQuery, setVehicleTypeQuery] = useState("");
  const [divisionQuery, setDivisionQuery] = useState("");

  // Load dropdown data when modal opens
  useEffect(() => {
    if (!abierto) return;
    // prefer new endpoints returning simple arrays
    operacionesApi.allClients()
      .then((rows) => {
        console.debug("using /operaciones/allclients", rows?.length);
        setClientes((rows || []).map((r: any) => ({ nombre: typeof r === 'string' ? r : (r.name || r.nombre || String(r)) })));
      })
      .catch((err) => {
        console.debug("/operaciones/allclients failed, falling back to /operaciones/dbclients", err);
        operacionesApi.clientes().then((rows) => setClientes(rows.map((r) => ({ nombre: r.cliente }))));
      });

    operacionesApi.allReps()
      .then((rows) => {
        console.debug("using /operaciones/allreps", rows?.length);
        setReps((rows || []).map((r: any) => ({ nombre: typeof r === 'string' ? r : (r.name || r.nombre || String(r)) })));
      })
      .catch((err) => {
        console.debug("/operaciones/allreps failed, falling back to /operaciones/dbreps", err);
        operacionesApi.reps().then((rows) => setReps(rows.map((r) => ({ nombre: r.sales_rep }))));
      });

    // fetch places list
    operacionesApi.allPlaces()
      .then((rows) => {
        console.debug("using /operaciones/allplaces", rows?.length);
        const normalized = (rows || []).map((r: any) => {
          if (typeof r === 'string') return r;
          if (r && typeof r === 'object') return (r.lugar || r.label || r.ciudad || Object.values(r).find(v => typeof v === 'string'));
          return String(r);
        }).filter(Boolean) as string[];
        setLugares(Array.from(new Set(normalized)).sort().map((v) => ({ label: v, value: v })));
        // also check if any entries include carrier names and populate carriers list
        try {
          const carrierCandidates = new Set<string>();
          (rows || []).forEach((r: any) => {
            if (!r) return;
            if (typeof r === 'string') return;
            if (r.carrier && typeof r.carrier === 'string') carrierCandidates.add(r.carrier);
            if (r.carriers && Array.isArray(r.carriers)) r.carriers.forEach((c:any) => { if (typeof c === 'string') carrierCandidates.add(c); });
            if (r.label && typeof r.label === 'string' && /carrier/i.test(r.label)) carrierCandidates.add(r.label);
          });
          if (carrierCandidates.size) {
            setCarriers(Array.from(carrierCandidates).sort().map((v) => ({ label: v, value: v })));
          }
        } catch (e) { /* ignore */ }
      })
      .catch((err) => {
        console.debug("/operaciones/allplaces failed, falling back to shipments-derived places", err);
        // fallback: derive from shipments
        operacionesApi.shipments({}).then((rows) => {
          const set = new Set<string>();
          const carriersSet = new Set<string>();
          rows.forEach((r) => { set.add(r.origen); set.add(r.destino); if (r.carrier) carriersSet.add(r.carrier); });
          setLugares([...set].sort().map((v) => ({ label: v, value: v })));
          setCarriers([...carriersSet].sort().map((v) => ({ label: v, value: v })));
        });
      });
    // Always try to populate carriers from shipments too (helps when /allplaces doesn't include carriers)
    operacionesApi.shipments({}).then((rows) => {
      try {
        const carriersSet = new Set<string>();
        rows.forEach((r) => { if (r.carrier) carriersSet.add(r.carrier); });
        if (carriersSet.size) setCarriers([...carriersSet].sort().map((v) => ({ label: v, value: v })));
      } catch (e) { /* ignore */ }
    }).catch(() => {});
    // fetch vehicle types and divisions (arrays of strings)
    operacionesApi.vehicleTypes()
      .then((rows) => setVehicleTypes((rows || []).map((r: any) => {
        if (typeof r === "string") return r.trim();
        if (r && typeof r === "object") {
          const vals = Object.values(r).filter((v) => typeof v === "string" && v.trim());
          if (vals.length) return String(vals[0]).trim();
        }
        try { return String(JSON.stringify(r)); } catch { return String(r); }
      })))
      .catch(() => setVehicleTypes([]));
    operacionesApi.divisions()
      .then((rows) => setDivisions((rows || []).map((r: any) => {
        if (typeof r === "string") return r.trim();
        if (r && typeof r === "object") {
          const vals = Object.values(r).filter((v) => typeof v === "string" && v.trim());
          if (vals.length) return String(vals[0]).trim();
        }
        try { return String(JSON.stringify(r)); } catch { return String(r); }
      })))
      .catch(() => setDivisions([]));
  }, [abierto]);

  async function guardarNuevoOrigen() {
    if (!formNuevoOrigen.ciudad || !formNuevoOrigen.estado) return;
    await operacionesApi.addPlace(
      formNuevoOrigen.ciudad, formNuevoOrigen.estado, 0, 0
    );
    const label = `${formNuevoOrigen.ciudad}, ${formNuevoOrigen.estado}`;
    setLugares((prev) => [...prev, { label, value: label }]);
    setOrigen(label);
    setMostrarNuevoOrigen(false);
    setFormNuevoOrigen(LUGAR_VACIO);
  }

  async function guardarNuevoDestino() {
    if (!formNuevoDestino.ciudad || !formNuevoDestino.estado) return;
    await operacionesApi.addPlace(
      formNuevoDestino.ciudad, formNuevoDestino.estado, 0, 0
    );
    const label = `${formNuevoDestino.ciudad}, ${formNuevoDestino.estado}`;
    setLugares((prev) => [...prev, { label, value: label }]);
    setDestino(label);
    setMostrarNuevoDestino(false);
    setFormNuevoDestino(LUGAR_VACIO);
  }

  async function agregarCliente() {
    if (!nuevoClienteName) return;
    try {
      const res = await operacionesApi.addCliente(nuevoClienteName);
      if (res?.ok) {
        const nombre = res.nombre;
        setClientes((prev) => [{ nombre }, ...prev]);
        setIdCliente(nombre);
        setNuevoClienteName("");
        setMostrarNuevoCliente(false);
      }
    } catch (err) {
      console.error("Error adding client", err);
    }
  }

  async function agregarRep() {
    if (!nuevoRepName || !nuevoRepMail) return;
    try {
      const res = await operacionesApi.addRep(nuevoRepName, nuevoRepMail);
      if (res?.ok) {
        const nombre = res.nombre;
        setReps((prev) => [{ nombre }, ...prev]);
        setSalesRep(nombre);
        setNuevoRepName(""); setNuevoRepMail(""); setMostrarNuevoRep(false);
      }
    } catch (err) {
      console.error("Error adding rep", err);
    }
  }

  async function guardarNuevoLugarGeneral() {
    if (!formNuevoLugar.ciudad || !formNuevoLugar.estado) return;
    try {
      await operacionesApi.addPlace(formNuevoLugar.ciudad, formNuevoLugar.estado, 0, 0);
      const label = `${formNuevoLugar.ciudad}, ${formNuevoLugar.estado}`;
      setLugares((prev) => [...prev, { label, value: label }]);
      if (nuevoLugarTarget === "origen") setOrigen(label);
      else setDestino(label);
      setFormNuevoLugar(LUGAR_VACIO);
      setMostrarNuevoLugar(false);
    } catch (err) {
      console.error("Error adding place", err);
    }
  }

  async function predecirCarrier() {
    // require all fields except carrier: cliente, salesRep, origen, destino, fechaInicio, fechaFin
    // add debug logging to understand why this may be skipped or failing
    // eslint-disable-next-line no-console
    console.debug("predecirCarrier called", { idCliente, salesRep, origen, destino, fechaInicio, fechaFin });
    if (!idCliente || !salesRep || !origen || !destino || !fechaInicio || !fechaFin) {
      // eslint-disable-next-line no-console
      console.warn("predecirCarrier aborted — missing required fields", { idCliente, salesRep, origen, destino, fechaInicio, fechaFin });
      return;
    }
    setPredictingCarrier(true);
    try {
      const resp = await operacionesApi.modelclient({
        cliente: idCliente || undefined,
        origin: origen,
        destination: destino,
        delivery_date: format(fechaFin, "yyyy-MM-dd"),
      });
      console.debug("modelclient response:", resp);
      // backend returns keys like possibility_0..possibility_3 or arrays/objects
      const possibilities: string[] = [];

      const pushVal = (v: any) => {
        if (v === null || v === undefined) return;
        if (typeof v === "string") { const t = v.trim(); if (t) possibilities.push(t); return; }
        if (typeof v === "number" || typeof v === "boolean") { possibilities.push(String(v)); return; }
        if (Array.isArray(v)) { v.forEach(pushVal); return; }
        if (typeof v === "object") {
          const candidate = v.name || v.carrier || v.label || v[0] || v.value;
          if (candidate) pushVal(candidate);
        }
      };

      for (let i = 0; i < 8; i++) {
        const k = `possibility_${i}`;
        // @ts-ignore
        pushVal(resp[k]);
      }

      // handle common array fields
      // @ts-ignore
      const arrays = resp.predictions || resp.possibilities || resp.results || resp.items || resp.posibles;
      if (arrays) pushVal(arrays);

      // fallback: walk object values shallowly
      if (possibilities.length === 0) {
        Object.values(resp).forEach(pushVal);
      }

      // dedupe while preserving order and take up to 4
      const seen = new Set<string>();
      const final: string[] = [];
      for (const p of possibilities) {
        if (!p) continue;
        if (!seen.has(p)) { seen.add(p); final.push(p); }
        if (final.length >= 4) break;
      }
      console.debug("parsed predicted carriers:", final);
      setPredictedCarriers(final);
    } catch (err) {
      console.error("Carrier prediction failed", err);
      setPredictedCarriers([]);
    } finally {
      setPredictingCarrier(false);
    }
  }

  async function calcularPrediccion() {
    if (!origen || !destino || !fechaFin) return;
    setCalculando(true);
    try {
      const result = await operacionesApi.predecirVenta({
        accesorials: 0,
        cliente: idCliente,
        carrier: carrier || "",
        name: "",
        origin: origen,
        destination: destino,
        vehicle_type: vehicleType || "",
        division: divisionField || "",
        delivery_date: format(fechaFin, "yyyy-MM-dd"),
      });
      setPrediccion(result);
    } catch {
      // If model isn't ready, fail gracefully
      console.error("Predicción no disponible");
    } finally {
      setCalculando(false);
    }
  }

  async function handleConfirmar() {
    setGuardando(true);
    try {
      // POST the transaction — IDs would normally come from the backend catalogue;
      // for now we log and close (wire up id resolution when your catalogue endpoints are ready)
      console.log("✅ Nuevo envío:", {
        cliente: idCliente, sales_rep: salesRep,
        origen, destino, fechaInicio, fechaFin,
        precio: precioManual ? Number(precioManual) : prediccion?.prediction,
      });
      setConfirmado(true);
      setTimeout(() => { setConfirmado(false); resetear(); onCerrar(); }, 1500);
    } finally {
      setGuardando(false);
    }
  }

  function resetear() {
    setIdCliente(""); setSalesRep(""); setOrigen(""); setDestino("");
    setFechaInicio(undefined); setFechaFin(undefined);
    setPrediccion(null); setPrecioManual("");
    setMostrarNuevoOrigen(false); setMostrarNuevoDestino(false);
    setFormNuevoOrigen(LUGAR_VACIO); setFormNuevoDestino(LUGAR_VACIO);
    setVehicleType(""); setDivisionField("");
    setVehicleTypeQuery(""); setDivisionQuery("");
  }

  const puedeConfirmar =
    idCliente && salesRep && origen && destino && fechaInicio && fechaFin &&
    (prediccion !== null || precioManual !== "");

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
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Asignación</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Cliente</label>
                <Input placeholder="Buscar cliente..." value={clienteQuery} onChange={(e) => setClienteQuery(e.target.value)} className="h-8 text-sm" />
                <Select value={idCliente} onValueChange={setIdCliente}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar cliente..." /></SelectTrigger>
                  <SelectContent>
                    {clientes.filter(c => c.nombre.toLowerCase().includes(clienteQuery.toLowerCase())).map((c) => (
                      <SelectItem key={c.nombre} value={c.nombre}>{c.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-2">
                  {!mostrarNuevoCliente && (
                    <Button size="sm" variant="ghost" onClick={() => setMostrarNuevoCliente(true)}>Agregar cliente</Button>
                  )}
                  {mostrarNuevoCliente && (
                    <div className="mt-2 p-3 bg-muted/50 rounded-lg border space-y-2">
                      <Input placeholder="Nombre cliente" value={nuevoClienteName} onChange={(e) => setNuevoClienteName(e.target.value)} className="h-8 text-sm" />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={agregarCliente}>Guardar cliente</Button>
                        <Button size="sm" variant="ghost" onClick={() => { setMostrarNuevoCliente(false); setNuevoClienteName(""); }}>Cancelar</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Sales Rep</label>
                <Input placeholder="Buscar rep..." value={repQuery} onChange={(e) => setRepQuery(e.target.value)} className="h-8 text-sm" />
                <Select value={salesRep} onValueChange={setSalesRep}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar rep..." /></SelectTrigger>
                  <SelectContent>
                    {reps.filter(r => r.nombre.toLowerCase().includes(repQuery.toLowerCase())).map((r) => (
                      <SelectItem key={r.nombre} value={r.nombre}>{r.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-2">
                  {!mostrarNuevoRep && (
                    <Button size="sm" variant="ghost" onClick={() => setMostrarNuevoRep(true)}>Agregar rep</Button>
                  )}
                  {mostrarNuevoRep && (
                    <div className="mt-2 p-3 bg-muted/50 rounded-lg border space-y-2">
                      <Input placeholder="Nombre" value={nuevoRepName} onChange={(e) => setNuevoRepName(e.target.value)} className="h-8 text-sm" />
                      <Input placeholder="Correo" value={nuevoRepMail} onChange={(e) => setNuevoRepMail(e.target.value)} className="h-8 text-sm" />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={agregarRep}>Guardar rep</Button>
                        <Button size="sm" variant="ghost" onClick={() => { setMostrarNuevoRep(false); setNuevoRepName(""); setNuevoRepMail(""); }}>Cancelar</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Predicción de Carrier</p>
              <div className="flex gap-2 items-center">
              <Button size="sm" variant="secondary" onClick={predecirCarrier} disabled={!idCliente || !salesRep || !origen || !destino || !fechaInicio || !fechaFin || predictingCarrier}>
                {predictingCarrier ? "Predicting..." : "Predecir carrier"}
              </Button>
              <p className="text-xs text-muted-foreground">(requiere cliente, rep y fechas)</p>
            </div>

            {predictedCarriers.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {predictedCarriers.map((c) => (
                  <Button key={c} size="sm" variant={c === carrier ? "default" : "ghost"} onClick={() => setCarrier(c)}>
                    {c}
                  </Button>
                ))}
              </div>
            )}
          </div>

          
          {/* Insert Carrier section above Precio/ML */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Carrier</p>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Carrier</label>
              <Select value={carrier} onValueChange={setCarrier}>
                <SelectTrigger><SelectValue placeholder="Seleccionar carrier..." /></SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <Input placeholder="Buscar carrier..." value={carrierQuery} onChange={(e) => setCarrierQuery(e.target.value)} className="h-8 text-sm" />
                  </div>
                  {carriers.filter(c => c.label.toLowerCase().includes(carrierQuery.toLowerCase())).map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                  {/* placeholder when no carriers available */}
                  {carriers.length === 0 && (
                    <div className="p-3 text-xs text-muted-foreground">No hay carriers en el catálogo</div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* ── Ruta ── */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Ruta</p>
            <div className="grid grid-cols-2 gap-3">

              {/* ORIGEN */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Origen</label>
                <Select value={origen} onValueChange={(val) => {
                  if (val === "NUEVO_ORIGEN") { setMostrarNuevoOrigen(true); setOrigen(""); }
                  else { setOrigen(val); setMostrarNuevoOrigen(false); }
                }}>
                    <SelectTrigger><SelectValue placeholder="Ciudad de origen..." /></SelectTrigger>
                      <SelectContent>
                        {lugares.filter(l => l.label.toLowerCase().includes(origenQuery.toLowerCase())).map((l) => (
                          <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                        ))}
                        <Separator className="my-1" />
                        <SelectItem value="NUEVO_ORIGEN">
                          <span className="flex items-center gap-1"><IconMapPin size={13} /> + Registrar nuevo origen</span>
                        </SelectItem>
                      </SelectContent>
                </Select>
                    <div className="mt-2">
                      <Input placeholder="Buscar origen..." value={origenQuery} onChange={(e) => setOrigenQuery(e.target.value)} className="h-8 text-sm" />
                    </div>
                {mostrarNuevoOrigen && (
                  <div className="mt-2 p-3 bg-muted/50 rounded-lg border space-y-2">
                    <p className="text-xs font-semibold flex items-center gap-1"><IconPlus size={12} /> Registrar nuevo origen</p>
                    <Input placeholder="Ciudad" value={formNuevoOrigen.ciudad}
                      onChange={(e) => setFormNuevoOrigen((p) => ({ ...p, ciudad: e.target.value }))} className="h-8 text-sm" />
                    <Input placeholder="Estado / Provincia" value={formNuevoOrigen.estado}
                      onChange={(e) => setFormNuevoOrigen((p) => ({ ...p, estado: e.target.value }))} className="h-8 text-sm" />
                    <Input placeholder="País" value={formNuevoOrigen.pais}
                      onChange={(e) => setFormNuevoOrigen((p) => ({ ...p, pais: e.target.value }))} className="h-8 text-sm" />
                    <div className="flex gap-2">
                      <Button size="sm" className="h-7 text-xs" onClick={guardarNuevoOrigen}>Guardar origen</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs"
                        onClick={() => { setMostrarNuevoOrigen(false); setFormNuevoOrigen(LUGAR_VACIO); }}>Cancelar</Button>
                    </div>
                  </div>
                )}
              </div>

              {/* DESTINO */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Destino</label>
                <Select value={destino} onValueChange={(val) => {
                  if (val === "NUEVO_DESTINO") { setMostrarNuevoDestino(true); setDestino(""); }
                  else { setDestino(val); setMostrarNuevoDestino(false); }
                }}>
                    <SelectTrigger><SelectValue placeholder="Ciudad de destino..." /></SelectTrigger>
                      <SelectContent>
                        {lugares.filter(l => l.label.toLowerCase().includes(destinoQuery.toLowerCase())).map((l) => (
                          <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                        ))}
                        <Separator className="my-1" />
                        <SelectItem value="NUEVO_DESTINO">
                          <span className="flex items-center gap-1"><IconMapPin size={13} /> + Registrar nuevo destino</span>
                        </SelectItem>
                      </SelectContent>
                </Select>
                    <div className="mt-2">
                      <Input placeholder="Buscar destino..." value={destinoQuery} onChange={(e) => setDestinoQuery(e.target.value)} className="h-8 text-sm" />
                    </div>
                {mostrarNuevoDestino && (
                  <div className="mt-2 p-3 bg-muted/50 rounded-lg border space-y-2">
                    <p className="text-xs font-semibold flex items-center gap-1"><IconPlus size={12} /> Registrar nuevo destino</p>
                    <Input placeholder="Ciudad" value={formNuevoDestino.ciudad}
                      onChange={(e) => setFormNuevoDestino((p) => ({ ...p, ciudad: e.target.value }))} className="h-8 text-sm" />
                    <Input placeholder="Estado / Provincia" value={formNuevoDestino.estado}
                      onChange={(e) => setFormNuevoDestino((p) => ({ ...p, estado: e.target.value }))} className="h-8 text-sm" />
                    <Input placeholder="País" value={formNuevoDestino.pais}
                      onChange={(e) => setFormNuevoDestino((p) => ({ ...p, pais: e.target.value }))} className="h-8 text-sm" />
                    <div className="flex gap-2">
                      <Button size="sm" className="h-7 text-xs" onClick={guardarNuevoDestino}>Guardar destino</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs"
                        onClick={() => { setMostrarNuevoDestino(false); setFormNuevoDestino(LUGAR_VACIO); }}>Cancelar</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3">
              {!mostrarNuevoLugar && (
                <Button size="sm" variant="ghost" onClick={() => { setMostrarNuevoLugar(true); setNuevoLugarTarget("origen"); }}>
                  Agregar lugar
                </Button>
              )}
              {mostrarNuevoLugar && (
                <div className="mt-2 p-3 bg-muted/50 rounded-lg border space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Ciudad" value={formNuevoLugar.ciudad} onChange={(e) => setFormNuevoLugar((p) => ({ ...p, ciudad: e.target.value }))} className="h-8 text-sm" />
                    <Input placeholder="Estado / Provincia" value={formNuevoLugar.estado} onChange={(e) => setFormNuevoLugar((p) => ({ ...p, estado: e.target.value }))} className="h-8 text-sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Asignar a:</label>
                    <select value={nuevoLugarTarget} onChange={(e) => setNuevoLugarTarget(e.target.value as any)} className="text-sm p-1 rounded border">
                      <option value="origen">Origen</option>
                      <option value="destino">Destino</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={guardarNuevoLugarGeneral}>Guardar lugar</Button>
                    <Button size="sm" variant="ghost" onClick={() => { setMostrarNuevoLugar(false); setFormNuevoLugar(LUGAR_VACIO); }}>Cancelar</Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* ── Fechas ── */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Fechas</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Fecha de Inicio</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start font-normal">
                      <IconCalendar size={15} className="mr-2 text-muted-foreground" />
                      {fechaInicio ? format(fechaInicio, "PPP", { locale: es })
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
                      {fechaFin ? format(fechaFin, "PPP", { locale: es })
                        : <span className="text-muted-foreground">Seleccionar...</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={fechaFin} onSelect={setFechaFin} locale={es}
                      disabled={(date) => fechaInicio ? date < fechaInicio : false} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <Separator />

          {/* ── Precio / ML ── */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Precio</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input placeholder="Buscar vehicle type..." value={vehicleTypeQuery} onChange={(e) => setVehicleTypeQuery(e.target.value)} className="h-8 text-sm mb-2" />
                  <Select value={vehicleType} onValueChange={setVehicleType}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Vehicle type" /></SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.filter(v => v.toLowerCase().includes(vehicleTypeQuery.toLowerCase())).length === 0 && (
                        <div className="p-2 text-xs text-muted-foreground">No disponibles</div>
                      )}
                      {vehicleTypes.filter(v => v.toLowerCase().includes(vehicleTypeQuery.toLowerCase())).map((v) => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Input placeholder="Buscar division..." value={divisionQuery} onChange={(e) => setDivisionQuery(e.target.value)} className="h-8 text-sm mb-2" />
                  <Select value={divisionField} onValueChange={setDivisionField}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Division" /></SelectTrigger>
                    <SelectContent>
                      {divisions.filter(d => d.toLowerCase().includes(divisionQuery.toLowerCase())).length === 0 && (
                        <div className="p-2 text-xs text-muted-foreground">No disponibles</div>
                      )}
                      {divisions.filter(d => d.toLowerCase().includes(divisionQuery.toLowerCase())).map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={calcularPrediccion}
                disabled={!origen || !destino || !fechaFin || calculando} className="gap-2">
                <IconTrendingUp size={15} />
                {calculando ? "Calculando..." : "Calcular predicción ML"}
              </Button>

              {(!origen || !destino) && (
                <p className="text-xs text-muted-foreground">
                  Selecciona origen, destino y fecha de entrega para habilitar la predicción
                </p>
              )}

              {prediccion !== null && (
                <div className="rounded-lg p-4 border space-y-1"
                  style={{ background: "rgba(82,61,114,0.08)", borderColor: "rgba(82,61,114,0.2)" }}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "rgba(82,61,114,0.15)" }}>
                      <IconCurrencyPeso size={20} style={{ color: "#523d72" }} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Precio sugerido por el modelo</p>
                      <p className="text-2xl font-bold" style={{ color: "#523d72" }}>
                        ${prediccion.prediction.toLocaleString("es-MX")} MXN
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Rango: ${prediccion.low_prediction.toLocaleString("es-MX")} – ${prediccion.high_prediction.toLocaleString("es-MX")}
                      </p>
                    </div>
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
                  <Input type="number" placeholder="0.00" value={precioManual}
                    onChange={(e) => setPrecioManual(e.target.value)} className="pl-7" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="ghost" onClick={() => { resetear(); onCerrar(); }}>Cancelar</Button>
          <Button onClick={handleConfirmar} disabled={!puedeConfirmar || confirmado || guardando}
            className="gap-2 min-w-36">
            {confirmado ? <><IconCheck size={15} /> ¡Guardado!</> : "Confirmar Envío"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
