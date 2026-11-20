"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "../../../lib/LanguageContext";
import { apiFetch } from "../../../lib/api";
import { getWhatsAppLink } from "../../../lib/config";
import ScratchCard from "../../../components/ScratchCard";
import Confetti from "../../../components/Confetti";

// Reveal page for an admin-issued AwardedLink (see awardedLinkService.js
// on the backend). This is for REAL winners of a qualifying round run
// outside this website. Per spec, every link always awards exactly 3
// prizes together (1 random cash tier + laptop + iPhone 17 Pro) —
// nothing is created or revealed until the real recipient types their
// own name below. No login/signup required.
//
// Flow: check token -> ask for name -> claim (creates 3 real Winner
// rows server-side) -> congratulate by name -> single scratch card
// reveals all 3 prizes together -> Accept -> guided to WhatsApp.
export default function AwardedLinkPage() {
  const { t } = useLanguage();
  const { token } = useParams();

  // checking | invalid | enter-name | scratch | accept-pending | accepted
  const [stage, setStage] = useState("checking");
  const [invalidReason, setInvalidReason] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [claim, setClaim] = useState(null); // { fullName, claimDeadline, prizes: [{winnerId, prizeTierKey, prizeTierLabel}, ...] }
  const [confettiBurst, setConfettiBurst] = useState(0); // bump this number to fire a new confetti burst

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
        setConfettiBurst((n) => n + 1);
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
      await apiFetch(`/awarded/accept`, {
        method: "POST",
        body: { winnerIds: claim.prizes.map((p) => p.winnerId) },
      });
    } catch (err) {
      // Non-fatal — still let them continue to WhatsApp even if this
      // status update fails, so a transient error never blocks a real
      // winner from claiming their prizes.
      console.error(err);
    }
    setStage("accepted");
  }

  const whatsappMsg = useMemo(() => {
    if (!claim) return "";
    const prizeList = claim.prizes.map((p) => p.prizeTierLabel).join(", ");
    return `Hola, gané ${prizeList} en LuckyWin Mexica. Mi nombre es ${claim.fullName}.`;
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
      {confettiBurst > 0 && <Confetti trigger={confettiBurst} />}

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
            prizeLabels={claim.prizes.map((p) => p.prizeTierLabel)}
            onFullyRevealed={() => {
              setStage("accept-pending");
              setConfettiBurst((n) => n + 1);
            }}
          />
        </div>
      )}

      {stage === "accept-pending" && claim && (
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold text-gold">
            🎉 {t("awarded.congratsName", { name: claim.fullName })} 🎉
          </h1>
          <div className="rounded-2xl border border-gold/40 bg-neutral-900/70 p-6 space-y-3">
            <p className="text-xs uppercase tracking-wide text-neutral-400">
              {t("awarded.prizeLabel")}
            </p>
            <ul className="space-y-1">
              {claim.prizes.map((p) => (
                <li key={p.winnerId} className="text-xl font-extrabold text-gold">
                  {p.prizeTierLabel}
                </li>
              ))}
            </ul>
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
