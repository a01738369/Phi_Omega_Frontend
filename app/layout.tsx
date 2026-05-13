import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";

export const metadata: Metadata = {
  title: "Phi Omega — Dashboard",
  description: "Panel de control de operaciones y logística",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="flex h-screen overflow-hidden bg-muted/20 antialiased">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 min-h-full">{children}</div>
        </main>
      </body>
    </html>
  );
}
