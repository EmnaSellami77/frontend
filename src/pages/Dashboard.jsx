import React from "react";
import { useNavigate } from "react-router-dom";

// ─── Icons ───────────────────────────────────────────────────────────────────

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const TicketIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ClockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const ChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, label, value, color, bg, trend }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: "24px 28px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.05)",
      borderTop: `3px solid ${color}`, flex: 1,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 13, color: "#64748b", fontWeight: 500, margin: 0 }}>{label}</p>
          <p style={{ fontSize: 34, fontWeight: 800, color: "#0f172a", margin: "6px 0 0" }}>{value}</p>
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: bg, display: "flex", alignItems: "center",
          justifyContent: "center", color,
        }}>
          {icon}
        </div>
      </div>
      {trend && (
        <p style={{ fontSize: 12, color: "#94a3b8", margin: "12px 0 0", fontWeight: 500 }}>
          {trend}
        </p>
      )}
    </div>
  );
}

function PriorityRow({ label, count, color, bg, total }) {
  const pct = Math.round((count / total) * 100);
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
          <span style={{ fontSize: 13.5, fontWeight: 500, color: "#374151" }}>{label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: 12, fontWeight: 700, padding: "2px 10px",
            borderRadius: 20, background: bg, color,
          }}>{count}</span>
          <span style={{ fontSize: 12, color: "#94a3b8", minWidth: 32 }}>{pct}%</span>
        </div>
      </div>
      <div style={{ height: 5, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%",
          background: color, borderRadius: 4,
          transition: "width 0.6s ease",
        }} />
      </div>
    </div>
  );
}

function ActionButton({ icon, label, primary, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        padding: "11px 20px", borderRadius: 10, fontWeight: 600, fontSize: 14,
        cursor: "pointer", transition: "all 0.2s", width: "100%",
        background: primary ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#f8fafc",
        color: primary ? "#fff" : "#374151",
        border: primary ? "none" : "1.5px solid #e2e8f0",
        boxShadow: primary ? "0 4px 12px rgba(99,102,241,0.28)" : "none",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
    >
      {icon} {label}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function Dashboard() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const isDev = role === "developer";

  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/");
  };

  const now = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const TOTAL = 120;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#f0f4ff 0%,#fafafa 100%)",
      fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif",
      padding: "36px 28px",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{
          background: "linear-gradient(135deg,#1e293b 0%,#0f172a 100%)",
          borderRadius: 20, padding: "28px 36px", marginBottom: 28,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          boxShadow: "0 8px 32px rgba(15,23,42,0.18)",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <TicketIcon />
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.4px" }}>
                IT Dashboard
              </h1>
            </div>
            <p style={{ color: "#94a3b8", fontSize: 13.5, margin: 0 }}>
              Bienvenue,{" "}
              <span style={{ color: "#c4b5fd", fontWeight: 600 }}>
                {isDev ? "Développeur" : "Consultant IT"}
              </span>
              {"  ·  "}
              <span style={{ textTransform: "capitalize" }}>{now}</span>
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(99,102,241,0.18)", color: "#c4b5fd",
              fontSize: 12, fontWeight: 600, padding: "5px 12px",
              borderRadius: 20, border: "1px solid rgba(99,102,241,0.3)",
            }}>
              <ShieldIcon />
              {isDev ? "Developer" : "IT Consultant"}
            </span>

            <button
              onClick={handleLogout}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "9px 18px", background: "rgba(255,255,255,0.07)",
                color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 10, fontWeight: 600, fontSize: 13.5, cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.13)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
            >
              <LogoutIcon /> Déconnexion
            </button>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div style={{ display: "flex", gap: 18, marginBottom: 24 }}>
          <StatCard
            icon={<TicketIcon />}
            label="Total Tickets"
            value={TOTAL}
            color="#6366f1"
            bg="#eef2ff"
            trend="↑ +8 cette semaine"
          />
          <StatCard
            icon={<CheckIcon />}
            label="Résolus"
            value={95}
            color="#16a34a"
            bg="#f0fdf4"
            trend="79% taux de résolution"
          />
          <StatCard
            icon={<ClockIcon />}
            label="En attente"
            value={25}
            color="#d97706"
            bg="#fffbeb"
            trend="↓ −3 depuis hier"
          />
        </div>

        {/* ── Bottom Row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* Priority Card */}
          <div style={{
            background: "#fff", borderRadius: 16, overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 20px rgba(0,0,0,0.05)",
          }}>
            <div style={{
              padding: "18px 24px", borderBottom: "1px solid #f1f5f9",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                Tickets par priorité
              </h3>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>Total : {TOTAL}</span>
            </div>
            <div style={{ padding: "22px 24px" }}>
              <PriorityRow label="Haute priorité"   count={15} color="#dc2626" bg="#fef2f2" total={TOTAL} />
              <PriorityRow label="Priorité moyenne" count={45} color="#d97706" bg="#fffbeb" total={TOTAL} />
              <PriorityRow label="Basse priorité"   count={60} color="#16a34a" bg="#f0fdf4" total={TOTAL} />
            </div>
          </div>

          {/* Actions Card */}
          <div style={{
            background: "#fff", borderRadius: 16, overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 20px rgba(0,0,0,0.05)",
          }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                Actions rapides
              </h3>
              <p style={{ fontSize: 12.5, color: "#94a3b8", margin: "4px 0 0" }}>
                {isDev ? "Espace développeur" : "Espace consultant"}
              </p>
            </div>
            <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
              {isDev ? (
                <>
                  <ActionButton primary icon={<PlusIcon />}  label="Créer un nouveau ticket" />
                  <ActionButton        icon={<ListIcon />}   label="Voir mes tickets" />
                </>
              ) : (
                <>
                  <ActionButton primary icon={<ListIcon />}  label="Voir tous les tickets" />
                  <ActionButton        icon={<ChartIcon />}  label="Analyses et rapports" />
                </>
              )}
            </div>

            {/* Mini info footer */}
            <div style={{
              margin: "0 24px 22px",
              background: "#f8fafc", borderRadius: 10,
              padding: "12px 16px", border: "1px solid #e2e8f0",
            }}>
              <p style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                <span style={{ fontWeight: 600, color: "#374151" }}>Dernière mise à jour :</span>{" "}
                aujourd'hui à {new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </p>
              <p style={{ fontSize: 12.5, color: "#64748b", margin: "4px 0 0" }}>
                <span style={{ fontWeight: 600, color: "#374151" }}>Statut système :</span>{" "}
                <span style={{ color: "#16a34a", fontWeight: 600 }}>● Opérationnel</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;