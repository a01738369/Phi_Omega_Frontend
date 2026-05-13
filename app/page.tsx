"use client";
import { useFiltros } from "@/hooks/use-filtros";
import { FiltrosBar } from "@/components/dashboard/filtros-bar";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { GraficaHistorico } from "@/components/dashboard/grafica-historico";
import { TablaTopClientes } from "@/components/dashboard/tabla-top-clientes";
import { TablaTopSalesRep } from "@/components/dashboard/tabla-top-salesrep";
import { KPI_DATA, formatMXNCorto } from "@/lib/mock-data";
import {
  IconUsers,
  IconTruck,
  IconCurrencyPeso,
  IconUserCheck,
} from "@tabler/icons-react";

export default function PaginaInicio() {
  const { filtros, actualizarFiltro, limpiarFiltros } = useFiltros();

  return (
    <div>
      {/* Encabezado */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Panel de Control</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Resumen general de operaciones
        </p>
      </div>

      {/* Filtros */}
      <FiltrosBar
        filtros={filtros}
        onCambiar={actualizarFiltro}
        onLimpiar={limpiarFiltros}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          titulo="Total Clientes"
          valor={KPI_DATA.totalClientes}
          icono={<IconUsers size={20} />}
          variacion={KPI_DATA.variacionClientes}
          colorIcono="text-blue-500"
        />
        <KpiCard
          titulo="Shipments Activos"
          valor={KPI_DATA.shipmentsActivos}
          icono={<IconTruck size={20} />}
          variacion={KPI_DATA.variacionShipments}
          colorIcono="text-amber-500"
        />
        <KpiCard
          titulo="Utilidades Totales"
          valor={formatMXNCorto(KPI_DATA.utilidadTotal)}
          icono={<IconCurrencyPeso size={20} />}
          variacion={KPI_DATA.variacionUtilidad}
          colorIcono="text-green-500"
        />
        <KpiCard
          titulo="Sales Reps Activos"
          valor={KPI_DATA.totalSalesRep}
          icono={<IconUserCheck size={20} />}
          descripcion="Con shipments asignados"
          colorIcono="text-purple-500"
        />
      </div>

      {/* Gráfica histórica — ancho completo */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <GraficaHistorico />
      </div>

      {/* Tablas inferiores: Top Clientes + Top Sales Rep */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TablaTopClientes />
        <TablaTopSalesRep />
      </div>
    </div>
  );
}
