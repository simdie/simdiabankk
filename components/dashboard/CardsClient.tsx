"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { CURRENCY_FLAGS } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CopyButton } from "@/components/ui/CopyButton";
import Select from "@/components/ui/Select";

interface VirtualCard {
  id: string; cardNumber: string; expiry: string; cvv: string;
  cardholderName: string; type: string; status: string; accountId: string;
  createdAt: Date;
}
interface Account { id: string; accountNumber: string; currency: string; cards: VirtualCard[] }

function CardVisual({ card, flipped, revealed }: { card: VirtualCard; flipped: boolean; revealed: boolean }) {
  const masked = `${card.cardNumber.slice(0,4)} •••• •••• ${card.cardNumber.slice(-4)}`;
  const isVisa = card.type === "VISA";
  const isFrozen = card.status === "FROZEN";

  const cardStyle: React.CSSProperties = {
    width: 320, height: 196,
    borderRadius: 18,
    padding: "22px 24px",
    position: "relative",
    transformStyle: "preserve-3d",
    transition: "transform 0.6s ease",
    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
    cursor: "pointer",
    boxShadow: isFrozen
      ? "0 0 30px rgba(100,180,255,0.2)"
      : isVisa
      ? "0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(0,212,255,0.1)"
      : "0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(240,180,41,0.1)",
  };

  const bgGradient = isFrozen
    ? "linear-gradient(135deg, #0a1f3a 0%, #0d2847 40%, #0f3060 100%)"
    : isVisa
    ? "linear-gradient(135deg, #0d1a30 0%, #122240 40%, #1a3057 100%)"
    : "linear-gradient(135deg, #1a0820 0%, #2d0f3a 40%, #3a1250 100%)";

  return (
    <div style={{ perspective: 1000, width: 320, height: 196 }}>
      <div style={cardStyle}>
        {/* FRONT */}
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", borderRadius: 18, background: bgGradient, border: `1px solid ${isFrozen ? "rgba(100,200,255,0.3)" : isVisa ? "rgba(0,212,255,0.2)" : "rgba(240,180,41,0.2)"}`, padding: "22px 24px" }}>
          {/* Frozen overlay */}
          {isFrozen && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(100,180,255,0.06)", backdropFilter: "blur(1px)", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
              <div style={{ fontSize: 48, opacity: 0.4 }}>❄</div>
            </div>
          )}
          {/* Shimmer */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.04) 50%, transparent 65%)", backgroundSize: "200% 100%", animation: "shimmer 3s linear infinite", borderRadius: 18 }} />
          {/* Circle decorations */}
          <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: `rgba(${isVisa ? "0,212,255" : "240,180,41"},0.05)`, border: `1px solid rgba(${isVisa ? "0,212,255" : "240,180,41"},0.08)` }} />
          <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: `rgba(${isVisa ? "0,212,255" : "240,180,41"},0.04)` }} />

          {/* Top row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 2 }}>
            <div style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 13, color: isVisa ? "var(--color-accent)" : "var(--color-gold)", letterSpacing: 0.5 }}>BANK OF ASIA</div>
            {isFrozen && <span style={{ fontSize: 11, fontWeight: 700, color: "#64b4ff", background: "rgba(100,180,255,0.1)", border: "1px solid rgba(100,180,255,0.3)", padding: "2px 7px", borderRadius: 999 }}>FROZEN</span>}
          </div>

          {/* Chip */}
          <div style={{ marginTop: 14, position: "relative", zIndex: 2 }}>
            <div style={{ width: 34, height: 26, borderRadius: 4, background: "linear-gradient(135deg, #d4a843, #f0c060, #b8901e)", border: "1px solid rgba(255,255,255,0.15)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, padding: 4 }}>
              {[...Array(4)].map((_, i) => <div key={i} style={{ background: "rgba(160,110,10,0.6)", borderRadius: 1 }} />)}
            </div>
          </div>

          {/* Card number */}
          <div style={{ marginTop: 10, fontFamily: "var(--font-jetbrains-mono)", fontSize: 14, color: revealed ? "var(--color-text-primary)" : "rgba(240,244,255,0.55)", letterSpacing: 2.5, position: "relative", zIndex: 2 }}>
            {revealed ? `${card.cardNumber.slice(0,4)} ${card.cardNumber.slice(4,8)} ${card.cardNumber.slice(8,12)} ${card.cardNumber.slice(12)}` : masked}
          </div>

          {/* Bottom */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 10, position: "relative", zIndex: 2 }}>
            <div>
              <div style={{ fontSize: 8, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Cardholder</div>
              <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 12, fontWeight: 600, color: "var(--color-text-primary)", letterSpacing: 1, textTransform: "uppercase" }}>
                {card.cardholderName}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 8, color: "var(--color-text-muted)", marginBottom: 2 }}>EXPIRES</div>
              <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 12, fontWeight: 600, color: "var(--color-text-primary)" }}>{card.expiry}</div>
            </div>
            {/* Card network logo */}
            {isVisa ? (
              <svg viewBox="0 0 73 23" width="50" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.85 }}>
                <path d="M28.5 22.5H23L26.5 0.5H32L28.5 22.5Z" fill="white"/>
                <path d="M45.5 1C44.2 0.5 42.1 0 39.5 0C34.1 0 30.2 2.9 30.2 7.1C30.2 10.2 33 12 35.1 13.1C37.2 14.2 37.9 15 37.9 16C37.9 17.5 36 18.4 34.3 18.4C31.9 18.4 30.6 18 28.7 17.2L28 16.9L27.2 21.6C28.7 22.3 31.5 22.9 34.4 23C40.2 23 44 20.1 44 15.6C44 13 42.4 11 38.9 9.4C37.1 8.4 35.9 7.7 35.9 6.6C35.9 5.6 37 4.6 39.2 4.6C41 4.6 42.3 5 43.3 5.4L43.8 5.7L44.6 1.2L45.5 1Z" fill="white"/>
                <path d="M55.8 0.5H51.5C50.2 0.5 49.2 0.9 48.7 2.2L40.5 22.5H46.3L47.4 19.4H54.3L54.9 22.5H60.1L55.8 0.5ZM49 15.2C49.4 14.1 51.4 8.5 51.4 8.5C51.4 8.5 51.9 7.1 52.2 6.2L52.6 8.3C52.6 8.3 53.8 14.1 54.1 15.2H49Z" fill="white"/>
                <path d="M21 0.5L15.7 15.7L15.1 12.5C14.1 9.3 11.1 5.8 7.8 4L12.8 22.5H18.7L27.5 0.5H21Z" fill="white"/>
                <path d="M11 0.5H1.9L1.8 1C8.5 2.7 13.1 6.9 15.1 12.5L13 2.2C12.6 1 11.9 0.5 11 0.5Z" fill="#F9A31B"/>
              </svg>
            ) : (
              <div style={{ display: "flex", gap: -6 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(220,50,50,0.7)" }} />
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(240,160,0,0.7)", marginLeft: -10 }} />
              </div>
            )}
          </div>
        </div>

        {/* BACK — rotateY(180deg) in default state so content reads correctly when card is flipped */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          borderRadius: 18, background: bgGradient,
          border: `1px solid ${isVisa ? "rgba(0,212,255,0.2)" : "rgba(240,180,41,0.2)"}`,
          overflow: "hidden",
        }}>
          {/* Magnetic stripe */}
          <div style={{ height: 46, background: "linear-gradient(90deg, #0a0a0a, #1a1a1a, #0a0a0a)", marginTop: 22, width: "100%" }} />

          {/* Signature strip + CVV */}
          <div style={{ padding: "10px 20px 12px" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 5, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              AUTHORIZED SIGNATURE
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                flex: 1, height: 34, background: "rgba(255,255,255,0.92)",
                borderRadius: 3, padding: "0 10px",
                display: "flex", alignItems: "center",
                backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0px, transparent 1px, transparent 4px)",
              }}>
                <span style={{ fontSize: 11, color: "rgba(0,0,0,0.25)", fontStyle: "italic" }}>
                  {card.cardholderName}
                </span>
              </div>
              <div style={{ flexShrink: 0 }}>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", marginBottom: 2, textAlign: "center", letterSpacing: "0.08em" }}>CVV</div>
                <div style={{
                  background: "rgba(255,255,255,0.95)", borderRadius: 4, padding: "5px 12px",
                  fontFamily: "var(--font-jetbrains-mono, monospace)", fontSize: 16, fontWeight: 900, color: "#000",
                  letterSpacing: 4, minWidth: 52, textAlign: "center",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.15)",
                }}>
                  {(revealed || flipped) ? (card.cvv || "—") : "•••"}
                </div>
              </div>
            </div>
          </div>

          {/* Card network bottom right */}
          <div style={{ position: "absolute", bottom: 16, right: 18 }}>
            {isVisa ? (
              <svg viewBox="0 0 73 23" width="44" height="14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.7 }}>
                <path d="M28.5 22.5H23L26.5 0.5H32L28.5 22.5Z" fill="white"/>
                <path d="M45.5 1C44.2 0.5 42.1 0 39.5 0C34.1 0 30.2 2.9 30.2 7.1C30.2 10.2 33 12 35.1 13.1C37.2 14.2 37.9 15 37.9 16C37.9 17.5 36 18.4 34.3 18.4C31.9 18.4 30.6 18 28.7 17.2L28 16.9L27.2 21.6C28.7 22.3 31.5 22.9 34.4 23C40.2 23 44 20.1 44 15.6C44 13 42.4 11 38.9 9.4C37.1 8.4 35.9 7.7 35.9 6.6C35.9 5.6 37 4.6 39.2 4.6C41 4.6 42.3 5 43.3 5.4L43.8 5.7L44.6 1.2L45.5 1Z" fill="white"/>
                <path d="M55.8 0.5H51.5C50.2 0.5 49.2 0.9 48.7 2.2L40.5 22.5H46.3L47.4 19.4H54.3L54.9 22.5H60.1L55.8 0.5ZM49 15.2C49.4 14.1 51.4 8.5 51.4 8.5C51.4 8.5 51.9 7.1 52.2 6.2L52.6 8.3C52.6 8.3 53.8 14.1 54.1 15.2H49Z" fill="white"/>
                <path d="M21 0.5L15.7 15.7L15.1 12.5C14.1 9.3 11.1 5.8 7.8 4L12.8 22.5H18.7L27.5 0.5H21Z" fill="white"/>
                <path d="M11 0.5H1.9L1.8 1C8.5 2.7 13.1 6.9 15.1 12.5L13 2.2C12.6 1 11.9 0.5 11 0.5Z" fill="#F9A31B"/>
              </svg>
            ) : (
              <div style={{ display: "flex" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(220,50,50,0.7)" }} />
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(240,160,0,0.7)", marginLeft: -8 }} />
              </div>
            )}
          </div>

          <p style={{ padding: "0 20px", fontSize: 9, color: "rgba(255,255,255,0.2)", lineHeight: 1.5 }}>
            Card issued by Bank of Asia Online. Unauthorized use prohibited. Contact support for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CardsClient({ accounts }: { accounts: Account[] }) {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [newCard, setNewCard] = useState<{ accountId: string; type: "VISA" | "MASTERCARD" } | null>(null);
  const [cards, setCards] = useState<VirtualCard[]>(accounts.flatMap((a) => a.cards));
  const [error, setError] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState("");

  async function handleCardAction(cardId: string, action: "freeze" | "unfreeze" | "cancel") {
    setActionLoading((p) => ({ ...p, [cardId]: true }));
    try {
      const res = await fetch(`/api/accounts/cards/${cardId}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) { setError((p) => ({ ...p, [cardId]: data.error })); return; }
      setCards((prev) => prev.map((c) => c.id === cardId ? { ...c, status: data.card.status } : c));
      setSuccessMsg(`Card ${action}d successfully`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } finally {
      setActionLoading((p) => ({ ...p, [cardId]: false }));
    }
  }

  async function handleGenerateCard() {
    if (!newCard) return;
    setGenerating((p) => ({ ...p, [newCard.accountId]: true }));
    try {
      const res = await fetch("/api/accounts/create-card", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCard),
      });
      const data = await res.json();
      if (!res.ok) { setError((p) => ({ ...p, generate: data.error })); return; }
      setCards((prev) => [data.card, ...prev]);
      setNewCard(null);
      setSuccessMsg("New card generated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } finally {
      setGenerating((p) => ({ ...p, [newCard!.accountId]: false }));
    }
  }

  const allCards = cards;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-syne)", fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>Virtual Cards</h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>{allCards.length} card{allCards.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setNewCard({ accountId: accounts[0]?.id ?? "", type: "VISA" })} className="btn-nexus" style={{ padding: "9px 20px" }}>
          + Generate Card
        </button>
      </div>

      {successMsg && (
        <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.2)", color: "var(--color-success)", fontSize: 13 }}>
          ✓ {successMsg}
        </div>
      )}

      {/* Generate card panel */}
      {newCard && (
        <div className="glass-card-accent animate-fade-slide-up" style={{ padding: "28px 32px" }}>
          <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 16, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 20 }}>Generate New Card</h3>
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260, display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Account</label>
                <Select
                  options={accounts.map((a) => ({
                    value: a.id,
                    label: `${a.currency} — ••••${a.accountNumber.slice(-4)}`,
                    flag: CURRENCY_FLAGS[a.currency],
                  }))}
                  value={newCard.accountId}
                  onChange={(v) => setNewCard((p) => p ? { ...p, accountId: v } : null)}
                />
              </div>
              <div>
                <label style={labelStyle}>Card Network</label>
                <div style={{ display: "flex", gap: 10 }}>
                  {(["VISA", "MASTERCARD"] as const).map((t) => (
                    <button key={t} onClick={() => setNewCard((p) => p ? { ...p, type: t } : null)} style={{
                      flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer",
                      background: newCard.type === t ? "rgba(0,212,255,0.08)" : "rgba(6,12,24,0.6)",
                      border: `1.5px solid ${newCard.type === t ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.07)"}`,
                      color: newCard.type === t ? "var(--color-accent)" : "var(--color-text-muted)",
                      fontWeight: 700, fontSize: 14,
                    }}>
                      {t === "VISA" ? "VISA" : "Mastercard"}
                    </button>
                  ))}
                </div>
              </div>
              {error.generate && <div style={{ fontSize: 13, color: "var(--color-danger)" }}>{error.generate}</div>}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setNewCard(null)} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
                <button onClick={handleGenerateCard} className="btn-nexus" style={{ flex: 1 }} disabled={generating[newCard.accountId]}>
                  {generating[newCard.accountId] ? "Generating…" : "Generate Card"}
                </button>
              </div>
            </div>
            {/* Live preview */}
            <div style={{ animation: "float 6s ease-in-out infinite" }}>
              <CardVisual
                card={{ id: "preview", cardNumber: "0000000000000000", expiry: "MM/YY", cvv: "•••", cardholderName: "CARDHOLDER NAME", type: newCard.type, status: "ACTIVE", accountId: newCard.accountId, createdAt: new Date() }}
                flipped={false}
                revealed={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Cards grid */}
      {allCards.length === 0 ? (
        <div className="glass-card" style={{ padding: 48, textAlign: "center", color: "var(--color-text-muted)" }}>
          No cards yet. Generate your first virtual card.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 24 }}>
          {allCards.map((card) => (
            <div key={card.id} className="glass-card animate-fade-slide-up" style={{ padding: "24px" }}>
              {/* 3D Card */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }} onClick={() => setFlipped((p) => ({ ...p, [card.id]: !p[card.id] }))}>
                <CardVisual card={card} flipped={!!flipped[card.id]} revealed={!!revealed[card.id]} />
              </div>

              {/* Card info */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "var(--color-text-primary)" }}>{card.type} Virtual Card</span>
                  <StatusBadge value={card.status} />
                </div>
                <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 12, color: "var(--color-text-muted)" }}>
                  {revealed[card.id]
                    ? `${card.cardNumber.slice(0,4)} ${card.cardNumber.slice(4,8)} ${card.cardNumber.slice(8,12)} ${card.cardNumber.slice(12)}`
                    : `•••• •••• •••• ${card.cardNumber.slice(-4)}`}
                </div>
                <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 4 }}>
                  Issued: {new Date(card.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </div>
              </div>

              {error[card.id] && <div style={{ fontSize: 12, color: "var(--color-danger)", marginBottom: 8 }}>{error[card.id]}</div>}

              {/* Controls */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  onClick={() => setRevealed((p) => ({ ...p, [card.id]: !p[card.id] }))}
                  className="btn-ghost"
                  style={{ flex: 1, fontSize: 12, padding: "7px 10px", display: "inline-flex", alignItems: "center", gap: 6, justifyContent: "center" }}
                >
                  {revealed[card.id] ? <><EyeOff size={14} /> Hide</> : <><Eye size={14} /> Reveal</>}
                </button>
                {revealed[card.id] && <CopyButton text={card.cardNumber} label="Number" />}
                {card.status === "ACTIVE" && (
                  <button onClick={() => handleCardAction(card.id, "freeze")} className="btn-ghost" style={{ flex: 1, fontSize: 12, padding: "7px 10px", color: "#64b4ff", borderColor: "rgba(100,180,255,0.2)" }} disabled={actionLoading[card.id]}>
                    ❄ Freeze
                  </button>
                )}
                {card.status === "FROZEN" && (
                  <button onClick={() => handleCardAction(card.id, "unfreeze")} className="btn-nexus" style={{ flex: 1, fontSize: 12, padding: "7px 10px" }} disabled={actionLoading[card.id]}>
                    ♨ Unfreeze
                  </button>
                )}
                <button onClick={() => { if (confirm("Cancel this card? This cannot be undone.")) handleCardAction(card.id, "cancel"); }} className="btn-danger" style={{ fontSize: 12, padding: "7px 12px" }} disabled={actionLoading[card.id] || card.status === "CANCELLED"}>
                  ✕
                </button>
              </div>

              <div style={{ marginTop: 8, fontSize: 11, color: "var(--color-text-muted)", textAlign: "center" }}>
                Click card to flip • See CVV on back
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 600,
  color: "var(--color-text-muted)", marginBottom: 8,
  letterSpacing: "0.06em", textTransform: "uppercase",
};
