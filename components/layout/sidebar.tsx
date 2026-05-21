"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  IconLayoutDashboard,
  IconPackage,
  IconSun,
  IconMoon,
  IconTruck,
} from "@tabler/icons-react";

const LINKS = [
  { href: "/", label: "Panel General", icon: IconLayoutDashboard },
  { href: "/operaciones", label: "Operaciones", icon: IconPackage },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita hydration mismatch con el tema
  useEffect(() => setMounted(true), []);

  return (
    <aside
      className="w-56 min-h-screen flex flex-col shrink-0"
      style={{ background: "var(--sidebar)", borderRight: "1px solid var(--sidebar-border)" }}
    >
      {/* Logo VAX */}
      <div className="p-5 border-b" style={{ borderColor: "var(--sidebar-border)" }}>
        <div className="flex items-center gap-2.5">
          {/* Ícono VAX — camión transfronterizo */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "var(--sidebar-primary)" }}
          >
            <IconTruck size={19} style={{ color: "var(--sidebar-primary-foreground)" }} />
          </div>
          <div>
            <p
              className="font-bold text-sm leading-tight tracking-tight"
              style={{ color: "var(--sidebar-foreground)" }}
            >
              VAX Solutions
            </p>
            <p className="text-xs" style={{ color: "var(--sidebar-accent-foreground)", opacity: 0.7 }}>
              Operaciones
            </p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        <p
          className="text-xs font-semibold px-2 py-1 uppercase tracking-widest mb-1"
          style={{ color: "var(--sidebar-accent-foreground)", opacity: 0.5 }}
        >
          Menú
        </p>
        {LINKS.map(({ href, label, icon: Icon }) => {
          const activo = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
              style={
                activo
                  ? {
                      background: "var(--sidebar-primary)",
                      color: "var(--sidebar-primary-foreground)",
                    }
                  : {
                      color: "var(--sidebar-foreground)",
                      opacity: 0.75,
                    }
              }
              onMouseEnter={(e) => {
                if (!activo) {
                  (e.currentTarget as HTMLElement).style.background =
                    "var(--sidebar-accent)";
                  (e.currentTarget as HTMLElement).style.opacity = "1";
                }
              }}
              onMouseLeave={(e) => {
                if (!activo) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.opacity = "0.75";
                }
              }}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer: toggle dark/light */}
      <div className="p-4 border-t" style={{ borderColor: "var(--sidebar-border)" }}>
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150"
            style={{ color: "var(--sidebar-foreground)", opacity: 0.7 }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--sidebar-accent)";
              (e.currentTarget as HTMLElement).style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.opacity = "0.7";
            }}
          >
            {theme === "dark" ? (
              <>
                <IconSun size={16} />
                <span>Modo claro</span>
              </>
            ) : (
              <>
                <IconMoon size={16} />
                <span>Modo oscuro</span>
              </>
            )}
          </button>
        )}
        <p
          className="text-xs text-center mt-2"
          style={{ color: "var(--sidebar-accent-foreground)", opacity: 0.4 }}
        >
          VAX Dashboard v1.0
        </p>
      </div>
    </aside>
  );
}
