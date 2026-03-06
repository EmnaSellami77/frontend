import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─── Constants ───────────────────────────────────────────────────────────────
const COLORS = {
  primary: "#6366f1",
  primaryLight: "#eef2ff",
  success: "#16a34a",
  successLight: "#f0fdf4",
  warning: "#d97706",
  warningLight: "#fffbeb",
  error: "#dc2626",
  errorLight: "#fef2f2",
  dark: "#0f172a",
  gray: "#64748b",
  lightGray: "#94a3b8",
  border: "#e2e8f0",
  background: "#f8fafc",
};

const STYLES = {
  card: {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.05)",
  },
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icons = {
  Logout: React.memo(() => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )),

  Settings: React.memo(() => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.04.04A10 10 0 0 0 12 17.66a10 10 0 0 0 6.36-2.62z" />
      <path d="M16.5 6.5 17 6a3 3 0 0 1 5 2v.1" />
      <path d="M4.5 6.5 4 6a3 3 0 0 0-5 2v.1" />
    </svg>
  )),

  Ticket: React.memo(() => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    </svg>
  )),

  Check: React.memo(() => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )),

  Clock: React.memo(() => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )),

  Chart: React.memo(() => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )),
};

// ─── Display Names ───────────────────────────────────────────────────────────
Icons.Logout.displayName = "LogoutIcon";
Icons.Settings.displayName = "SettingsIcon";
Icons.Ticket.displayName = "TicketIcon";
Icons.Check.displayName = "CheckIcon";
Icons.Clock.displayName = "ClockIcon";
Icons.Chart.displayName = "ChartIcon";

// ─── Hooks personnalisés ─────────────────────────────────────────────────────
const useDashboardData = () => {
  const [stats] = useState({
    totalTickets: 120,
    resolved: 95,
    pending: 25,
    resolutionRate: 79,
  });

  const priorities = useMemo(() => [
    { label: "Haute priorité", count: 15, color: COLORS.error },
    { label: "Priorité moyenne", count: 45, color: COLORS.warning },
    { label: "Basse priorité", count: 60, color: COLORS.success },
  ], []);

  return { stats, priorities, totalTickets: stats.totalTickets };
};

// ─── Sous-composants ─────────────────────────────────────────────────────────
const StatCard = React.memo(({ icon: Icon, label, value, color, bg, trend }) => (
  <div style={{
    ...STYLES.card,
    padding: "24px 28px",
    borderTop: `3px solid ${color}`,
    flex: 1,
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p style={{ fontSize: 13, color: COLORS.gray, fontWeight: 500, margin: 0 }}>{label}</p>
        <p style={{ fontSize: 34, fontWeight: 800, color: COLORS.dark, margin: "6px 0 0" }}>{value}</p>
        {trend && (
          <p style={{ fontSize: 12, color: COLORS.lightGray, margin: "4px 0 0", fontWeight: 500 }}>
            {trend}
          </p>
        )}
      </div>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: bg, display: "flex", alignItems: "center",
        justifyContent: "center", color,
      }}>
        <Icon />
      </div>
    </div>
  </div>
));

StatCard.displayName = "StatCard";

const PriorityRow = React.memo(({ label, count, color, total }) => {
  const pct = Math.round((count / total) * 100);
  
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
        <span style={{ fontSize: 14, fontWeight: 500, color: "#374151" }}>{label}</span>
      </div>
      <div style={{ marginLeft: 16 }}>
        <span style={{ fontSize: 14, color: COLORS.gray }}>
          {count} ({pct}%)
        </span>
      </div>
    </div>
  );
});

PriorityRow.displayName = "PriorityRow";

const ActionButton = React.memo(({ icon: Icon, label, primary, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = useMemo(() => ({
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "11px 20px", borderRadius: 10, fontWeight: 600, fontSize: 14,
    cursor: "pointer", transition: "all 0.2s", width: "100%",
    background: primary ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : COLORS.background,
    color: primary ? "#fff" : "#374151",
    border: primary ? "none" : `1.5px solid ${COLORS.border}`,
    boxShadow: primary ? "0 4px 12px rgba(99,102,241,0.28)" : "none",
    opacity: isHovered ? 0.88 : 1,
  }), [primary, isHovered]);

  return (
    <button
      onClick={onClick}
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon /> {label}
    </button>
  );
});

ActionButton.displayName = "ActionButton";

const Header = React.memo(({ isDev, onLogout, onSettings, date }) => (
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
          <Icons.Ticket />
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
        <span style={{ textTransform: "capitalize" }}>{date}</span>
      </p>
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <button
        onClick={onSettings}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "9px 18px", background: "rgba(255,255,255,0.07)",
          color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 10, fontWeight: 600, fontSize: 13.5, cursor: "pointer",
        }}
      >
        <Icons.Settings /> Settings
      </button>

      <button
        onClick={onLogout}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "9px 18px", background: "rgba(255,255,255,0.07)",
          color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 10, fontWeight: 600, fontSize: 13.5, cursor: "pointer",
        }}
      >
        <Icons.Logout /> Déconnexion
      </button>
    </div>
  </div>
));

Header.displayName = "Header";

// ─── Composant Principal ─────────────────────────────────────────────────────
function Dashboard() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const isDev = role === "developer";
  const { stats, priorities, totalTickets } = useDashboardData();

  const currentDate = useMemo(() => 
    new Date().toLocaleDateString("fr-FR", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    }), 
  []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("role");
    navigate("/");
  }, [navigate]);

  const handleSettings = useCallback(() => {
    navigate("/settings");
  }, [navigate]);

  const handleViewAllTickets = useCallback(() => {
    navigate("/tickets");
  }, [navigate]);

  const handleViewReports = useCallback(() => {
    console.log("Voir les rapports");
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#f0f4ff 0%,#fafafa 100%)",
      fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    }}>
      <div style={{ 
        maxWidth: 1200, 
        width: "100%",
        margin: "0 auto",
      }}>
        <Header 
          isDev={isDev} 
          onLogout={handleLogout} 
          onSettings={handleSettings}
          date={currentDate} 
        />

        {/* Cartes de statistiques */}
        <div style={{ display: "flex", gap: 18, marginBottom: 24 }}>
          <StatCard
            icon={Icons.Ticket}
            label="Total Tickets"
            value={stats.totalTickets}
            color={COLORS.primary}
            bg={COLORS.primaryLight}
            trend="↑ +8 cette semaine"
          />
          <StatCard
            icon={Icons.Check}
            label="Résolus"
            value={stats.resolved}
            color={COLORS.success}
            bg={COLORS.successLight}
            trend={`${stats.resolutionRate}% taux de résolution`}
          />
          <StatCard
            icon={Icons.Clock}
            label="En attente"
            value={stats.pending}
            color={COLORS.warning}
            bg={COLORS.warningLight}
            trend="↓ −3 depuis hier"
          />
        </div>

        {/* Tickets par priorité */}
        <div style={{ ...STYLES.card, padding: "24px", marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.dark, margin: "0 0 16px 0" }}>
            Tickets par priorité
          </h3>
          {priorities.map((priority) => (
            <PriorityRow
              key={priority.label}
              label={priority.label}
              count={priority.count}
              color={priority.color}
              total={totalTickets}
            />
          ))}
        </div>

        {/* Actions rapides */}
        <div style={STYLES.card}>
          <div style={{ padding: "24px" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.dark, margin: "0 0 4px 0" }}>
              Actions rapides
            </h3>
            <p style={{ fontSize: 13, color: COLORS.lightGray, margin: "0 0 16px 0" }}>
              Espace consultant
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <ActionButton 
                primary 
                icon={Icons.Ticket} 
                label="Tickets" 
                onClick={handleViewAllTickets} 
              />
              <ActionButton 
                icon={Icons.Chart} 
                label="Analyses et rapports" 
                onClick={handleViewReports} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Dashboard);