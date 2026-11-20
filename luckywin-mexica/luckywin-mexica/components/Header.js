"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "../lib/LanguageContext";
import { useAuth } from "../lib/AuthContext";

export default function Header() {
  const { t, lang, setLang } = useLanguage();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";

  async function handleLogout() {
    setMenuOpen(false);
    await signOut();
    router.push("/");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/jugar", label: t("nav.play") },
    { href: "/ganadores", label: t("nav.winners") },
    { href: "/terminos", label: t("nav.terms") },
    { href: "/privacidad", label: t("nav.privacy") },
  ];

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {!isHome && (
            <button
              onClick={() => router.back()}
              aria-label={t("nav.back")}
              className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/15 text-neutral-300 hover:text-white hover:border-white/30 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          <Link href="/" className="flex items-center gap-2 shrink-0 min-w-0">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight truncate">
              <span className="text-white">Lucky</span>
              <span className="text-gradient-gold">Win</span>{" "}
              <span className="text-mxgreen">M</span>
              <span className="text-white">exica</span>
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-300">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white transition">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-white/15 overflow-hidden text-xs font-semibold shrink-0">
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
              {t("nav.logout")}
            </button>
          ) : (
            <Link
              href="/registro"
              className="hidden sm:inline-flex items-center rounded-full bg-mxgreen hover:bg-mxgreen/90 transition px-4 py-2 text-sm font-semibold"
            >
              {t("nav.register")}
            </Link>
          )}

          <button
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={t("nav.menu")}
            aria-expanded={menuOpen}
            className="md:hidden shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/15 text-neutral-200 hover:border-white/30 transition"
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-neutral-950">
          <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col gap-1 text-sm font-medium text-neutral-300">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="py-2.5 px-2 rounded-lg hover:bg-white/5 hover:text-white transition"
              >
                {link.label}
              </Link>
            ))}

            <div className="h-px bg-white/10 my-2" />

            {user ? (
              <button
                onClick={handleLogout}
                className="py-2.5 px-2 rounded-lg text-left hover:bg-white/5 hover:text-white transition"
              >
                {t("nav.logout")}
              </button>
            ) : (
              <>
                <Link
                  href="/iniciar-sesion"
                  onClick={closeMenu}
                  className="py-2.5 px-2 rounded-lg hover:bg-white/5 hover:text-white transition"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/registro"
                  onClick={closeMenu}
                  className="mt-1 inline-flex items-center justify-center rounded-full bg-mxgreen hover:bg-mxgreen/90 transition px-4 py-2.5 text-sm font-semibold"
                >
                  {t("nav.register")}
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
