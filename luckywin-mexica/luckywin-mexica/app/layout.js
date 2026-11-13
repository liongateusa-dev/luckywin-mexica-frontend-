import "./globals.css";
import { LanguageProvider } from "../lib/LanguageContext";
import { AuthProvider } from "../lib/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

export const metadata = {
  title: "LuckyWin Mexica — Juega gratis. Gana en grande.",
  description:
    "Sorteo promocional 100% gratuito para México. Sin compra necesaria. Premios en efectivo, electrónicos y tarjetas de regalo.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-neutral-950 text-white font-display min-h-screen flex flex-col">
        <LanguageProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppButton />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
