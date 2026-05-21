"use client";
import { useFiltros } from "@/hooks/use-filtros";
import { FiltrosBar } from "@/components/dashboard/filtros-bar";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { GraficaHistorico } from "@/components/dashboard/grafica-historico";
import { GraficaEstatus } from "@/components/dashboard/grafica-estatus";
import { GraficaClientes } from "@/components/dashboard/grafica-clientes";
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
          Resumen general de operaciones —{" "}
          <span className="font-semibold" style={{ color: "#523d72" }}>
            VAX Solutions
          </span>
        </p>
      </div>

      {/* Filtros */}
      <FiltrosBar
        filtros={filtros}
        onCambiar={actualizarFiltro}
        onLimpiar={limpiarFiltros}
      />

      {/* KPI Cards — colores VAX */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          titulo="Total Clientes"
          valor={KPI_DATA.totalClientes}
          icono={<IconUsers size={18} />}
          variacion={KPI_DATA.variacionClientes}
          acento="primario"
        />
        <KpiCard
          titulo="Envíos Activos"
          valor={KPI_DATA.shipmentsActivos}
          icono={<IconTruck size={18} />}
          variacion={KPI_DATA.variacionShipments}
          acento="amarillo"
        />
        <KpiCard
          titulo="Utilidades Totales"
          valor={formatMXNCorto(KPI_DATA.utilidadTotal)}
          icono={<IconCurrencyPeso size={18} />}
          variacion={KPI_DATA.variacionUtilidad}
          acento="verde"
        />
        <KpiCard
          titulo="Sales Reps Activos"
          valor={KPI_DATA.totalSalesRep}
          icono={<IconUserCheck size={18} />}
          descripcion="Con envíos asignados"
          acento="primario"
        />
      </div>

      {/* Fila 1: Gráfica histórica (span 2) */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <GraficaHistorico />
      </div>

      {/* Fila 2: Dona de estatus + Barras de clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <GraficaEstatus />
        <GraficaClientes />
      </div>

      {/* Fila 3: Top clientes lista + Top sales rep lista */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TablaTopClientes />
        <TablaTopSalesRep />
      </div>
    </div>
  );
}
