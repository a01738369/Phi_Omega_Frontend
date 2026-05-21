// ============================================
// TIPOS DEL MODELO DE DATOS — PHI OMEGA
// ============================================

export interface Cliente {
  id_cliente: string;
  Nombre: string;
}

export interface Proveedor {
  id_proveedor: string;
  nombre: string;
}

export interface Lugar {
  id_lugares: string;
  ciudad: string;
  estado: string;
  pais: string;
}

export interface Division {
  id_division: number;
  division: string;
}

export interface Rango {
  id_rango: number;
  rango: string;
}

export interface Flujo {
  id_flujo: number;
  flujo: string;
}

export interface EstatusItem {
  id_estatus: number;
  estatus: string;
}

export interface Usuario {
  id_usuarios: string;
  Nombre: string;
  correo: string;
  cargo: string;
}

export interface Transaccion {
  id_transaccion: string;
  link: string;
  id_cliente: string;
  id_proveedor: string;
  id_origen: string;
  id_destino: string;
  division: number;
  rango: number;
  flujo: number;
  estatus: number;
  venta_mxn: number;
  costo_mxn: number;
  utilidad_mxn: number;
  fecha_creacion: string;
  fecha_recoleccion: string;
  fecha_entrega: string;
  fecha_booked: string;
  fecha_dispatched: string;
  fecha_at_shipper: string;
  fecha_pickedup: string;
  fecha_at_border: string;
  fecha_in_transit: string;
  fecha_at_delivery: string;
  fecha_delivered: string;
  fecha_ready_invoice: string;
  fecha_factura: string;
  OTP: number;
  ODP: number;
  CXB: number;
  national: boolean;
  sales_rep: string;
  ops_rep: string;
  carrier_rep: string;
  Afterhours_rep: string;
  sales_lead: string;
  ops_lead: number;
}

export interface KPIData {
  totalClientes: number;
  shipmentsActivos: number;
  utilidadTotal: number;
  totalSalesRep: number;
  variacionClientes: number;
  variacionShipments: number;
  variacionUtilidad: number;
}

export interface DatoHistorico {
  mes: string;
  ordenes: number;
  utilidad: number;
}

export interface ClienteResumen {
  id_cliente: string;
  nombre: string;
  ubicacion: string;
  totalOrdenes: number;
  totalUtilidad: number;
}

export interface SalesRepResumen {
  id_usuario: string;
  nombre: string;
  correo: string;
  totalOrdenes: number;
  totalUtilidad: number;
}

export interface ShipmentResumen {
  id_transaccion: string;
  fecha: string;
  origen: string;
  destino: string;
  estatus: string;
  estatusId: number;
  venta_mxn: number;
  cliente: string;
  sales_rep: string;
}

export interface FiltrosGlobales {
  fechaInicio?: Date;
  fechaFin?: Date;
  estatus?: string;
  cliente?: string;
  salesRep?: string;
}

export interface NuevoShipment {
  id_cliente: string;
  sales_rep: string;
  id_origen: string;
  id_destino: string;
  fecha_inicio: Date | undefined;
  fecha_fin: Date | undefined;
  precio: number;
}

// ============================================
// TIPO NUEVO — Para registrar nuevos lugares
// desde el modal de agregar shipment
// ============================================

export interface NuevoLugar {
  ciudad: string;
  estado: string;
  pais: string;
}
