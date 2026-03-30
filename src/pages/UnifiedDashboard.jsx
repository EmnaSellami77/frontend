import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================

const INITIAL_TICKETS_DATA = [
  { id: 1, titre: "Problème réseau", utilisateur: "Ahmed", dateCreation: "2026-03-03T14:32:00", priorite: "Haute", scoreConfiance: 0.92, status: "En attente" },
  { id: 2, titre: "Erreur serveur", utilisateur: "Sara", dateCreation: "2026-03-02T10:15:00", priorite: "Moyenne", scoreConfiance: 0.75, status: "Résolu" },
  { id: 3, titre: "Installation logiciel", utilisateur: "Youssef", dateCreation: "2026-03-01T09:20:00", priorite: "Basse", scoreConfiance: 0.60, status: "En attente" },
  { id: 4, titre: "Accès refusé VPN", utilisateur: "Lina", dateCreation: "2026-03-01T11:05:00", priorite: "Haute", scoreConfiance: 0.88, status: "En cours" },
  { id: 5, titre: "Mise à jour OS", utilisateur: "Karim", dateCreation: "2026-02-28T16:45:00", priorite: "Basse", scoreConfiance: 0.55, status: "Résolu" },
];

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
// CUSTOM HOOKS
// ============================================

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
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

const getSuggestedPriority = (category) => {
  const priorityMap = {
    'reseau': 'Haute', 'serveur': 'Haute', 'securite': 'Haute', 'vpn': 'Haute',
    'logiciel': 'Moyenne', 'installation': 'Moyenne',
    'mise à jour': 'Basse', 'os': 'Basse'
  };
  
  const categoryLower = category?.toLowerCase() || '';
  for (const [key, priority] of Object.entries(priorityMap)) {
    if (categoryLower.includes(key)) return priority;
  }
  return 'Moyenne';
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

  Plus: React.memo(() => (
    <IconWrapper size={16}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </IconWrapper>
  )),
};

Object.values(Icons).forEach(icon => {
  if (icon.displayName === undefined) {
    icon.displayName = `Icon${icon.name || 'Component'}`;
  }
});

// ============================================
// STYLED COMPONENTS
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

const Footer = React.memo(() => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  
  const links = [
    { label: "À propos", path: "/about" },
    { label: "Support", path: "/support" },
    { label: "Confidentialité", path: "/privacy" },
    { label: "Conditions", path: "/terms" },
  ];
  
  return (
    <footer style={{
      marginTop: 40,
      padding: "24px 0",
      borderTop: `1px solid ${COLORS.border}`,
      textAlign: "center",
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
      }}>
        <div style={{ fontSize: 13, color: COLORS.gray }}>
          © {currentYear} IT Dashboard. Tous droits réservés.
        </div>
        
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {links.map(({ label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                fontSize: 13,
                color: COLORS.gray,
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "color 0.2s",
                padding: 0,
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = COLORS.primary}
              onMouseLeave={(e) => e.currentTarget.style.color = COLORS.gray}
            >
              {label}
            </button>
          ))}
        </div>
        
        <div style={{ fontSize: 13, color: COLORS.gray }}>
          Version 2.0.1
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

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
  const [role] = useLocalStorage("role", null);
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [modalState, setModalState] = useState({
    isOpen: false,
    ticket: null,
    prediction: null,
    loading: false,
    error: null,
  });

  // Charger les tickets depuis le localStorage
  useEffect(() => {
    const loadTickets = () => {
      try {
        // Récupérer les tickets stockés
        const storedTickets = localStorage.getItem('tickets');
        if (storedTickets) {
          const parsedTickets = JSON.parse(storedTickets);
          setTickets(parsedTickets);
        } else {
          // Si aucun ticket n'est stocké, utiliser les données initiales
          setTickets(INITIAL_TICKETS_DATA);
          localStorage.setItem('tickets', JSON.stringify(INITIAL_TICKETS_DATA));
        }
      } catch (error) {
        console.error("Erreur lors du chargement des tickets:", error);
        setTickets(INITIAL_TICKETS_DATA);
      }
    };

    loadTickets();

    // Écouter les changements dans le localStorage (pour les mises à jour depuis l'espace développeur)
    const handleStorageChange = (e) => {
      if (e.key === 'tickets') {
        try {
          const newTickets = JSON.parse(e.newValue);
          setTickets(newTickets);
        } catch (error) {
          console.error("Erreur lors de la mise à jour des tickets:", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Sauvegarder les tickets dans le localStorage à chaque modification
  useEffect(() => {
    if (tickets.length > 0) {
      localStorage.setItem('tickets', JSON.stringify(tickets));
    }
  }, [tickets]);

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
    localStorage.removeItem("role");
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

  const handleApplyPrediction = useCallback(() => {
    const { ticket, prediction } = modalState;
    if (!ticket || !prediction) return;

    const newPriority = getSuggestedPriority(prediction.category);

    setTickets(prevTickets =>
      prevTickets.map(t =>
        t.id === ticket.id
          ? { ...t, priorite: newPriority, scoreConfiance: prediction.confidence }
          : t
      )
    );

    setModalState({
      isOpen: false,
      ticket: null,
      prediction: null,
      loading: false,
      error: null,
    });
  }, [modalState]);

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      ticket: null,
      prediction: null,
      loading: false,
      error: null,
    });
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        
        {/* Header */}
        <Header
          userName={role === "developer" ? "Développeur" : "Consultant IT"}
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
                          {ticket.id}
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
                        <Badge config={PRIORITY_CONFIG[ticket.priorite]} />
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
                          aria-label={`Analyser le ticket ${ticket.id}`}
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
                  Analyse IA du Ticket #{modalState.ticket?.id}
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
                        {modalState.prediction.category}
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <p style={{ fontSize: 13, color: COLORS.gray, marginBottom: 6 }}>
                        Niveau de confiance:
                      </p>
                      <ScoreBar score={modalState.prediction.confidence} />
                    </div>

                    <div>
                      <p style={{ fontSize: 13, color: COLORS.gray, marginBottom: 6 }}>
                        Priorité suggérée:
                      </p>
                      <Badge config={PRIORITY_CONFIG[getSuggestedPriority(modalState.prediction.category)]} />
                    </div>
                  </div>

                  <div style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: "flex-end",
                    flexWrap: "wrap",
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
                    <button
                      onClick={handleApplyPrediction}
                      style={{
                        ...styles.button.primary,
                        padding: "10px 20px",
                        borderRadius: 8,
                        fontSize: 14,
                      }}
                    >
                      Appliquer
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <Footer />
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