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
  "En attente": { bg: "#fffbeb", color: "#b45309", dot: "#f59e0b", label: "En attente" },
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
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  ENDPOINTS: {
    PREDICT: '/predict'
  },
  TIMEOUT: 10000
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getScoreColor = (score) => {
  if (score > 0.8) return "#22c55e";
  if (score > 0.5) return "#f59e0b";
  return "#ef4444";
};

// Convertir priorité API vers format affichage
const mapPriorityToDisplay = (priority) => {
  const mapping = {
    'high': 'Haute',
    'medium': 'Moyenne',
    'low': 'Basse'
  };
  return mapping[priority] || 'Moyenne';
};

// ============================================
// ICONS COMPONENTS (Optimized)
// ============================================

const IconWrapper = React.memo(({ children, size = 20, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
));

IconWrapper.displayName = "IconWrapper";

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
      <polyline points={`${dir === "down" ? "6 9 12 15 18 9" : "18 15 12 9 6 15"}`} />
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
};

Object.values(Icons).forEach(icon => {
  if (icon.displayName === undefined) {
    icon.displayName = `Icon${icon.name || 'Component'}`;
  }
});

// ============================================
// STYLED COMPONENTS (Inline styles with theme)
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
// COMPONENTS
// ============================================

const Badge = React.memo(({ config, label }) => (
  <span className="badge" style={{
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    background: config.bg,
    color: config.color,
    fontSize: 12,
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: 20,
    whiteSpace: "nowrap",
  }}>
    <span style={{
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: config.dot,
      flexShrink: 0,
    }} />
    {label || config.label}
  </span>
));

Badge.displayName = "Badge";

const ScoreBar = React.memo(({ score }) => {
  const pct = Math.round(score * 100);
  const color = getScoreColor(score);
  
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        flex: 1,
        height: 5,
        background: COLORS.border,
        borderRadius: 4,
        overflow: "hidden",
      }}>
        <div style={{
          width: `${pct}%`,
          height: "100%",
          background: color,
          borderRadius: 4,
          transition: "width 0.3s ease",
        }} />
      </div>
      <span style={{
        fontSize: 12,
        fontWeight: 700,
        color,
        minWidth: 34,
      }}>
        {pct}%
      </span>
    </div>
  );
});

ScoreBar.displayName = "ScoreBar";

const StatCard = React.memo(({ icon: Icon, label, value, color, bg }) => (
  <div style={{
    ...styles.card,
    padding: "20px 24px",
    borderTop: `3px solid ${color}`,
    flex: 1,
    minWidth: 200,
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p style={{ fontSize: 13, color: COLORS.gray, fontWeight: 500, margin: 0 }}>
          {label}
        </p>
        <p style={{
          fontSize: 32,
          fontWeight: 800,
          color: COLORS.dark,
          margin: "8px 0 0",
        }}>
          {value}
        </p>
      </div>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color,
      }}>
        <Icon />
      </div>
    </div>
  </div>
));

StatCard.displayName = "StatCard";

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
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Icons.Ticket />
        </div>
        <h1 style={{
          fontSize: 22,
          fontWeight: 800,
          color: COLORS.white,
          margin: 0,
          letterSpacing: "-0.4px",
        }}>
          Gestion des Tickets
        </h1>
      </div>
      <p style={{ color: COLORS.lightGray, fontSize: 13.5, margin: 0 }}>
        Bienvenue, <span style={{ color: "#c4b5fd", fontWeight: 600 }}>{userName}</span>
        {"  ·  "}
        <span style={{ textTransform: "capitalize" }}>{date}</span>
      </p>
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <button
        onClick={onSettings}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "9px 18px",
          background: "rgba(255,255,255,0.07)",
          color: COLORS.border,
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 10,
          fontWeight: 600,
          fontSize: 13.5,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
      >
        <Icons.Settings /> Paramètres
      </button>

      <button
        onClick={onLogout}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "9px 18px",
          background: "rgba(255,255,255,0.07)",
          color: COLORS.border,
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 10,
          fontWeight: 600,
          fontSize: 13.5,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
      >
        <Icons.Logout /> Déconnexion
      </button>
    </div>
  </div>
));

Header.displayName = "Header";

// Composant Selecteur de Priorité pour IT Consultant
const PrioritySelector = React.memo(({ currentPriority, onPriorityChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const priorities = ["Haute", "Moyenne", "Basse"];

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "0",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <Badge config={PRIORITY_CONFIG[currentPriority]} />
        <Icons.Edit />
      </button>

      {isOpen && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 998,
            }}
            onClick={() => setIsOpen(false)}
          />
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: 8,
            background: COLORS.white,
            borderRadius: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            border: `1px solid ${COLORS.border}`,
            zIndex: 999,
            minWidth: 120,
          }}>
            {priorities.map(priority => (
              <button
                key={priority}
                onClick={() => {
                  onPriorityChange(priority);
                  setIsOpen(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.2s",
                  borderRadius: 10,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = COLORS.background}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <Badge config={PRIORITY_CONFIG[priority]} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

PrioritySelector.displayName = "PrioritySelector";

// ============================================
// MAIN COMPONENT
// ============================================

const COLUMNS = [
  { key: "id", label: "#", sortable: true },
  { key: "titre", label: "Titre", sortable: true },
  { key: "utilisateur", label: "Utilisateur", sortable: true },
  { key: "dateCreation", label: "Date", sortable: true },
  { key: "priorite", label: "Priorité", sortable: true },
  { key: "scoreConfiance", label: "Score IA", sortable: true },
  { key: "status", label: "Statut", sortable: true },
  { key: "actions", label: "Actions", sortable: false },
];

function UnifiedDashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [modalState, setModalState] = useState({
    isOpen: false,
    ticket: null,
    prediction: null,
    loading: false,
    error: null,
  });

  // Récupérer le rôle depuis localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  // Charger les tickets depuis l'API
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await API.get('/tickets/my');
      const ticketsData = response.data;
      
      // Convertir les tickets du format API vers le format d'affichage
      const formattedTickets = ticketsData.map((ticket, index) => ({
        id: ticket._id,
        titre: ticket.titre,
        utilisateur: "Consultant", // À améliorer avec le nom réel
        dateCreation: ticket.dateCreation,
        priorite: mapPriorityToDisplay(ticket.priorite),
        scoreConfiance: ticket.scoreConfiance || 0.75,
        status: ticket.status || "En attente"
      }));
      
      setTickets(formattedTickets);
    } catch (error) {
      console.error("Erreur lors du chargement des tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const isITConsultant = role === "it_consultant" || role === "Consultant IT" || role === "it";
  const currentDate = useMemo(() => 
    new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }), 
  []);

  // Calcul des statistiques
  const stats = useMemo(() => ({
    total: tickets.length,
    resolved: tickets.filter(t => t.status === "Résolu").length,
    pending: tickets.filter(t => ["En attente", "En cours"].includes(t.status)).length,
    resolutionRate: tickets.length > 0 
      ? Math.round((tickets.filter(t => t.status === "Résolu").length / tickets.length) * 100)
      : 0,
  }), [tickets]);

  // Filtrage et tri des tickets
  const filteredAndSortedTickets = useMemo(() => {
    let result = [...tickets];
    
    // Filtrage
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(t =>
        t.utilisateur.toLowerCase().includes(searchLower) ||
        t.titre.toLowerCase().includes(searchLower)
      );
    }
    
    // Tri
    const { key, direction } = sortConfig;
    if (key && key !== 'actions') {
      result.sort((a, b) => {
        let aVal = a[key];
        let bVal = b[key];
        
        if (typeof aVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        
        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [tickets, search, sortConfig]);

  // Handlers
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
  }, [navigate]);

  const handleSettings = useCallback(() => {
    navigate("/settings");
  }, [navigate]);

  const handleSort = useCallback((key) => {
    if (key === 'actions') return;
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handlePriorityChange = useCallback(async (ticketId, newPriority) => {
    // Convertir la priorité d'affichage vers le format API
    const priorityMap = {
      'Haute': 'high',
      'Moyenne': 'medium',
      'Basse': 'low'
    };
    
    try {
      await API.patch(`/tickets/${ticketId}/priority`, {
        priority: priorityMap[newPriority]
      });
      
      // Mettre à jour l'état local
      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket.id === ticketId
            ? { ...ticket, priorite: newPriority }
            : ticket
        )
      );
    } catch (error) {
      console.error("Erreur lors du changement de priorité:", error);
    }
  }, []);

  const analyzeTicket = useCallback(async (ticket) => {
    setModalState({
      isOpen: true,
      ticket,
      prediction: null,
      loading: true,
      error: null,
    });
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PREDICT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: ticket.titre }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data = await response.json();
      setModalState(prev => ({ ...prev, prediction: data, loading: false }));
      
    } catch (err) {
      console.error("Erreur d'analyse:", err);
      setModalState(prev => ({
        ...prev,
        error: err.name === 'AbortError' ? "La requête a expiré" : err.message,
        loading: false,
      }));
    }
  }, []);

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      ticket: null,
      prediction: null,
      loading: false,
      error: null,
    });
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.contentWrapper}>
          <div style={{ textAlign: "center", padding: "50px" }}>
            <div style={{
              width: 50,
              height: 50,
              border: `3px solid ${COLORS.border}`,
              borderTop: `3px solid ${COLORS.primary}`,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }} />
            <p style={{ color: COLORS.gray }}>Chargement des tickets...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        
        {/* Header */}
        <Header
          userName={isITConsultant ? "IT Consultant" : "Développeur"}
          date={currentDate}
          onLogout={handleLogout}
          onSettings={handleSettings}
        />

        {/* Cartes statistiques */}
        <div style={styles.statsGrid}>
          <StatCard
            icon={Icons.Ticket}
            label="Total Tickets"
            value={stats.total}
            color={COLORS.primary}
            bg={COLORS.primaryLight}
          />
          <StatCard
            icon={Icons.Check}
            label="Résolus"
            value={stats.resolved}
            color={COLORS.success}
            bg={COLORS.successLight}
          />
          <StatCard
            icon={Icons.Clock}
            label="En attente"
            value={stats.pending}
            color={COLORS.warning}
            bg={COLORS.warningLight}
          />
        </div>

        {/* Tableau des tickets */}
        <div style={styles.card}>
          {/* Toolbar */}
          <div style={{
            padding: "18px 24px",
            borderBottom: `1px solid ${COLORS.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}>
            <span style={{ fontWeight: 600, color: COLORS.dark, fontSize: 14 }}>
              {filteredAndSortedTickets.length} ticket{filteredAndSortedTickets.length !== 1 ? "s" : ""} trouvé{filteredAndSortedTickets.length !== 1 ? "s" : ""}
            </span>

            <div style={{ position: "relative", width: 280 }}>
              <span style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: COLORS.lightGray,
                display: "flex",
                pointerEvents: "none",
              }}>
                <Icons.Search />
              </span>
              <input
                type="text"
                placeholder="Rechercher titre ou utilisateur…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
                onFocus={(e) => e.target.style.borderColor = COLORS.primary}
                onBlur={(e) => e.target.style.borderColor = COLORS.border}
                aria-label="Rechercher un ticket"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: COLORS.border,
                    border: "none",
                    borderRadius: "50%",
                    width: 18,
                    height: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: COLORS.gray,
                    padding: 0,
                  }}
                  aria-label="Effacer la recherche"
                >
                  <Icons.X />
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13.5,
            }}>
              <thead>
                <tr style={{ background: COLORS.background }}>
                  {COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: COLORS.gray,
                        fontSize: 12,
                        letterSpacing: "0.4px",
                        textTransform: "uppercase",
                        cursor: col.sortable ? "pointer" : "default",
                        userSelect: "none",
                        borderBottom: `1px solid ${COLORS.border}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        {col.label}
                        {col.sortable && (
                          <span style={{
                            color: sortConfig.key === col.key ? COLORS.primary : COLORS.lightGray,
                          }}>
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
                    <td colSpan={8} style={{
                      padding: "48px 0",
                      textAlign: "center",
                      color: COLORS.lightGray,
                      fontSize: 14,
                    }}>
                      Aucun ticket trouvé pour « {search} »
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedTickets.map((ticket, index) => (
                    <tr
                      key={ticket.id}
                      style={{
                        background: index % 2 === 0 ? COLORS.white : "#fafafa",
                        transition: "background 0.2s ease",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = COLORS.primaryLight}
                      onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? COLORS.white : "#fafafa"}
                    >
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 26,
                          height: 26,
                          background: COLORS.primaryLight,
                          color: COLORS.primary,
                          borderRadius: 6,
                          fontWeight: 700,
                          fontSize: 12,
                        }}>
                          {typeof ticket.id === 'string' ? ticket.id.slice(-4) : ticket.id}
                        </span>
                      </td>

                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${COLORS.border}`, fontWeight: 500, color: COLORS.dark }}>
                        {ticket.titre}
                      </td>

                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: COLORS.white,
                            fontSize: 11,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}>
                            {ticket.utilisateur[0]}
                          </div>
                          <span style={{ color: COLORS.dark, fontWeight: 500 }}>{ticket.utilisateur}</span>
                        </div>
                      </td>

                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.gray, fontSize: 13 }}>
                        {formatDate(ticket.dateCreation)}
                      </td>

                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
                        <PrioritySelector
                          currentPriority={ticket.priorite}
                          onPriorityChange={(newPriority) => handlePriorityChange(ticket.id, newPriority)}
                        />
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${COLORS.border}`, minWidth: 130 }}>
                        <ScoreBar score={ticket.scoreConfiance} />
                      </td>

                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
                        <Badge config={STATUS_CONFIG[ticket.status]} />
                      </td>

                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
                        <button
                          onClick={() => analyzeTicket(ticket)}
                          style={{
                            ...styles.button.primary,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "6px 12px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = "0.88"}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                          aria-label={`Analyser le ticket`}
                        >
                          <Icons.AI />
                          Analyser
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div style={{
            padding: "12px 24px",
            borderTop: `1px solid ${COLORS.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}>
            <span style={{ fontSize: 12.5, color: COLORS.lightGray }}>
              Affichage de {filteredAndSortedTickets.length} sur {tickets.length} tickets
            </span>
            <span style={{ fontSize: 12, color: COLORS.lightGray }}>
              Cliquez sur Analyser pour la prédiction IA
            </span>
          </div>
        </div>

        {/* Modal */}
        {modalState.isOpen && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}>
            <div style={{
              background: COLORS.white,
              borderRadius: 18,
              padding: 28,
              maxWidth: 450,
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.dark, margin: 0 }}>
                  Analyse IA du Ticket #{typeof modalState.ticket?.id === 'string' ? modalState.ticket.id.slice(-4) : modalState.ticket?.id}
                </h2>
                <button
                  onClick={closeModal}
                  style={styles.button.ghost}
                  aria-label="Fermer"
                >
                  <Icons.X />
                </button>
              </div>

              {modalState.loading ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    border: `3px solid ${COLORS.border}`,
                    borderTop: `3px solid ${COLORS.primary}`,
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    margin: "0 auto 16px",
                  }} />
                  <p style={{ color: COLORS.gray }}>Analyse en cours...</p>
                </div>
              ) : modalState.error ? (
                <div style={{
                  background: COLORS.errorLight,
                  color: COLORS.error,
                  padding: 16,
                  borderRadius: 10,
                  marginBottom: 16,
                }}>
                  <p style={{ margin: 0, fontSize: 14 }}>❌ {modalState.error}</p>
                </div>
              ) : modalState.prediction && (
                <>
                  <div style={{
                    background: COLORS.background,
                    borderRadius: 12,
                    padding: 20,
                    marginBottom: 20,
                  }}>
                    <p style={{ margin: "0 0 12px 0", fontSize: 14, color: COLORS.gray }}>
                      <strong>Titre:</strong> {modalState.ticket?.titre}
                    </p>
                    
                    <div style={{ marginBottom: 16 }}>
                      <p style={{ fontSize: 13, color: COLORS.gray, marginBottom: 6 }}>
                        Catégorie prédite:
                      </p>
                      <div style={{
                        background: COLORS.primaryLight,
                        color: COLORS.primary,
                        padding: "10px 16px",
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: 16,
                      }}>
                        {modalState.prediction.prediction || modalState.prediction.category}
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <p style={{ fontSize: 13, color: COLORS.gray, marginBottom: 6 }}>
                        Niveau de confiance:
                      </p>
                      <ScoreBar score={modalState.prediction.confidence || 0.75} />
                    </div>
                  </div>

                  <div style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: "flex-end",
                  }}>
                    <button
                      onClick={closeModal}
                      style={{
                        ...styles.button.secondary,
                        padding: "10px 20px",
                        borderRadius: 8,
                        fontSize: 14,
                      }}
                    >
                      Fermer
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default React.memo(UnifiedDashboard);