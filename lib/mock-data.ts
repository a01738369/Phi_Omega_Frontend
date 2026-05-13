import type {
  Cliente,
  Usuario,
  Lugar,
  EstatusItem,
  KPIData,
  DatoHistorico,
  ClienteResumen,
  SalesRepResumen,
  ShipmentResumen,
} from "./types";

// ============================================
// CATÁLOGOS
// ============================================

export const CLIENTES: Cliente[] = [
  { id_cliente: "CLI001", Nombre: "Grupo Industrial Alfa SA de CV" },
  { id_cliente: "CLI002", Nombre: "Transportes del Norte SA" },
  { id_cliente: "CLI003", Nombre: "Logística Premium MX" },
  { id_cliente: "CLI004", Nombre: "Comercializadora Beta" },
  { id_cliente: "CLI005", Nombre: "Distribuidora Omega" },
  { id_cliente: "CLI006", Nombre: "Maquiladora Delta SA" },
  { id_cliente: "CLI007", Nombre: "Exportaciones Sigma" },
];

export const USUARIOS: Usuario[] = [
  { id_usuarios: "USR001", Nombre: "Carlos Méndez", correo: "c.mendez@phiomega.mx", cargo: "Sales Rep" },
  { id_usuarios: "USR002", Nombre: "Ana Rodríguez", correo: "a.rodriguez@phiomega.mx", cargo: "Sales Rep" },
  { id_usuarios: "USR003", Nombre: "Luis Torres", correo: "l.torres@phiomega.mx", cargo: "Sales Rep" },
  { id_usuarios: "USR004", Nombre: "María García", correo: "m.garcia@phiomega.mx", cargo: "Ops Rep" },
  { id_usuarios: "USR005", Nombre: "Roberto Sánchez", correo: "r.sanchez@phiomega.mx", cargo: "Ops Rep" },
  { id_usuarios: "USR006", Nombre: "Sofía López", correo: "s.lopez@phiomega.mx", cargo: "Sales Rep" },
];

export const LUGARES: Lugar[] = [
  { id_lugares: "LUG001", ciudad: "Monterrey", estado: "Nuevo León", pais: "México" },
  { id_lugares: "LUG002", ciudad: "Guadalajara", estado: "Jalisco", pais: "México" },
  { id_lugares: "LUG003", ciudad: "Ciudad de México", estado: "CDMX", pais: "México" },
  { id_lugares: "LUG004", ciudad: "Laredo", estado: "Texas", pais: "EUA" },
  { id_lugares: "LUG005", ciudad: "El Paso", estado: "Texas", pais: "EUA" },
  { id_lugares: "LUG006", ciudad: "San Antonio", estado: "Texas", pais: "EUA" },
  { id_lugares: "LUG007", ciudad: "Saltillo", estado: "Coahuila", pais: "México" },
  { id_lugares: "LUG008", ciudad: "Tijuana", estado: "Baja California", pais: "México" },
];

export const ESTATUS_LISTA: EstatusItem[] = [
  { id_estatus: 1, estatus: "Activo" },
  { id_estatus: 2, estatus: "En tránsito" },
  { id_estatus: 3, estatus: "En aduana" },
  { id_estatus: 4, estatus: "Entregado" },
  { id_estatus: 5, estatus: "Cancelado" },
  { id_estatus: 6, estatus: "En espera" },
];

// ============================================
// DATOS PARA EL DASHBOARD — PÁGINA 1
// ============================================

export const KPI_DATA: KPIData = {
  totalClientes: 47,
  shipmentsActivos: 128,
  utilidadTotal: 2_340_500,
  totalSalesRep: 8,
  variacionClientes: 12,
  variacionShipments: -5,
  variacionUtilidad: 18,
};

export const HISTORICO: DatoHistorico[] = [
  { mes: "Ene", ordenes: 45, utilidad: 180000 },
  { mes: "Feb", ordenes: 52, utilidad: 215000 },
  { mes: "Mar", ordenes: 38, utilidad: 152000 },
  { mes: "Abr", ordenes: 67, utilidad: 285000 },
  { mes: "May", ordenes: 71, utilidad: 312000 },
  { mes: "Jun", ordenes: 59, utilidad: 248000 },
  { mes: "Jul", ordenes: 83, utilidad: 367000 },
  { mes: "Ago", ordenes: 74, utilidad: 319000 },
  { mes: "Sep", ordenes: 91, utilidad: 402000 },
  { mes: "Oct", ordenes: 68, utilidad: 291000 },
  { mes: "Nov", ordenes: 55, utilidad: 228000 },
  { mes: "Dic", ordenes: 48, utilidad: 194000 },
];

export const TOP_CLIENTES: ClienteResumen[] = [
  { id_cliente: "CLI001", nombre: "Grupo Industrial Alfa SA de CV", ubicacion: "Monterrey, NL", totalOrdenes: 87, totalUtilidad: 1250000 },
  { id_cliente: "CLI003", nombre: "Logística Premium MX", ubicacion: "CDMX", totalOrdenes: 64, totalUtilidad: 920000 },
  { id_cliente: "CLI006", nombre: "Maquiladora Delta SA", ubicacion: "Saltillo, COAH", totalOrdenes: 51, totalUtilidad: 740000 },
  { id_cliente: "CLI002", nombre: "Transportes del Norte SA", ubicacion: "Guadalajara, JAL", totalOrdenes: 43, totalUtilidad: 610000 },
  { id_cliente: "CLI007", nombre: "Exportaciones Sigma", ubicacion: "Tijuana, BC", totalOrdenes: 38, totalUtilidad: 530000 },
];

export const TOP_SALESREP: SalesRepResumen[] = [
  { id_usuario: "USR001", nombre: "Carlos Méndez", correo: "c.mendez@phiomega.mx", totalOrdenes: 94, totalUtilidad: 1380000 },
  { id_usuario: "USR002", nombre: "Ana Rodríguez", correo: "a.rodriguez@phiomega.mx", totalOrdenes: 78, totalUtilidad: 1090000 },
  { id_usuario: "USR006", nombre: "Sofía López", correo: "s.lopez@phiomega.mx", totalOrdenes: 61, totalUtilidad: 870000 },
  { id_usuario: "USR003", nombre: "Luis Torres", correo: "l.torres@phiomega.mx", totalOrdenes: 49, totalUtilidad: 680000 },
];

// ============================================
// DATOS PARA PÁGINA 2 — SHIPMENTS
// ============================================

export const SHIPMENTS: ShipmentResumen[] = [
  { id_transaccion: "SHP-2025-001", fecha: "2025-01-08", origen: "Monterrey, NL", destino: "Laredo, TX", estatus: "Entregado", estatusId: 4, venta_mxn: 45000, cliente: "Grupo Industrial Alfa", sales_rep: "Carlos Méndez" },
  { id_transaccion: "SHP-2025-002", fecha: "2025-01-12", origen: "Guadalajara, JAL", destino: "El Paso, TX", estatus: "En tránsito", estatusId: 2, venta_mxn: 32000, cliente: "Logística Premium MX", sales_rep: "Ana Rodríguez" },
  { id_transaccion: "SHP-2025-003", fecha: "2025-01-15", origen: "CDMX", destino: "Monterrey, NL", estatus: "Activo", estatusId: 1, venta_mxn: 28000, cliente: "Maquiladora Delta SA", sales_rep: "Sofía López" },
  { id_transaccion: "SHP-2025-004", fecha: "2025-01-18", origen: "Saltillo, COAH", destino: "San Antonio, TX", estatus: "En aduana", estatusId: 3, venta_mxn: 67000, cliente: "Transportes del Norte SA", sales_rep: "Carlos Méndez" },
  { id_transaccion: "SHP-2025-005", fecha: "2025-01-20", origen: "Tijuana, BC", destino: "El Paso, TX", estatus: "En espera", estatusId: 6, venta_mxn: 19500, cliente: "Exportaciones Sigma", sales_rep: "Luis Torres" },
  { id_transaccion: "SHP-2025-006", fecha: "2025-01-22", origen: "Monterrey, NL", destino: "Laredo, TX", estatus: "Activo", estatusId: 1, venta_mxn: 54000, cliente: "Grupo Industrial Alfa", sales_rep: "Ana Rodríguez" },
  { id_transaccion: "SHP-2025-007", fecha: "2025-01-24", origen: "Guadalajara, JAL", destino: "Monterrey, NL", estatus: "Cancelado", estatusId: 5, venta_mxn: 0, cliente: "Comercializadora Beta", sales_rep: "Sofía López" },
  { id_transaccion: "SHP-2025-008", fecha: "2025-01-26", origen: "CDMX", destino: "Laredo, TX", estatus: "En tránsito", estatusId: 2, venta_mxn: 88000, cliente: "Distribuidora Omega", sales_rep: "Carlos Méndez" },
];

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

export function formatMXN(valor: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);
}

export function formatMXNCorto(valor: number): string {
  if (valor >= 1_000_000) {
    return `$${(valor / 1_000_000).toFixed(1)}M`;
  }
  if (valor >= 1_000) {
    return `$${(valor / 1_000).toFixed(0)}K`;
  }
  return `$${valor}`;
}

export const COLOR_ESTATUS: Record<number, string> = {
  1: "bg-blue-100 text-blue-800 border-blue-200",
  2: "bg-amber-100 text-amber-800 border-amber-200",
  3: "bg-orange-100 text-orange-800 border-orange-200",
  4: "bg-green-100 text-green-800 border-green-200",
  5: "bg-red-100 text-red-800 border-red-200",
  6: "bg-gray-100 text-gray-800 border-gray-200",
};
