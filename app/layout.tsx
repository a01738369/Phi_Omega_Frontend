import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { ThemeProvider } from "@/components/layout/theme-provider";

export const metadata: Metadata = {
  title: "VAX Solutions — Dashboard",
  description: "Panel de control de operaciones y logística transfronteriza",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="flex h-screen overflow-hidden antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="p-6 min-h-full">{children}</div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
