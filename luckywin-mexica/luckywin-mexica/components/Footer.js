"use client";

import Link from "next/link";
import { useLanguage } from "../lib/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-neutral-950 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <span className="text-lg font-bold">
            <span className="text-white">Lucky</span>
            <span className="text-gradient-gold">Win</span>{" "}
            <span className="text-mxgreen">Mexica</span>
          </span>
          <div className="flex gap-5 text-sm text-neutral-400">
            <Link href="/terminos" className="hover:text-white transition">
              {t("nav.terms")}
            </Link>
            <Link href="/privacidad" className="hover:text-white transition">
              {t("nav.privacy")}
            </Link>
            <Link href="/ganadores" className="hover:text-white transition">
              {t("nav.winners")}
            </Link>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-neutral-500 max-w-3xl">
          {t("footer.noPurchaseNecessary")}
        </p>

        <p className="text-xs text-neutral-600 mt-4">
          © {year} LuckyWin Mexica. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
