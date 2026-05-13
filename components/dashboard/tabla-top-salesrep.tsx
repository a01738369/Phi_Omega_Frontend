import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TOP_SALESREP, formatMXN } from "@/lib/mock-data";
import { IconMail } from "@tabler/icons-react";

export function TablaTopSalesRep() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Rep — Mayor Utilidad</CardTitle>
        <CardDescription>Top 4 del periodo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {TOP_SALESREP.map((rep, i) => (
            <div
              key={rep.id_usuario}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div className="flex items-center gap-3">
                {/* Avatar con iniciales */}
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">
                    {rep.nombre
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium leading-tight">{rep.nombre}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <IconMail size={11} />
                    {rep.correo}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <p className="text-sm font-semibold text-green-600">
                  {formatMXN(rep.totalUtilidad)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {rep.totalOrdenes} órdenes
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
