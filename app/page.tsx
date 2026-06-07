"use client";
import { useState, useEffect } from "react";
import { useFiltros } from "@/hooks/use-filtros";
import PeriodSelector from "@/components/dashboard/period-selector";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { GraficaHistorico } from "@/components/dashboard/grafica-historico";
import { GraficaEstatus } from "@/components/dashboard/grafica-estatus";
import { GraficaClientes } from "@/components/dashboard/grafica-clientes";
import { TablaTopClientes } from "@/components/dashboard/tabla-top-clientes";
import { TablaTopSalesRep } from "@/components/dashboard/tabla-top-salesrep";
import { formatMXNCorto } from "@/lib/mock-data";
import { panelApi, type KpiResponse, type Period } from "@/lib/api";
import {
  IconUsers,
  IconTruck,
  IconCurrencyPeso,
  IconUserCheck,
} from "@tabler/icons-react";

// Derives a Period string ("7d" | "30d" | "90d" | "1y") from the date range
// stored in filtros, falling back to "90d" when no range is set.
function derivePeriod(fechaInicio?: Date, fechaFin?: Date): Period {
  if (!fechaInicio || !fechaFin) return "90d";
  const days = Math.round(
    (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days <= 7)   return "7d";
  if (days <= 30)  return "30d";
  if (days <= 90)  return "90d";
  return "1y";
}

export default function PaginaInicio() {
  const { filtros, actualizarFiltro } = useFiltros();
  const [kpis, setKpis]       = useState<KpiResponse | null>(null);
  const [loadingKpis, setLoadingKpis] = useState(true);

  const period = derivePeriod(filtros.fechaInicio, filtros.fechaFin);

  useEffect(() => {
    setLoadingKpis(true);
    panelApi.kpis(period)
      .then(setKpis)
      .finally(() => setLoadingKpis(false));
  }, [period]);

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

      {/* Selector de período */}
      <PeriodSelector filtros={filtros} onCambiar={actualizarFiltro} />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          titulo="Total Clientes"
          valor={loadingKpis ? "…" : (kpis?.clientes ?? 0)}
          icono={<IconUsers size={18} />}
          variacion={kpis?.clientes_delta}
          acento="primario"
        />
        <KpiCard
          titulo="Envíos Entregados"
          valor={loadingKpis ? "…" : (kpis?.delivered_orders ?? 0)}
          icono={<IconTruck size={18} />}
          variacion={kpis?.deliveries_delta}
          acento="amarillo"
        />
        <KpiCard
          titulo="Utilidades Totales"
          valor={loadingKpis ? "…" : formatMXNCorto(kpis?.profit ?? 0)}
          icono={<IconCurrencyPeso size={18} />}
          variacion={kpis?.profit_delta}
          acento="verde"
        />
        <KpiCard
          titulo="Sales Reps Activos"
          valor={loadingKpis ? "…" : (kpis?.sales_reps ?? 0)}
          icono={<IconUserCheck size={18} />}
          descripcion="Con envíos asignados"
          variacion={kpis?.sales_reps_delta}
          acento="primario"
        />
      </div>

      {/* Fila 1: Gráfica histórica */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <GraficaHistorico />
      </div>

      {/* Fila 2: Dona de estatus + Barras de clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <GraficaEstatus period={period} />
        <GraficaClientes period={period} />
      </div>

      {/* Fila 3: Top clientes + Top sales rep */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TablaTopClientes period={period} />
        <TablaTopSalesRep period={period} />
      </div>
    </div>
  );
}
