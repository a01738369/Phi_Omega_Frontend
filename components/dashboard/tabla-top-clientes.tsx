import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TOP_CLIENTES, formatMXN } from "@/lib/mock-data";
import { IconMapPin } from "@tabler/icons-react";

export function TablaTopClientes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes con más Órdenes</CardTitle>
        <CardDescription>Top 5 del periodo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {TOP_CLIENTES.map((cliente, i) => (
            <div
              key={cliente.id_cliente}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div className="flex items-center gap-3">
                {/* Número de ranking */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    i === 0
                      ? "bg-amber-100 text-amber-700"
                      : i === 1
                        ? "bg-gray-100 text-gray-600"
                        : i === 2
                          ? "bg-orange-100 text-orange-700"
                          : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-medium leading-tight">
                    {cliente.nombre}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <IconMapPin size={11} />
                    {cliente.ubicacion}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <p className="text-sm font-semibold">{cliente.totalOrdenes} órdenes</p>
                <p className="text-xs text-muted-foreground">
                  {formatMXN(cliente.totalUtilidad)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
