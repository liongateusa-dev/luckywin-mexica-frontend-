"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "../lib/LanguageContext";
import { useAuth } from "../lib/AuthContext";

export default function Header() {
  const { t, lang, setLang } = useLanguage();
  const { user, signOut } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight">
            <span className="text-white">Lucky</span>
            <span className="text-gradient-gold">Win</span>{" "}
            <span className="text-mxgreen">M</span>
            <span className="text-white">exica</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-300">
          <Link href="/" className="hover:text-white transition">
            {t("nav.home")}
          </Link>
          <Link href="/jugar" className="hover:text-white transition">
            {t("nav.play")}
          </Link>
          <Link href="/ganadores" className="hover:text-white transition">
            {t("nav.winners")}
          </Link>
          <Link href="/terminos" className="hover:text-white transition">
            {t("nav.terms")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-white/15 overflow-hidden text-xs font-semibold">
            <button
              onClick={() => setLang("es")}
              className={`px-2.5 py-1 transition ${
                lang === "es" ? "bg-gold text-black" : "text-neutral-300 hover:text-white"
              }`}
            >
              ES
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 transition ${
                lang === "en" ? "bg-gold text-black" : "text-neutral-300 hover:text-white"
              }`}
            >
              EN
            </button>
          </div>
          {user ? (
            <button
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center rounded-full border border-white/20 hover:border-white/40 transition px-4 py-2 text-sm font-semibold text-neutral-200"
            >
              Salir / Log out
            </button>
          ) : (
            <Link
              href="/registro"
              className="hidden sm:inline-flex items-center rounded-full bg-mxgreen hover:bg-mxgreen/90 transition px-4 py-2 text-sm font-semibold"
            >
              {t("nav.register")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
