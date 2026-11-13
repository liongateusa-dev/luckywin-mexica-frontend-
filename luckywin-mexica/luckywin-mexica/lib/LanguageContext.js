"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import es from "../messages/es.json";
import en from "../messages/en.json";

const dictionaries = { es, en };

const LanguageContext = createContext(null);

function getFromPath(obj, path) {
  return path.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("es");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("lwm_lang") : null;
    if (stored === "en" || stored === "es") {
      setLang(stored);
    }
  }, []);

  const changeLang = useCallback((next) => {
    setLang(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("lwm_lang", next);
    }
  }, []);

  const t = useCallback(
    (key, vars) => {
      const dict = dictionaries[lang] || dictionaries.es;
      let str = getFromPath(dict, key);
      if (str === undefined) return key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(`{${k}}`, v);
        });
      }
      return str;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
