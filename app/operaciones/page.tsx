"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { TablaShipments } from "@/components/shipments/tabla-shipments";
import { TablaClientes } from "@/components/shipments/tabla-clientes";
import { TablaSalesRep } from "@/components/shipments/tabla-salesrep";
import { ModalShipment } from "@/components/shipments/modal-shipment";

export default function PaginaOperaciones() {
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <div>
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Operaciones</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Gestión de envíos, clientes y representantes
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setModalAbierto(true)}
          className="gap-1.5 shadow-sm"
        >
          <IconPlus size={15} />
          Nuevo Envío
        </Button>
      </div>

      {/* Tabla principal */}
      <div className="mb-6">
        <TablaShipments />
      </div>

      {/* Clientes + Sales Rep */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TablaClientes />
        <TablaSalesRep />
      </div>

      {/* Modal */}
      <ModalShipment
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
      />
    </div>
  );
}
