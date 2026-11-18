"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "../../../lib/LanguageContext";
import { apiFetch } from "../../../lib/api";
import { getWhatsAppLink } from "../../../lib/config";
import ScratchCard from "../../../components/ScratchCard";

// Reveal page for an admin-issued AwardedLink (see awardedLinkService.js
// on the backend). This is for REAL winners of a qualifying round run
// outside this website — the admin picked only the prize tier when
// issuing the link; nothing is created or revealed until the real
// recipient types their own name below. No login/signup required.
//
// Flow: check token -> ask for name -> claim (creates the real Winner
// row server-side) -> congratulate by name -> scratch card reveal ->
// Accept -> guided to WhatsApp.
export default function AwardedLinkPage() {
  const { t } = useLanguage();
  const { token } = useParams();

  // checking | invalid | enter-name | revealing | scratch | accepted
  const [stage, setStage] = useState("checking");
  const [invalidReason, setInvalidReason] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [claim, setClaim] = useState(null); // { winnerId, fullName, prizeTierKey, prizeTierLabel, claimDeadline }

  useEffect(() => {
    if (!token) return;
    checkLink();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function checkLink() {
    try {
      const data = await apiFetch(`/awarded/${token}`);
      if (data.valid) {
        setStage("enter-name");
      } else {
        setInvalidReason(data.reason || "not_found");
        setStage("invalid");
      }
    } catch (err) {
      setInvalidReason("not_found");
      setStage("invalid");
    }
  }

  async function submitName(e) {
    e.preventDefault();
    if (!fullName.trim()) return;
    setSubmitting(true);
    setErrorMsg("");
    try {
      const data = await apiFetch(`/awarded/${token}/claim`, {
        method: "POST",
        body: { fullName: fullName.trim() },
      });
      setClaim(data);
      setStage("scratch");
    } catch (err) {
      if (err.data?.error === "already_used") {
        setInvalidReason("already_used");
        setStage("invalid");
      } else if (err.data?.error === "expired") {
        setInvalidReason("expired");
        setStage("invalid");
      } else {
        setErrorMsg(err.message || "Something went wrong.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAccept() {
    if (!claim) return;
    try {
      await apiFetch(`/awarded/winners/${claim.winnerId}/accept`);
    } catch (err) {
      // Non-fatal — still let them continue to WhatsApp even if this
      // status update fails, so a transient error never blocks a real
      // winner from claiming their prize.
      console.error(err);
    }
    setStage("accepted");
  }

  const whatsappMsg = useMemo(() => {
    if (!claim) return "";
    return `Hola, gané ${claim.prizeTierLabel} en LuckyWin Mexica. Mi nombre es ${claim.fullName}.`;
  }, [claim]);

  const claimDeadlineLabel = useMemo(() => {
    if (!claim?.claimDeadline) return "";
    return new Date(claim.claimDeadline).toLocaleDateString();
  }, [claim]);

  if (stage === "checking") {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-24 text-center">
        <div className="mx-auto w-12 h-12 rounded-full border-4 border-gold/30 border-t-gold animate-spin" />
      </div>
    );
  }

  if (stage === "invalid") {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="rounded-2xl border border-mxred/40 bg-mxred/10 p-6">
          <h1 className="text-xl font-bold mb-2">{t("awarded.invalidTitle")}</h1>
          <p className="text-neutral-300">
            {t(`awarded.invalidReason.${invalidReason}`)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16">
      {stage === "enter-name" && (
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold">{t("awarded.heading")}</h1>
          <p className="text-neutral-400">{t("awarded.subheading")}</p>
          <form onSubmit={submitName} className="space-y-4">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t("awarded.namePlaceholder")}
              required
              className="w-full rounded-xl border border-white/15 bg-neutral-900 px-4 py-3 text-center text-lg focus:outline-none focus:border-gold"
            />
            {errorMsg && <p className="text-sm text-mxred">{errorMsg}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-gradient-to-r from-gold to-goldlight text-black font-bold px-6 py-3 hover:scale-[1.02] transition disabled:opacity-60"
            >
              {submitting ? t("awarded.submitting") : t("awarded.revealButton")}
            </button>
          </form>
        </div>
      )}

      {stage === "scratch" && claim && (
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold text-gold">
            {t("awarded.congratsName", { name: claim.fullName })}
          </h1>
          <p className="text-neutral-400">{t("awarded.scratchHint")}</p>
          <ScratchCard
            prizeLabel={claim.prizeTierLabel}
            onFullyRevealed={() => setStage("accept-pending")}
          />
        </div>
      )}

      {stage === "accept-pending" && claim && (
        <div className="text-center space-y-6">
          <div className="rounded-2xl border border-gold/40 bg-neutral-900/70 p-6 space-y-3">
            <p className="text-xs uppercase tracking-wide text-neutral-400">
              {t("awarded.prizeLabel")}
            </p>
            <p className="text-2xl font-extrabold text-gold">{claim.prizeTierLabel}</p>
            <p className="text-sm text-neutral-400">
              {t("awarded.claimByLabel", { date: claimDeadlineLabel })}
            </p>
          </div>
          <button
            onClick={handleAccept}
            className="w-full rounded-full bg-gradient-to-r from-mxgreen to-emerald-400 text-black font-bold px-6 py-3 hover:scale-[1.02] transition"
          >
            {t("awarded.acceptButton")}
          </button>
        </div>
      )}

      {stage === "accepted" && claim && (
        <div className="text-center space-y-6">
          <div className="rounded-2xl border border-mxgreen/40 bg-mxgreen/10 p-6 space-y-4">
            <h2 className="text-xl font-bold text-mxgreen">{t("awarded.acceptedTitle")}</h2>
            <p className="text-neutral-200">{t("awarded.acceptedBody")}</p>
            <a
              href={getWhatsAppLink(whatsappMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-black font-bold px-6 py-3 hover:scale-[1.02] transition"
            >
              {t("awarded.contactWhatsapp")}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
