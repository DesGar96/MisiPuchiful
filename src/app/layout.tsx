import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import MenuPrincipal from "@/components/MenuPrincipal";
import PiePagina from "@/components/PiePagina";
import { AuthProvider } from "@/context/AuthContext";
import { CarritoProvider } from "@/context/CarritoContext";
import CarritoModal from "@/components/Carrito/CarritoModal";

export const metadata: Metadata = {
  title: "Misipuchiful - Tienda de mascotas",
  description: "Cuidando a tus peludos con amor y dedicación",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <CarritoProvider>
            <div className="d-flex flex-column min-vh-100">
              <MenuPrincipal />
              <main className="flex-grow-1">
                {children}
              </main>
              <PiePagina />
            </div>
            <CarritoModal />
          </CarritoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}