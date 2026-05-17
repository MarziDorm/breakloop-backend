import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", paddingTop: 60 }}>

      {/* Hero */}
      <div style={{ marginBottom: 48 }}>
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          color: "var(--accent)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: 16,
        }}>
          ◉ Pattern disruption tool
        </div>
        <h1 style={{
          fontFamily: "var(--font-mono)",
          fontSize: 48,
          lineHeight: 1.1,
          marginBottom: 20,
          color: "var(--text)",
        }}>
          Break the<br />
          <span style={{ color: "var(--accent)" }}>loop.</span>
        </h1>
        <p style={{
          fontSize: 17,
          color: "var(--text-muted)",
          lineHeight: 1.7,
          marginBottom: 32,
        }}>
          BreakLoop helps you identify what triggers your bad habits, interrupt
          urges in real time, and learn from slip-ups — without guilt or shame.
          No streaks. No punishment. Just understanding.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/habits")}
          style={{ fontSize: 16, padding: "14px 32px", borderRadius: 10 }}
        >
          View My Habits →
        </button>
      </div>

      {/* How it works */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: 32,
        marginBottom: 24,
      }}>
        <h2 style={{
          fontFamily: "var(--font-mono)",
          fontSize: 14,
          color: "var(--accent)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 24,
        }}>
          How it works
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            { step: "01", title: "Pick a habit", desc: "Choose one bad habit you want to break — nail biting, doomscrolling, smoking, anything." },
            { step: "02", title: "Identify your triggers", desc: "Tell the app what typically causes the urge: stress, boredom, loneliness, or something else." },
            { step: "03", title: "Choose a replacement", desc: "Pick a healthier action to do instead when the urge hits — stretch, breathe, go outside." },
            { step: "04", title: "Log every urge", desc: "When you feel the urge, log it. Mark whether you resisted or slipped. No judgment — just data." },
            { step: "05", title: "Learn and improve", desc: "Over time, see your patterns: when urges peak, which triggers are most common, how often you resist." },
          ].map(({ step, title, desc }) => (
            <div key={step} style={{ display: "flex", gap: 20 }}>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--accent)",
                opacity: 0.5,
                minWidth: 28,
                paddingTop: 2,
              }}>
                {step}
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 40 }}>
        {[
          { icon: "◎", title: "No streak shame", desc: "Slip-ups are data, not failures." },
          { icon: "⊕", title: "Trigger insights", desc: "Understand what drives your habits." },
          { icon: "◈", title: "Replacement actions", desc: "Swap bad habits for better ones." },
          { icon: "◐", title: "Pause anytime", desc: "Take breaks without losing progress." },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "16px 20px",
          }}>
            <div style={{ fontSize: 20, marginBottom: 8, color: "var(--accent)" }}>{icon}</div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", paddingBottom: 60 }}>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 16 }}>
          Ready to start breaking the loop?
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/habits")}
          style={{ fontSize: 15, padding: "12px 28px", borderRadius: 10 }}
        >
          Get Started →
        </button>
      </div>

    </div>
  );
}
