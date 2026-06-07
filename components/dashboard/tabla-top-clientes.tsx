import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { IconMapPin } from "@tabler/icons-react";
import { panelApi, type TopClienteOrdenesItem, type Period } from "@/lib/api";
import { formatMXN } from "@/lib/mock-data";

interface Props { period: Period }

export function TablaTopClientes({ period }: Props) {
  const [datos, setDatos] = useState<TopClienteOrdenesItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    panelApi.topClientesPorOrdenes(period)
      .then(setDatos)
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes con más Órdenes</CardTitle>
        <CardDescription>Top 10 del periodo</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground text-sm">Cargando...</div>
        ) : (
          <div className="space-y-3">
            {datos.map((cliente, i) => (
              <div key={cliente.cliente}
                className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    i === 0 ? "bg-amber-100 text-amber-700"
                    : i === 1 ? "bg-gray-100 text-gray-600"
                    : i === 2 ? "bg-orange-100 text-orange-700"
                    : "bg-muted text-muted-foreground"
                  }`}>
                    {i + 1}
                  </div>
                  <p className="text-sm font-medium leading-tight">{cliente.cliente}</p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-sm font-semibold">{cliente.total_orders} órdenes</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
