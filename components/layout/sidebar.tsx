"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconLayoutDashboard, IconTruck, IconBuildingWarehouse } from "@tabler/icons-react";

const LINKS = [
  { href: "/", label: "Inicio", icon: IconLayoutDashboard },
  { href: "/shipments", label: "Shipments", icon: IconTruck },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen border-r bg-card flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-5 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <IconBuildingWarehouse size={18} className="text-primary-foreground" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">Phi Omega</p>
            <p className="text-xs text-muted-foreground">Operaciones</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        <p className="text-xs font-semibold text-muted-foreground px-2 py-1 uppercase tracking-wider">
          Menú
        </p>
        {LINKS.map(({ href, label, icon: Icon }) => {
          const activo = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                activo
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer del sidebar */}
      <div className="p-4 border-t">
        <p className="text-xs text-muted-foreground text-center">
          Dashboard v1.0
        </p>
      </div>
    </aside>
  );
}
