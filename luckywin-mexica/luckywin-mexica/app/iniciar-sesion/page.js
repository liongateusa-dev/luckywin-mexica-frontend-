"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../lib/AuthContext";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const { signIn, session, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // If the user just clicked an email confirmation link, Supabase's client
  // auto-parses the token from the URL and creates a session before this
  // page even renders. Once that session shows up, send them on to /jugar
  // instead of leaving them staring at an empty login form.
  useEffect(() => {
    if (!loading && session) {
      router.replace("/jugar");
    }
  }, [loading, session, router]);

  const justConfirmed =
    typeof window !== "undefined" &&
    (window.location.hash.includes("access_token") ||
      searchParams.get("type") === "signup");

  async function handleSubmit(ev) {
    ev.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(signInError.message);
        return;
      }
      router.push("/jugar");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold mb-1">Iniciar sesión</h1>
      <p className="text-neutral-400 mb-8">Log in to play this cycle.</p>

      {justConfirmed && !session && (
        <p className="mb-6 text-sm text-green-400 bg-green-900/20 border border-green-500/30 rounded-lg px-4 py-3">
          ✅ Correo confirmado / Email confirmed — redirecting you now, or log in below.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1.5">
            Correo electrónico / Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg bg-neutral-900 border border-white/15 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1.5">
            Contraseña / Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg bg-neutral-900 border border-white/15 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>

        {error && <p className="text-mxred text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-gradient-to-r from-gold to-goldlight text-black font-bold py-3.5 text-lg hover:scale-[1.01] transition disabled:opacity-60"
        >
          Entrar / Log in
        </button>

        <p className="text-sm text-neutral-400 text-center">
          ¿No tienes cuenta? / Don&apos;t have an account?{" "}
          <Link href="/registro" className="text-gold underline">
            Regístrate / Register
          </Link>
        </p>
      </form>
    </div>
  );
}
