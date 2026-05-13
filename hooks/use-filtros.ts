"use client";
import { useState, useCallback } from "react";
import type { FiltrosGlobales } from "@/lib/types";

export function useFiltros() {
  const [filtros, setFiltros] = useState<FiltrosGlobales>({});

  const actualizarFiltro = useCallback(
    <K extends keyof FiltrosGlobales>(clave: K, valor: FiltrosGlobales[K]) => {
      setFiltros((prev) => ({ ...prev, [clave]: valor }));
    },
    []
  );

  const limpiarFiltros = useCallback(() => {
    setFiltros({});
  }, []);

  return { filtros, actualizarFiltro, limpiarFiltros };
}
