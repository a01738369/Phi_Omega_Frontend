import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { IconMail } from "@tabler/icons-react";
import { panelApi, type TopRepItem, type Period } from "@/lib/api";
import { formatMXN } from "@/lib/mock-data";

interface Props { period: Period }

export function TablaTopSalesRep({ period }: Props) {
  const [datos, setDatos] = useState<TopRepItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    panelApi.topReps(period)
      .then(setDatos)
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Rep — Mayor Utilidad</CardTitle>
        <CardDescription>Top 10 del periodo</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground text-sm">Cargando...</div>
        ) : (
          <div className="space-y-3">
            {datos.map((rep, i) => (
              <div key={rep.nombre}
                className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">
                      {rep.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-tight">{rep.nombre}</p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-sm font-semibold text-green-600">{formatMXN(rep.utilidad)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
