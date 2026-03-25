import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Ajout de l'import pour la navigation

const TICKETS_DATA = [
  { id: 1, titre: "Problème réseau", utilisateur: "Ahmed", dateCreation: "2026-03-03T14:32:00", priorite: "Haute", scoreConfiance: 0.92, status: "En attente" },
  { id: 2, titre: "Erreur serveur", utilisateur: "Sara", dateCreation: "2026-03-02T10:15:00", priorite: "Moyenne", scoreConfiance: 0.75, status: "Résolu" },
  { id: 3, titre: "Installation logiciel", utilisateur: "Youssef", dateCreation: "2026-03-01T09:20:00", priorite: "Basse", scoreConfiance: 0.60, status: "En attente" },
  { id: 4, titre: "Accès refusé VPN", utilisateur: "Lina", dateCreation: "2026-03-01T11:05:00", priorite: "Haute", scoreConfiance: 0.88, status: "En cours" },
  { id: 5, titre: "Mise à jour OS", utilisateur: "Karim", dateCreation: "2026-02-28T16:45:00", priorite: "Basse", scoreConfiance: 0.55, status: "Résolu" },
];

const PRIORITY_CONFIG = {
  Haute:   { bg: "#fef2f2", color: "#dc2626", dot: "#dc2626" },
  Moyenne: { bg: "#fffbeb", color: "#d97706", dot: "#f59e0b" },
  Basse:   { bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e" },
};

const STATUS_CONFIG = {
  "En attente": { bg: "#fffbeb", color: "#b45309", dot: "#f59e0b" },
  "En cours":   { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" },
  "Résolu":     { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" },
};

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronIcon = ({ dir }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: dir === "down" ? "rotate(180deg)" : "none" }}>
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const TicketIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
  </svg>
);

const AIIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10 10 10 0 0 1-10-10 10 10 0 0 1 10-10z" />
    <path d="M12 6v6l4 2" />
  </svg>
);

// Icône pour le bouton retour
const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

function Badge({ config, label }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: config.bg, color: config.color,
      fontSize: 12, fontWeight: 600, padding: "4px 10px",
      borderRadius: 20, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: config.dot, flexShrink: 0 }} />
      {label}
    </span>
  );
}

function ScoreBar({ score }) {
  const pct = Math.round(score * 100);
  const color = score > 0.8 ? "#22c55e" : score > 0.5 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 5, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 34 }}>{pct}%</span>
    </div>
  );
}

const COLUMNS = [
  { key: "id",             label: "#" },
  { key: "titre",          label: "Titre" },
  { key: "utilisateur",    label: "Utilisateur" },
  { key: "dateCreation",   label: "Date" },
  { key: "priorite",       label: "Priorité" },
  { key: "scoreConfiance", label: "Score IA" },
  { key: "status",         label: "Statut" },
  { key: "actions",        label: "Actions" },
];

export default function Tickets() {
  const navigate = useNavigate(); // Hook de navigation React Router
  
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tickets, setTickets] = useState(TICKETS_DATA);

  const API_URL = 'http://localhost:5000';

  // Fonction pour retourner à la page Dashboard
  const handleGoBack = () => {
    navigate('/dashboard'); // Redirige vers la page Dashboard
    // Si votre route est différente, utilisez par exemple:
    // navigate('/'); pour la racine
    // navigate('/accueil'); pour la page d'accueil
  };

  const analyzeTicket = async (ticket) => {
    setLoading(true);
    setSelectedTicket(ticket);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: ticket.titre })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data = await response.json();
      setPrediction(data);
      
    } catch (err) {
      console.error("Erreur d'analyse:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestedPriority = (category) => {
    const priorityMap = {
      'reseau': 'Haute',
      'serveur': 'Haute',
      'securite': 'Haute',
      'vpn': 'Haute',
      'logiciel': 'Moyenne',
      'installation': 'Moyenne',
      'mise à jour': 'Basse',
      'os': 'Basse'
    };
    
    const categoryLower = category?.toLowerCase() || '';
    for (const [key, priority] of Object.entries(priorityMap)) {
      if (categoryLower.includes(key)) {
        return priority;
      }
    }
    return 'Moyenne';
  };

  const handleApply = () => {
    if (!selectedTicket || !prediction) return;

    const newPriority = getSuggestedPriority(prediction.category);

    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === selectedTicket.id) {
        return {
          ...ticket,
          priorite: newPriority,
          scoreConfiance: prediction.confidence
        };
      }
      return ticket;
    });

    setTickets(updatedTickets);

    console.log(`✅ Ticket #${selectedTicket.id} mis à jour`);
    console.log(`   Nouvelle priorité: ${newPriority}`);
    console.log(`   Catégorie: ${prediction.category}`);
    console.log(`   Confiance: ${Math.round(prediction.confidence * 100)}%`);

    alert(
      `✅ Mise à jour effectuée\n\n` +
      `Ticket #${selectedTicket.id}\n` +
      `Titre: ${selectedTicket.titre}\n` +
      `Nouvelle priorité: ${newPriority}\n` +
      `Catégorie: ${prediction.category}\n` +
      `Confiance: ${Math.round(prediction.confidence * 100)}%`
    );

    setSelectedTicket(null);
    setPrediction(null);
  };

  const handleSort = (key) => {
    if (key === 'actions') return;
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = tickets
    .filter((t) =>
      t.utilisateur.toLowerCase().includes(search.toLowerCase()) ||
      t.titre.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let va = a[sortKey];
      let vb = b[sortKey];
      if (typeof va === "string") {
        va = va.toLowerCase();
        vb = vb.toLowerCase();
      }
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      return 0;
    });

  const stats = [
    { label: "Total tickets",  value: tickets.length, color: "#6366f1" },
    { label: "En attente",     value: tickets.filter((t) => t.status === "En attente").length, color: "#d97706" },
    { label: "En cours",       value: tickets.filter((t) => t.status === "En cours").length, color: "#1d4ed8" },
    { label: "Résolus",        value: tickets.filter((t) => t.status === "Résolu").length, color: "#15803d" },
  ];

  return (
    <div style={{
      minHeight: "100vh", padding: "36px 24px",
      background: "linear-gradient(135deg,#f0f4ff 0%,#fafafa 100%)",
      fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif",
    }}>
      <div style={{ maxWidth: 1150, margin: "0 auto" }}>

        {/* Header avec bouton retour */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
              }}>
                <TicketIcon />
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: "-0.4px" }}>
                Gestion des Tickets
              </h1>
            </div>
            
            {/* Bouton de retour au Dashboard */}
          <button
            onClick={handleGoBack}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
              border: "1px solid #e2e8f0",
              padding: "8px 18px",
              borderRadius: 30,
              fontSize: 13.5,
              fontWeight: 500,
              color: "#334155",
              cursor: "pointer",
              transition: "all 0.25s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.boxShadow = "0 6px 14px rgba(99, 102, 241, 0.25)";
              e.currentTarget.style.transform = "scale(1.02)";
              
              const icon = e.currentTarget.querySelector('svg');
              if (icon) {
                icon.style.stroke = "white";
                icon.style.transform = "translateX(-4px)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)";
              e.currentTarget.style.color = "#334155";
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.03)";
              e.currentTarget.style.transform = "scale(1)";
              
              const icon = e.currentTarget.querySelector('svg');
              if (icon) {
                icon.style.stroke = "currentColor";
                icon.style.transform = "translateX(0)";
              }
            }}
          >
            <ArrowLeftIcon />
            <span style={{ fontWeight: 600, letterSpacing: "-0.2px" }}>Dashboard</span>
            <span style={{ 
              fontSize: 12, 
              opacity: 0.7,
              display: "inline-flex",
              alignItems: "center",
            }}>⌘</span>
          </button>
          </div>
          <p style={{ color: "#64748b", fontSize: 13.5, margin: 0 }}>
            Suivez et gérez les tickets d'assistance avec analyse IA en temps réel.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
          {stats.map(({ label, value, color }) => (
            <div key={label} style={{
              background: "#fff", borderRadius: 14, padding: "16px 20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)",
              borderTop: `3px solid ${color}`,
            }}>
              <div style={{ fontSize: 26, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: 12.5, color: "#64748b", fontWeight: 500, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div style={{
          background: "#fff", borderRadius: 18,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 24px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}>

          {/* Toolbar */}
          <div style={{
            padding: "18px 24px", borderBottom: "1px solid #f1f5f9",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontWeight: 600, color: "#0f172a", fontSize: 14 }}>
              {filtered.length} ticket{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
            </span>

            {/* Search Bar */}
            <div style={{ position: "relative", width: 280 }}>
              <span style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                color: "#94a3b8", display: "flex", pointerEvents: "none",
              }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Rechercher titre ou utilisateur…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%", padding: "9px 36px 9px 38px",
                  border: "1.5px solid #e2e8f0", borderRadius: 10,
                  fontSize: 13.5, color: "#0f172a", outline: "none",
                  background: "#f8fafc", boxSizing: "border-box",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#6366f1"; }}
                onBlur={(e)  => { e.target.style.borderColor = "#e2e8f0"; }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{
                    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                    background: "#e2e8f0", border: "none", borderRadius: "50%",
                    width: 18, height: 18, display: "flex", alignItems: "center",
                    justifyContent: "center", cursor: "pointer", color: "#64748b", padding: 0,
                  }}
                >
                  <XIcon />
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      style={{
                        padding: "12px 16px", textAlign: "left",
                        fontWeight: 600, color: col.key === 'actions' ? "#475569" : "#475569",
                        fontSize: 12, letterSpacing: "0.4px", textTransform: "uppercase",
                        cursor: col.key === 'actions' ? "default" : "pointer",
                        userSelect: "none", borderBottom: "1px solid #e2e8f0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        {col.label}
                        {col.key !== 'actions' && (
                          <span style={{ color: sortKey === col.key ? "#6366f1" : "#cbd5e1" }}>
                            <ChevronIcon dir={sortKey === col.key && sortDir === "desc" ? "down" : "up"} />
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: "48px 0", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                      Aucun ticket trouvé pour « {search} »
                    </td>
                  </tr>
                ) : (
                  filtered.map((ticket, i) => (
                    <tr
                      key={ticket.id}
                      style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#f0f4ff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafafa"; }}
                    >
                      <td style={{ padding: "13px 16px", borderBottom: "1px solid #f1f5f9" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: 26, height: 26, background: "#eef2ff", color: "#6366f1",
                          borderRadius: 6, fontWeight: 700, fontSize: 12,
                        }}>
                          {ticket.id}
                        </span>
                      </td>

                      <td style={{ padding: "13px 16px", borderBottom: "1px solid #f1f5f9", fontWeight: 500, color: "#0f172a" }}>
                        {ticket.titre}
                      </td>

                      <td style={{ padding: "13px 16px", borderBottom: "1px solid #f1f5f9" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: "50%",
                            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0,
                          }}>
                            {ticket.utilisateur[0]}
                          </div>
                          <span style={{ color: "#374151", fontWeight: 500 }}>{ticket.utilisateur}</span>
                        </div>
                      </td>

                      <td style={{ padding: "13px 16px", borderBottom: "1px solid #f1f5f9", color: "#64748b", fontSize: 13 }}>
                        {new Date(ticket.dateCreation).toLocaleString("fr-FR", {
                          day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                        })}
                      </td>

                      <td style={{ padding: "13px 16px", borderBottom: "1px solid #f1f5f9" }}>
                        <Badge config={PRIORITY_CONFIG[ticket.priorite]} label={ticket.priorite} />
                      </td>

                      <td style={{ padding: "13px 16px", borderBottom: "1px solid #f1f5f9", minWidth: 130 }}>
                        <ScoreBar score={ticket.scoreConfiance} />
                      </td>

                      <td style={{ padding: "13px 16px", borderBottom: "1px solid #f1f5f9" }}>
                        <Badge config={STATUS_CONFIG[ticket.status]} label={ticket.status} />
                      </td>

                      <td style={{ padding: "13px 16px", borderBottom: "1px solid #f1f5f9" }}>
                        <button
                          onClick={() => analyzeTicket(ticket)}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            background: "#6366f1", color: "#fff", border: "none",
                            padding: "6px 12px", borderRadius: 8, fontSize: 12,
                            fontWeight: 500, cursor: "pointer",
                          }}
                        >
                          <AIIcon />
                          Analyser
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div style={{
            padding: "12px 24px", borderTop: "1px solid #f1f5f9",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 12.5, color: "#94a3b8" }}>
              Affichage de {filtered.length} sur {tickets.length} tickets
            </span>
            <span style={{ fontSize: 12, color: "#cbd5e1" }}>
              Cliquez sur Analyser pour la prédiction IA
            </span>
          </div>
        </div>

        {/* Modal de prédiction IA */}
        {selectedTicket && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)", display: "flex",
            alignItems: "center", justifyContent: "center", zIndex: 1000
          }}>
            <div style={{
              background: "#fff", borderRadius: 18, padding: 28,
              maxWidth: 450, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                  Analyse IA du Ticket #{selectedTicket.id}
                </h2>
                <button
                  onClick={() => {
                    setSelectedTicket(null);
                    setPrediction(null);
                    setError(null);
                  }}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#94a3b8", padding: 4
                  }}
                >
                  <XIcon />
                </button>
              </div>

              {loading ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{
                    width: 40, height: 40, border: "3px solid #f3f3f3",
                    borderTop: "3px solid #6366f1", borderRadius: "50%",
                    animation: "spin 1s linear infinite", margin: "0 auto 16px"
                  }} />
                  <p style={{ color: "#64748b" }}>Analyse en cours...</p>
                </div>
              ) : error ? (
                <div style={{
                  background: "#fef2f2", color: "#dc2626",
                  padding: 16, borderRadius: 10, marginBottom: 16
                }}>
                  <p style={{ margin: 0, fontSize: 14 }}>❌ {error}</p>
                </div>
              ) : prediction && (
                <div>
                  <div style={{
                    background: "#f8fafc", borderRadius: 12,
                    padding: 20, marginBottom: 20
                  }}>
                    <p style={{ margin: "0 0 12px 0", fontSize: 14, color: "#475569" }}>
                      <strong>Titre:</strong> {selectedTicket.titre}
                    </p>
                    
                    <div style={{ marginBottom: 16 }}>
                      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>
                        Catégorie prédite:
                      </p>
                      <div style={{
                        background: "#eef2ff", color: "#6366f1",
                        padding: "10px 16px", borderRadius: 8,
                        fontWeight: 700, fontSize: 16
                      }}>
                        {prediction.category}
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>
                        Niveau de confiance:
                      </p>
                      <ScoreBar score={prediction.confidence} />
                    </div>

                    <div>
                      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>
                        Priorité suggérée:
                      </p>
                      <Badge 
                        config={PRIORITY_CONFIG[getSuggestedPriority(prediction.category)]} 
                        label={getSuggestedPriority(prediction.category)} 
                      />
                    </div>
                  </div>

                  <div style={{
                    display: "flex", gap: 12, justifyContent: "flex-end"
                  }}>
                    <button
                      onClick={() => {
                        setSelectedTicket(null);
                        setPrediction(null);
                      }}
                      style={{
                        padding: "10px 20px", background: "#f1f5f9",
                        border: "none", borderRadius: 8, fontSize: 14,
                        color: "#475569", cursor: "pointer"
                      }}
                    >
                      Fermer
                    </button>
                    <button
                      onClick={handleApply}
                      style={{
                        padding: "10px 20px", background: "#6366f1",
                        border: "none", borderRadius: 8, fontSize: 14,
                        color: "#fff", cursor: "pointer"
                      }}
                    >
                      Appliquer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}