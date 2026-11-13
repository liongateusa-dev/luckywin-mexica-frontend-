"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "../../lib/LanguageContext";
import { useAuth } from "../../lib/AuthContext";
import { apiFetch } from "../../lib/api";

// Signup is a two-step flow:
//   1. Create the Supabase Auth account (email + password) — this sends
//      a confirmation email via Supabase.
//   2. Once logged in (immediately, or after confirming email depending
//      on your Supabase project's settings), collect the remaining
//      profile fields (name, phone, age/terms) and create the linked
//      Entrant record on the backend.
export default function RegisterPage() {
  const { t } = useLanguage();
  const { signUp, signIn, getAccessToken } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState("account"); // account | profile | checkEmail
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    ageConfirm: false,
    termsAgree: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validateAccountStep() {
    const e = {};
    if (!form.email.trim()) e.email = t("register.errorRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t("register.errorEmail");
    if (!form.password || form.password.length < 8) {
      e.password = "Mínimo 8 caracteres / Minimum 8 characters";
    }
    return e;
  }

  function validateProfileStep() {
    const e = {};
    if (!form.fullName.trim()) e.fullName = t("register.errorRequired");
    if (!form.phone.trim()) e.phone = t("register.errorRequired");
    if (!form.ageConfirm) e.ageConfirm = t("register.errorAge");
    if (!form.termsAgree) e.termsAgree = t("register.errorTerms");
    return e;
  }

  async function handleAccountSubmit(ev) {
    ev.preventDefault();
    const found = validateAccountStep();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    setServerError("");
    try {
      const { data, error } = await signUp(form.email, form.password);
      if (error) {
        setServerError(error.message);
        return;
      }
      // If email confirmation is required by your Supabase project
      // settings, there will be no active session yet.
      if (!data.session) {
        setStep("checkEmail");
        return;
      }
      setStep("profile");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleProfileSubmit(ev) {
    ev.preventDefault();
    const found = validateProfileStep();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    setServerError("");
    try {
      const accessToken = getAccessToken();
      await apiFetch("/me/profile", {
        accessToken,
        method: "POST",
        body: {
          fullName: form.fullName,
          phone: form.phone,
          ageConfirmed: form.ageConfirm,
          termsAccepted: form.termsAgree,
        },
      });
      router.push("/jugar");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "checkEmail") {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-3">
          Revisa tu correo / Check your email
        </h1>
        <p className="text-neutral-400">
          Te enviamos un enlace de confirmación. Una vez confirmado, inicia
          sesión para completar tu registro.
          <br />
          <br />
          We sent you a confirmation link. Once confirmed, log in to finish
          registration.
        </p>
        <Link href="/iniciar-sesion" className="inline-block mt-6 text-gold underline">
          Ir a iniciar sesión / Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold mb-1">{t("register.heading")}</h1>
      <p className="text-neutral-400 mb-8">{t("register.subheading")}</p>

      {step === "account" && (
        <form onSubmit={handleAccountSubmit} noValidate className="space-y-5">
          <Field
            label={t("register.email")}
            type="email"
            value={form.email}
            onChange={(v) => update("email", v)}
            error={errors.email}
          />
          <Field
            label="Contraseña / Password"
            type="password"
            value={form.password}
            onChange={(v) => update("password", v)}
            error={errors.password}
          />
          {serverError && <p className="text-mxred text-sm">{serverError}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-gradient-to-r from-gold to-goldlight text-black font-bold py-3.5 text-lg hover:scale-[1.01] transition disabled:opacity-60"
          >
            Continuar / Continue
          </button>
          <p className="text-sm text-neutral-400 text-center">
            ¿Ya tienes cuenta? / Already have an account?{" "}
            <Link href="/iniciar-sesion" className="text-gold underline">
              Inicia sesión / Log in
            </Link>
          </p>
        </form>
      )}

      {step === "profile" && (
        <form onSubmit={handleProfileSubmit} noValidate className="space-y-5">
          <Field
            label={t("register.fullName")}
            value={form.fullName}
            onChange={(v) => update("fullName", v)}
            error={errors.fullName}
          />
          <Field
            label={t("register.phone")}
            type="tel"
            value={form.phone}
            onChange={(v) => update("phone", v)}
            error={errors.phone}
          />

          <Checkbox
            checked={form.ageConfirm}
            onChange={(v) => update("ageConfirm", v)}
            error={errors.ageConfirm}
          >
            {t("register.ageConfirm")}
          </Checkbox>

          <Checkbox
            checked={form.termsAgree}
            onChange={(v) => update("termsAgree", v)}
            error={errors.termsAgree}
          >
            {t("register.termsAgree")}{" "}
            <Link href="/terminos" className="text-gold underline">
              {t("register.termsLink")}
            </Link>
          </Checkbox>

          {serverError && <p className="text-mxred text-sm">{serverError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-gradient-to-r from-gold to-goldlight text-black font-bold py-3.5 text-lg hover:scale-[1.01] transition disabled:opacity-60"
          >
            {t("register.submit")}
          </button>
        </form>
      )}
    </div>
  );
}

function Field({ label, type = "text", value, onChange, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg bg-neutral-900 border px-4 py-3 text-white outline-none transition focus:ring-2 focus:ring-gold/50 ${
          error ? "border-mxred" : "border-white/15"
        }`}
      />
      {error && <p className="text-mxred text-xs mt-1.5">{error}</p>}
    </div>
  );
}

function Checkbox({ checked, onChange, error, children }) {
  return (
    <div>
      <label className="flex items-start gap-3 text-sm text-neutral-300 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-white/30 bg-neutral-900 accent-mxgreen"
        />
        <span>{children}</span>
      </label>
      {error && <p className="text-mxred text-xs mt-1.5 ml-7">{error}</p>}
    </div>
  );
}
