import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopBanner from "./components/TopBanner";
import { CartProvider } from "./components/CartProvider";
import Providers from "./components/Providers";
import CartFloat from "./components/CartFloat";
import CartIndicator from "./components/CartIndicator";
import ThemeToggle from "./components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Rodriguez Home",
    template: "%s — Rodriguez",
  },
  description: "Tienda moderna con diseño premium y experiencia de compra optimizada.",
  icons: { icon: "/favicon.ico" },
  keywords: ["muebles", "tienda", "ecommerce", "diseño", "premium"],
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          <Providers>
            <TopBanner />

            {/* Header principal */}
            <header className="header-blur">
              <div className="container flex items-center justify-between h-16">
                <a href="/" className="inline-flex items-center gap-2 font-bold">
                  <img src="/globe.svg" alt="Rodriguez" className="h-6 w-6" />
                  <span>Rodriguez</span>
                </a>

                <nav className="hidden md:flex items-center gap-6 text-sm">
                  <a href="/products" className="hover:opacity-90">Productos</a>
                  <a href="/checkout/summary" className="hover:opacity-90">Resumen</a>
                  <a href="/welcome" className="hover:opacity-90">Nosotros</a>
                </nav>

                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <a href="/login" className="btn btn-ghost h-9">Entrar</a>
                  <a href="/register" className="btn btn-primary h-9">Crear cuenta</a>
                </div>
              </div>
            </header>

            {/* Indicador de carrito SSR */}
            <CartIndicator />

            {/* Contenido principal */}
            <main className="container section">
              {children}
            </main>

            {/* Flotante de carrito */}
            <CartFloat />

            {/* Footer */}
            <footer className="footer section">
              <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <div className="inline-flex items-center gap-2 font-bold mb-2">
                    <img src="/globe.svg" alt="Rodriguez" className="h-6 w-6" />
                    <span>Rodriguez</span>
                  </div>
                  <p className="small">Diseño cuidado, materiales de calidad y una experiencia de compra superior.</p>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold">Tienda</h4>
                  <ul className="space-y-1 small">
                    <li><a href="/products">Catálogo</a></li>
                    <li><a href="/checkout/summary">Carrito</a></li>
                    <li><a href="/welcome">Nosotros</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold">Soporte</h4>
                  <ul className="space-y-1 small">
                    <li><a href="/forgot-password">Olvidé mi contraseña</a></li>
                    <li><a href="/reset-password/test">Restablecer</a></li>
                    <li><a href="/login">Iniciar sesión</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold">Boletín</h4>
                  <p className="small mb-2">Recibe novedades y ofertas.</p>
                  <form className="flex gap-2">
                    <input className="input h-10" placeholder="tu@email.com" aria-label="Email" />
                    <button className="btn btn-primary h-10" type="button">Suscribirse</button>
                  </form>
                </div>
              </div>
              <div className="container small mt-6 opacity-70">© {new Date().getFullYear()} Rodriguez. Todos los derechos reservados.</div>
            </footer>
          </Providers>
        </CartProvider>
      </body>
    </html>
  );
}
