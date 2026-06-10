// ============================================
// API CLIENT — PHI OMEGA
// ============================================

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function get<T>(path: string, params?: Record<string, string | number | null | undefined>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }
  if (process.env.NEXT_PUBLIC_API_DEBUG === "1") {
    // eslint-disable-next-line no-console
    console.debug("API GET ->", url.toString());
  }
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  if (process.env.NEXT_PUBLIC_API_DEBUG === "1") {
    // Clone so we can log without consuming the original response stream
    res.clone().text().then((body) => {
      // eslint-disable-next-line no-console
      console.debug("API GET RES", url.toString(), "status:", res.status, "body:", body);
    }).catch(() => {});
  }
  return res.json();
}

async function post<T>(path: string, params: Record<string, string | number | null | undefined>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  });
  if (process.env.NEXT_PUBLIC_API_DEBUG === "1") {
    // eslint-disable-next-line no-console
    console.debug("API POST ->", url.toString());
  }
  const res = await fetch(url.toString(), { method: "POST", cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  if (process.env.NEXT_PUBLIC_API_DEBUG === "1") {
    res.clone().text().then((body) => {
      // eslint-disable-next-line no-console
      console.debug("API POST RES", url.toString(), "status:", res.status, "body:", body);
    }).catch(() => {});
  }
  return res.json();
}

// ── Types matching backend responses ─────────────────────────────────────────

export interface KpiResponse {
  clientes: number;
  clientes_delta: number;
  delivered_orders: number;
  deliveries_delta: number;
  profit: number;
  profit_delta: number;
  sales_reps?: number;
  sales_reps_delta?: number;
}

export interface TimeseriesItem {
  month: string;   // "YYYY-MM"
  orders: number;
  utilidad: number;
}

export interface PieItem {
  estatus: string;
  total: number;
}

export interface TopClienteItem {
  utilidad: number;
  cliente: string;
}

export interface TopRepItem {
  utilidad: number;
  nombre: string;
}

export interface TopClienteOrdenesItem {
  total_orders: number;
  cliente: string;
}

export interface ShipmentRow {
  id: string;
  fecha: string;
  estatus: string;
  venta_mxn: number;
  origen: string;
  destino: string;
  cliente: string;
  sales_rep: string;
  carrier?: string;
}

export interface ClienteDbRow {
  cliente: string;
  ordenes: number;
  utilidad: number;
}

export interface RepDbRow {
  sales_rep: string;
  ordenes: number;
  utilidad: number;
  id: number;
  correo: string;
}

export interface ModelSaleResponse {
  prediction: number;
  high_prediction: number;
  low_prediction: number;
}

export interface ModelClientResponse {
  [key: string]: string | number | null;
}

// ── Panel General endpoints ───────────────────────────────────────────────────

export type Period = "7d" | "30d" | "90d" | "1y";

export const panelApi = {
  kpis: (period: Period) =>
    get<KpiResponse>("/panel/", { period }),

  timeseries: () =>
    get<TimeseriesItem[]>("/panel/timeseries"),

  pie: (period: Period) =>
    get<PieItem[]>("/panel/pie", { period }),

  topClientesPorUtilidad: (period: Period) =>
    get<TopClienteItem[]>("/panel/bars", { period }),

  topReps: (period: Period) =>
    get<TopRepItem[]>("/panel/reps", { period }),

  topClientesPorOrdenes: (period: Period) =>
    get<TopClienteOrdenesItem[]>("/panel/clients", { period }),
};

// ── Operaciones endpoints ─────────────────────────────────────────────────────

export const operacionesApi = {
  shipments: (filters: {
    status?: string;
    date_min?: string;
    date_max?: string;
    min_sale?: number;
    max_sale?: number;
    client?: string;
    sales_rep?: string;
  }) =>
    get<ShipmentRow[]>("/operaciones/dborders", {
      status: filters.status ?? "all",
      date_min: filters.date_min,
      date_max: filters.date_max,
      min_sale: filters.min_sale,
      max_sale: filters.max_sale,
      client: filters.client ?? "all",
      sales_rep: filters.sales_rep ?? "all",
    }),

  clientes: (order_by: "utilidad" | "ordenes" = "utilidad", order_how: "asc" | "desc" = "desc") =>
    get<ClienteDbRow[]>("/operaciones/dbclients", { order_by, order_how }),

  reps: (order_by: "utilidad" | "ordenes" = "utilidad", order_how: "asc" | "desc" = "desc") =>
    get<RepDbRow[]>("/operaciones/dbreps", { order_by, order_how }),

  predecirVenta: (params: {
    accesorials: number;
    cliente: string;
    carrier: string;
    name: string;
    origin: string;
    destination: string;
    vehicle_type: string;
    division: string;
    delivery_date: string;
  }) => get<ModelSaleResponse>("/operaciones/modelsale", params),

  modelclient: (params: { cliente?: string; origin?: string; destination?: string; delivery_date?: string }) =>
    get<ModelClientResponse>("/operaciones/modelclient", params),

  vehicleTypes: () => get<string[]>("/operaciones/vehicle_types"),

  divisions: () => get<string[]>("/operaciones/divisions"),
  allClients: () => get<string[]>("/operaciones/allclients"),
  allReps: () => get<string[]>("/operaciones/allreps"),
  allPlaces: () => get<any[]>("/operaciones/allplaces"),

  addCliente: (name: string) =>
    post<{ ok: boolean; nombre: string }>("/operaciones/clients", { name }),

  addRep: (name: string, mail: string) =>
    post<{ ok: boolean; nombre: string; correo: string }>("/operaciones/reps", { name, mail }),

  addPlace: (ciudad: string, estado: string, latitud: number, longitud: number) =>
    post<{ ok: boolean }>("/operaciones/places", { ciudad, estado, latitud, longitud }),

  addTransaction: (params: {
    id_cliente: number;
    id_estatus: number;
    id_origen: number;
    id_destino: number;
    sales_rep_id: number;
    fecha_creacion: string;
    fecha_entrega: string;
    venta_mxn: number;
    utilidad_mxn: number;
    row_hash: string;
  }) => post<{ ok: boolean; row_hash: string }>("/operaciones/transactions", params),
  createTicket: async (params: {
    accesorials: number;
    cliente: string;
    carrier: string;
    origin: string;
    destination: string;
    vehicle_type: string;
    division: string;
    creation_date: string;
    delivery_date: string;
    min_sale: number;
    max_sale: number;
    recommended_sale: number;
  }) => {
    const url = new URL(`${BASE_URL}/operaciones/ticket`);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
    const res = await fetch(url.toString(), { method: "POST", cache: "no-store" });
    if (!res.ok) throw new Error(`API error ${res.status}: /operaciones/ticket`);
    const buffer = await res.arrayBuffer();
    const cd = res.headers.get("content-disposition") || "";
    const m = /filename=\"?([^\";]+)\"?/.exec(cd);
    const filename = m ? m[1] : "ticket.pdf";
    return { buffer, filename };
  },
};
