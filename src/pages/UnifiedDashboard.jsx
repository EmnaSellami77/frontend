import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================

const PRIORITY_CONFIG = {
  Haute:   { bg: "#fef2f2", color: "#dc2626", dot: "#dc2626", label: "Haute" },
  Moyenne: { bg: "#fffbeb", color: "#d97706", dot: "#f59e0b", label: "Moyenne" },
  Basse:   { bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e", label: "Basse" },
};

const STATUS_CONFIG = {
  "Non résolu": { bg: "#fffbeb", color: "#b40909", dot: "#f50b0b", label: "Non résolu" },
  "En cours":   { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6", label: "En cours" },
  "Résolu":     { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e", label: "Résolu" },
};

const COLORS = {
  primary: "#6366f1",
  primaryDark: "#4f46e5",
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
  white: "#ffffff",
};

const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://back2-ys67.onrender.com',
  ENDPOINTS: { PREDICT: '/tickets/predict' },
  TIMEOUT: 10000
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const formatDate = (dateString) => {
  if (!dateString) return "Date inconnue";
  return new Date(dateString).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const mapPriorityToDisplay = (priority) => {
  if (!priority) return 'Moyenne';
  const str = String(priority).toLowerCase();
  if (str === 'high' || str === 'haute') return 'Haute';
  if (str === 'medium' || str === 'moyenne') return 'Moyenne';
  if (str === 'low' || str === 'basse') return 'Basse';
  return 'Moyenne';
};

const mapDisplayToPriority = (display) => {
  const mapping = { Haute: 'high', Moyenne: 'medium', Basse: 'low' };
  return mapping[display] || 'medium';
};

const normalizeStatus = (status) => {
  if (!status) return "Non résolu";
  const str = String(status).toLowerCase().trim();
  if (str === 'résolu' || str === 'resolu' || str === 'closed' || str === 'done' || str === 'resolved') 
    return "Résolu";
  if (str === 'en cours' || str === 'encours' || str === 'in_progress' || str === 'in progress' || str === 'progress') 
    return "En cours";
  return "Non résolu";
};

// ============================================
// ICONS COMPONENTS
// ============================================

const IconWrapper = React.memo(({ children, size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
));

const Icons = {
  Logout: React.memo(() => (
    <IconWrapper size={16}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </IconWrapper>
  )),
  Settings: React.memo(() => (
    <IconWrapper size={16}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.04.04A10 10 0 0 0 12 17.66a10 10 0 0 0 6.36-2.62z" />
    </IconWrapper>
  )),
  Ticket: React.memo(() => (
    <IconWrapper size={22}>
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    </IconWrapper>
  )),
  Check: React.memo(() => (
    <IconWrapper size={22}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </IconWrapper>
  )),
  Clock: React.memo(() => (
    <IconWrapper size={22}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </IconWrapper>
  )),
  Search: React.memo(() => (
    <IconWrapper size={16}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </IconWrapper>
  )),
  X: React.memo(() => (
    <IconWrapper size={14} strokeWidth="2.5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </IconWrapper>
  )),
  Chevron: React.memo(({ dir }) => (
    <IconWrapper size={12} strokeWidth="2.5">
      <polyline points={dir === "down" ? "6 9 12 15 18 9" : "18 15 12 9 6 15"} />
    </IconWrapper>
  )),
  AI: React.memo(() => (
    <IconWrapper size={16}>
      <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10 10 10 0 0 1-10-10 10 10 0 0 1 10-10z" />
      <path d="M12 6v6l4 2" />
    </IconWrapper>
  )),
  Edit: React.memo(() => (
    <IconWrapper size={14}>
      <path d="M17 3l4 4-7 7H10v-4l7-7z" />
      <path d="M4 20h16" />
    </IconWrapper>
  )),
  Trash: React.memo(() => (
    <IconWrapper size={14}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </IconWrapper>
  )),
};

// ============================================
// STYLES
// ============================================

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f4ff 0%, #fafafa 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  contentWrapper: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "36px 24px",
  },
  card: {
    background: COLORS.white,
    borderRadius: 16,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.05)",
  },
  statsGrid: {
    display: "flex",
    gap: 18,
    marginBottom: 24,
    flexWrap: "wrap",
  },
  searchInput: {
    width: "100%",
    padding: "9px 36px 9px 38px",
    border: `1.5px solid ${COLORS.border}`,
    borderRadius: 10,
    fontSize: 13.5,
    color: COLORS.dark,
    outline: "none",
    background: COLORS.background,
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
  },
  button: {
    primary: {
      background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
      color: COLORS.white,
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    secondary: {
      background: COLORS.border,
      color: COLORS.gray,
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    ghost: {
      background: "none",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
  },
};

// ============================================
// COMPOSANTS RÉUTILISABLES
// ============================================

const Badge = React.memo(({ config, label }) => {
  const safeConfig = config || PRIORITY_CONFIG["Moyenne"];
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      background: safeConfig.bg,
      color: safeConfig.color,
      fontSize: 12,
      fontWeight: 600,
      padding: "4px 10px",
      borderRadius: 20,
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: safeConfig.dot, flexShrink: 0 }} />
      {label || safeConfig.label}
    </span>
  );
});

const StatCard = React.memo(({ icon: Icon, label, value, color, bg }) => (
  <div style={{ ...styles.card, padding: "20px 24px", borderTop: `3px solid ${color}`, flex: 1, minWidth: 200 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p style={{ fontSize: 13, color: COLORS.gray, fontWeight: 500, margin: 0 }}>{label}</p>
        <p style={{ fontSize: 32, fontWeight: 800, color: COLORS.dark, margin: "8px 0 0" }}>{value}</p>
      </div>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", color }}>
        <Icon />
      </div>
    </div>
  </div>
));

const Header = React.memo(({ userName, date, onLogout, onSettings }) => (
  <div style={{
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    borderRadius: 20,
    padding: "28px 36px",
    marginBottom: 28,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
    boxShadow: "0 8px 32px rgba(15,23,42,0.18)",
  }}>
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icons.Ticket />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: COLORS.white, margin: 0, letterSpacing: "-0.4px" }}>
          Gestion des Tickets
        </h1>
      </div>
      <p style={{ color: COLORS.lightGray, fontSize: 13.5, margin: 0 }}>
        Bienvenue, <span style={{ color: "#c4b5fd", fontWeight: 600 }}>{userName}</span> {"  ·  "}
        <span style={{ textTransform: "capitalize" }}>{date}</span>
      </p>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <button onClick={onSettings} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: "rgba(255,255,255,0.07)", color: COLORS.border, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>
        <Icons.Settings /> Paramètres
      </button>
      <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: "rgba(255,255,255,0.07)", color: COLORS.border, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>
        <Icons.Logout /> Déconnexion
      </button>
    </div>
  </div>
));

const PrioritySelector = React.memo(({ currentPriority, onPriorityChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const priorities = ["Haute", "Moyenne", "Basse"];
  const safePriority = PRIORITY_CONFIG[currentPriority] ? currentPriority : "Moyenne";
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setIsOpen(!isOpen)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: 0, background: "none", border: "none", cursor: "pointer" }}>
        <Badge config={PRIORITY_CONFIG[safePriority]} />
        <Icons.Edit />
      </button>
      {isOpen && (
        <>
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }} onClick={() => setIsOpen(false)} />
          <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 8, background: COLORS.white, borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", border: `1px solid ${COLORS.border}`, zIndex: 999, minWidth: 120 }}>
            {priorities.map(p => (
              <button key={p} onClick={() => { onPriorityChange(p); setIsOpen(false); }} style={{ display: "block", width: "100%", padding: "8px 12px", background: "none", border: "none", cursor: "pointer", textAlign: "left", borderRadius: 10 }}>
                <Badge config={PRIORITY_CONFIG[p]} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

const StatusSelector = React.memo(({ currentStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const statuses = ["Non résolu", "En cours", "Résolu"];
  const safeStatus = STATUS_CONFIG[currentStatus] ? currentStatus : "Non résolu";
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setIsOpen(!isOpen)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: 0, background: "none", border: "none", cursor: "pointer" }}>
        <Badge config={STATUS_CONFIG[safeStatus]} />
        <Icons.Edit />
      </button>
      {isOpen && (
        <>
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }} onClick={() => setIsOpen(false)} />
          <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 8, background: COLORS.white, borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", border: `1px solid ${COLORS.border}`, zIndex: 999, minWidth: 120 }}>
            {statuses.map(s => (
              <button key={s} onClick={() => { onStatusChange(s); setIsOpen(false); }} style={{ display: "block", width: "100%", padding: "8px 12px", background: "none", border: "none", cursor: "pointer", textAlign: "left", borderRadius: 10 }}>
                <Badge config={STATUS_CONFIG[s]} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

const COLUMNS = [
  { key: "id", label: "#", sortable: true },
  { key: "type", label: "Type de problème", sortable: true },
  { key: "description", label: "Description", sortable: false },
  { key: "utilisateur", label: "Créé par", sortable: true },
  { key: "dateCreation", label: "Date", sortable: true },
  { key: "priorite", label: "Priorité", sortable: true },
  { key: "status", label: "Statut", sortable: true },
  { key: "attachments", label: "Fichiers", sortable: false },
  { key: "actions", label: "Actions", sortable: false },
];

function UnifiedDashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "priorite", direction: "desc" });
  const [modalState, setModalState] = useState({ isOpen: false, ticket: null, prediction: null, loading: false, error: null });

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const isIT = role === "it_consultant" || role === "Consultant IT" || role === "it";
      const url = isIT ? '/tickets/all' : '/tickets/my';
      const response = await API.get(url);
      const data = response.data;
      const formatted = data.map(t => ({
        id: t._id || `temp-${Math.random()}`,
        type: t.type_personnalise || t.type || "Standard",
        description: t.description || t.titre || "Aucune description",
        // ✅ ICI : utiliser user_name (nom du créateur) au lieu de user_email
        utilisateur: t.user_name || t.user_email || "Inconnu",
        dateCreation: t.dateCreation || t.createdAt || new Date().toISOString(),
        priorite: mapPriorityToDisplay(t.priorite),
        status: normalizeStatus(t.status),
        attachments: t.attachments || []
      }));
      setTickets(formatted);
    } catch (err) {
      console.error(err);
      alert("Erreur chargement tickets");
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    if (role !== null) fetchTickets();
  }, [role, fetchTickets]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (role !== null && !loading) {
        fetchTickets();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [role, fetchTickets, loading]);

  const isITConsultant = role === "it_consultant" || role === "Consultant IT" || role === "it";
  const currentDate = useMemo(() => new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }), []);

  const stats = useMemo(() => ({
    total: tickets.length,
    resolved: tickets.filter(t => t.status === "Résolu").length,
    unresolved: tickets.filter(t => t.status !== "Résolu").length,
  }), [tickets]);

  const filteredAndSortedTickets = useMemo(() => {
    let result = [...tickets];
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(t => 
        (t.type || "").toLowerCase().includes(lower) || 
        (t.description || "").toLowerCase().includes(lower) ||
        (t.utilisateur || "").toLowerCase().includes(lower)
      );
    }
    const { key, direction } = sortConfig;
    if (key && key !== 'actions' && key !== 'attachments') {
      result.sort((a, b) => {
        let aVal = a[key];
        let bVal = b[key];
        if (key === 'priorite') {
          const order = { 'Haute': 3, 'Moyenne': 2, 'Basse': 1 };
          aVal = order[aVal] || 0;
          bVal = order[bVal] || 0;
        } else {
          if (aVal === undefined || aVal === null) aVal = '';
          if (bVal === undefined || bVal === null) bVal = '';
          if (typeof aVal === "string") {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
          }
        }
        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [tickets, search, sortConfig]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
  };
  const handleSettings = () => navigate("/settings");
  const handleSort = (key) => {
    if (key === 'actions' || key === 'attachments') return;
    setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc" }));
  };

  const handlePriorityChange = async (ticketId, newPriorityDisplay) => {
    try {
      await API.patch(`/tickets/${ticketId}/priority`, { priority: mapDisplayToPriority(newPriorityDisplay) });
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, priorite: newPriorityDisplay } : t));
    } catch (err) { 
      console.error(err);
      alert("Erreur mise à jour priorité"); 
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await API.put(`/tickets/${ticketId}`, { status: newStatus });
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
    } catch (err) { 
      console.error(err);
      alert("Erreur mise à jour statut"); 
    }
  };

  const handleDelete = async (ticketId) => {
    if (!window.confirm("Supprimer définitivement ce ticket ?")) return;
    try {
      await API.delete(`/tickets/${ticketId}`);
      setTickets(prev => prev.filter(t => t.id !== ticketId));
    } catch (err) { 
      console.error(err);
      alert("Erreur suppression"); 
    }
  };

  const analyzeTicket = async (ticket) => {
    setModalState({ isOpen: true, ticket, prediction: null, loading: true, error: null });
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PREDICT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: ticket.type + " " + ticket.description }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`Erreur ${response.status}`);
      const data = await response.json();
      setModalState(prev => ({ ...prev, prediction: data, loading: false }));
    } catch (err) {
      setModalState(prev => ({ ...prev, error: err.message, loading: false }));
    }
  };

  const closeModal = () => setModalState({ isOpen: false, ticket: null, prediction: null, loading: false, error: null });

  if (loading && tickets.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.contentWrapper}>
          <div style={{ textAlign: "center", padding: "50px" }}>
            <div style={{ width: 50, height: 50, border: `3px solid ${COLORS.border}`, borderTop: `3px solid ${COLORS.primary}`, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px" }} />
            <p style={{ color: COLORS.gray }}>Chargement des tickets...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        <Header userName={isITConsultant ? "IT Consultant" : "Développeur"} date={currentDate} onLogout={handleLogout} onSettings={handleSettings} />

        <div style={styles.statsGrid}>
          <StatCard icon={Icons.Ticket} label="Total Tickets" value={stats.total} color={COLORS.primary} bg={COLORS.primaryLight} />
          <StatCard icon={Icons.Check} label="Résolus" value={stats.resolved} color={COLORS.success} bg={COLORS.successLight} />
          <StatCard icon={Icons.Clock} label="Non résolus" value={stats.unresolved} color={COLORS.warning} bg={COLORS.warningLight} />
        </div>

        <div style={styles.card}>
          <div style={{ padding: "18px 24px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontWeight: 600, color: COLORS.dark, fontSize: 14 }}>{filteredAndSortedTickets.length} ticket(s) trouvé(s)</span>
            <div style={{ position: "relative", width: 280 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: COLORS.lightGray }}><Icons.Search /></span>
              <input type="text" placeholder="Rechercher type, description ou créateur…" value={search} onChange={(e) => setSearch(e.target.value)} style={styles.searchInput} />
              {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: COLORS.border, border: "none", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Icons.X /></button>}
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: COLORS.background }}>
                  {COLUMNS.map(col => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: COLORS.gray,
                        fontSize: 12,
                        textTransform: "uppercase",
                        cursor: col.sortable ? "pointer" : "default",
                        borderBottom: `1px solid ${COLORS.border}`
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        {col.label}
                        {col.sortable && (
                          <span style={{ color: sortConfig.key === col.key ? COLORS.primary : COLORS.lightGray }}>
                            <Icons.Chevron dir={sortConfig.key === col.key && sortConfig.direction === "desc" ? "down" : "up"} />
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedTickets.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: "48px 0", textAlign: "center", color: COLORS.lightGray }}>Aucun ticket trouvé</td>
                  </tr>
                ) : (
                  filteredAndSortedTickets.map((ticket, idx) => (
                    <tr key={ticket.id} style={{ background: idx % 2 === 0 ? COLORS.white : "#fafafa" }}>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
                        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, background: COLORS.primaryLight, color: COLORS.primary, borderRadius: 6, fontWeight: 700, fontSize: 12 }}>
                          {typeof ticket.id === 'string' ? ticket.id.slice(-4) : ticket.id}
                        </span>
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${COLORS.border}`, fontWeight: 500, color: COLORS.dark }}>{ticket.type}</td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.gray, maxWidth: 250, wordBreak: "break-word" }}>{ticket.description}</td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.white, fontSize: 11, fontWeight: 700 }}>
                            {ticket.utilisateur?.[0]?.toUpperCase() || "?"}
                          </div>
                          <span style={{ color: COLORS.dark, fontWeight: 500 }}>{ticket.utilisateur}</span>
                        </div>
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.gray }}>{formatDate(ticket.dateCreation)}</td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
                        <PrioritySelector currentPriority={ticket.priorite} onPriorityChange={(p) => handlePriorityChange(ticket.id, p)} />
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
                        <StatusSelector currentStatus={ticket.status} onStatusChange={(s) => handleStatusChange(ticket.id, s)} />
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", maxWidth: "200px" }}>
                          {ticket.attachments && ticket.attachments.length > 0 ? (
                            ticket.attachments.map((att, idx) => (
                              <a
                                key={idx}
                                href={att.url?.startsWith("http") ? att.url : `${API_CONFIG.BASE_URL}${att.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  fontSize: "11px",
                                  background: "#eef2ff",
                                  padding: "3px 8px",
                                  borderRadius: "16px",
                                  color: COLORS.primary,
                                  textDecoration: "none",
                                }}
                                title={att.filename}
                              >
                                📎 {att.filename.length > 15 ? att.filename.slice(0, 12) + "…" : att.filename}
                              </a>
                            ))
                          ) : (
                            <span style={{ color: COLORS.lightGray, fontSize: "11px" }}>—</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => analyzeTicket(ticket)} style={{ ...styles.button.primary, padding: "6px 12px", borderRadius: 8, fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <Icons.AI /> Analyser
                          </button>
                          <button onClick={() => handleDelete(ticket.id)} style={{ background: COLORS.errorLight, border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: COLORS.error }}>
                            <Icons.Trash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={{ padding: "12px 24px", borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12.5, color: COLORS.lightGray }}>Affichage de {filteredAndSortedTickets.length} sur {tickets.length} tickets</span>
            <span style={{ fontSize: 12, color: COLORS.lightGray }}>Cliquez sur Analyser pour la prédiction IA</span>
          </div>
        </div>

        {modalState.isOpen && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
            <div style={{ background: COLORS.white, borderRadius: 18, padding: 28, maxWidth: 450, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.dark, margin: 0 }}>Analyse IA</h2>
                <button onClick={closeModal} style={styles.button.ghost}><Icons.X /></button>
              </div>
              {modalState.loading ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ width: 40, height: 40, border: `3px solid ${COLORS.border}`, borderTop: `3px solid ${COLORS.primary}`, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
                  <p style={{ color: COLORS.gray }}>Analyse en cours...</p>
                </div>
              ) : modalState.error ? (
                <div style={{ background: COLORS.errorLight, color: COLORS.error, padding: 16, borderRadius: 10 }}><p style={{ margin: 0 }}>❌ {modalState.error}</p></div>
              ) : modalState.prediction && (
                <>
                  <div style={{ background: COLORS.background, borderRadius: 12, padding: 20, marginBottom: 20 }}>
                    <p><strong>Type:</strong> {modalState.ticket?.type}</p>
                    <p><strong>Description:</strong> {modalState.ticket?.description}</p>
                    <div style={{ marginBottom: 16 }}>
                      <p style={{ fontSize: 13, color: COLORS.gray, marginBottom: 6 }}>Catégorie prédite :</p>
                      <div style={{ background: COLORS.primaryLight, color: COLORS.primary, padding: "10px 16px", borderRadius: 8, fontWeight: 700 }}>{modalState.prediction.prediction || modalState.prediction.category}</div>
                    </div>
                    <div><p style={{ fontSize: 13, color: COLORS.gray, marginBottom: 6 }}>Niveau de confiance :</p><div style={{ color: COLORS.primary, fontWeight: 600 }}>{Math.round((modalState.prediction.confidence || 0.75) * 100)}%</div></div>
                  </div>
                  <button onClick={closeModal} style={{ ...styles.button.secondary, padding: "10px 20px", borderRadius: 8, width: "100%" }}>Fermer</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default React.memo(UnifiedDashboard);