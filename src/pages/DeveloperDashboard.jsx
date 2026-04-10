import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import API from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function DeveloperDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [problem, setProblem] = useState("");
  const [type, setType] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [prevTickets, setPrevTickets] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const fetchTickets = useCallback(async () => {
    try {
      const response = await API.get('/tickets/my');
      const data = response.data;
      const converted = data.map(t => ({
        id: t._id,
        type: t.type_personnalise || "Standard",
        description: t.titre,
        date: new Date(t.dateCreation).toLocaleString(),
        priority: t.priorite,
        status: t.status || "En attente",
        scoreConfiance: t.scoreConfiance || 0.75
      }));
      
      // Détection des tickets nouvellement résolus (pour notification)
      const newResolved = converted.filter(t => 
        t.status === "Résolu" && 
        prevTickets.find(prev => prev.id === t.id)?.status !== "Résolu"
      );
      
      newResolved.forEach(ticket => {
        toast.success(`✅ Ticket "${ticket.type}" (${ticket.id.slice(-4)}) a été marqué comme RÉSOLU par l’équipe IT !`, {
          position: "top-right",
          autoClose: 6000,
        });
      });
      
      setTickets(converted);
      setPrevTickets(converted);
      
      const newStats = {};
      converted.forEach(t => {
        newStats[t.type] = (newStats[t.type] || 0) + 1;
      });
      setStats(newStats);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) navigate("/developer/login");
    }
  }, [prevTickets, navigate]);

  // Chargement initial et polling toutes les 5s
  useEffect(() => {
    fetchTickets();
    const interval = setInterval(() => fetchTickets(), 5000);
    return () => clearInterval(interval);
  }, [fetchTickets]);

  const mapTypeToPriority = (type) => {
    const t = type.toLowerCase();
    if (t.includes("critique") || t.includes("urgent") || t.includes("haute")) return "high";
    if (t.includes("mineur") || t.includes("faible") || t.includes("basse")) return "low";
    return "medium";
  };

  const handleAnalyze = async () => {
    if (!problem || !type) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    try {
      if (editingId) {
        // Mise à jour : envoyer les champs autorisés par le backend
        await API.put(`/tickets/${editingId}`, {
          titre: problem,
          type_personnalise: type,
        });
        toast.info("Ticket modifié avec succès");
      } else {
        // Création
        await API.post('/tickets/create', {
          subject: problem,
          body: problem,
          type_personnalise: type,
        });
        toast.success("Ticket créé avec succès");
      }
      await fetchTickets();
      setProblem("");
      setType("");
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Erreur : " + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (ticket) => {
    setEditingId(ticket.id);
    setType(ticket.type);
    setProblem(ticket.description);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer définitivement ce ticket ?")) return;
    try {
      await API.delete(`/tickets/${id}`);
      toast.warn("Ticket supprimé");
      await fetchTickets();
      if (editingId === id) {
        setEditingId(null);
        setProblem("");
        setType("");
      }
    } catch (err) {
      alert("Erreur suppression : " + err.message);
    }
  };

  const handleSettings = () => navigate("/developer/settings");
  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const categories = Object.keys(stats);
  const values = Object.values(stats);
  const generateColor = (index) => {
    const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#ec489a", "#06b6d4", "#84cc16", "#f97316", "#14b8a6", "#6366f1", "#a855f7"];
    return colors[index % colors.length];
  };

  const chartData = {
    labels: categories,
    datasets: [{ label: "Nombre de tickets", data: values, backgroundColor: categories.map((_, i) => generateColor(i)), borderRadius: 6 }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: "#e5e7eb" }, title: { display: true, text: "Nombre de tickets", color: "#64748b" } },
      x: { grid: { display: false }, title: { display: true, text: "Types de problèmes", color: "#64748b" } },
    },
  };

  const totalTickets = values.reduce((sum, val) => sum + val, 0);

  // Styles (inchangés, identiques à votre version)
  const styles = {
    page: { backgroundColor: "#f9fafb", minHeight: "100vh", padding: "30px", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", padding: "20px 30px", background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", borderRadius: "16px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02)" },
    headerLeft: { display: "flex", alignItems: "center", gap: "20px" },
    headerRight: { display: "flex", alignItems: "center", gap: "12px" },
    logoIcon: { width: "32px", height: "32px", color: "#60a5fa", stroke: "currentColor" },
    title: { margin: 0, fontSize: "1.8rem", fontWeight: "600", color: "#ffffff", letterSpacing: "-0.5px" },
    userInfo: { margin: "5px 0 0 0", fontSize: "0.85rem", color: "#94a3b8" },
    settingsButton: { display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)", borderRadius: "12px", color: "#ffffff", fontSize: "0.95rem", fontWeight: "500", cursor: "pointer", backdropFilter: "blur(10px)" },
    settingsIcon: { width: "18px", height: "18px", stroke: "currentColor" },
    logout: { display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)", borderRadius: "12px", color: "#ffffff", fontSize: "0.95rem", fontWeight: "500", cursor: "pointer", backdropFilter: "blur(10px)" },
    logoutIcon: { width: "18px", height: "18px", stroke: "currentColor" },
    container: { display: "flex", gap: "30px", marginTop: "10px" },
    leftColumn: { flex: 1, display: "flex", flexDirection: "column", gap: "30px" },
    card: { backgroundColor: "#ffffff", padding: "30px", borderRadius: "20px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", border: "1px solid #e5e7eb" },
    cardHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "25px" },
    cardIcon: { width: "28px", height: "28px", color: "#3b82f6", stroke: "currentColor" },
    cardTitle: { margin: 0, fontSize: "1.4rem", fontWeight: "600", color: "#1e293b" },
    formGroup: { marginBottom: "20px" },
    label: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", fontSize: "0.95rem", fontWeight: "500", color: "#475569" },
    labelIcon: { width: "16px", height: "16px", stroke: "#94a3b8" },
    input: { width: "100%", padding: "12px 16px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "0.95rem", color: "#1e293b", outline: "none", fontFamily: "inherit" },
    hint: { display: "flex", alignItems: "center", gap: "6px", marginTop: "6px", fontSize: "0.8rem", color: "#94a3b8" },
    hintIcon: { width: "14px", height: "14px", stroke: "#94a3b8" },
    textarea: { width: "100%", padding: "12px 16px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "0.95rem", color: "#1e293b", resize: "vertical", outline: "none", fontFamily: "inherit" },
    buttonGroup: { display: "flex", gap: "12px" },
    button: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", flex: 1, padding: "14px", background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", border: "none", borderRadius: "12px", color: "#ffffff", fontSize: "1rem", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)" },
    cancelButton: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", flex: 1, padding: "14px", backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "12px", color: "#475569", fontSize: "1rem", fontWeight: "600", cursor: "pointer" },
    buttonIcon: { width: "18px", height: "18px", stroke: "currentColor" },
    ticketsListCard: { backgroundColor: "#ffffff", padding: "30px", borderRadius: "20px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", border: "1px solid #e5e7eb" },
    ticketsHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" },
    ticketsIcon: { width: "28px", height: "28px", color: "#10b981", stroke: "currentColor" },
    ticketsTitle: { margin: 0, fontSize: "1.4rem", fontWeight: "600", color: "#1e293b" },
    ticketsContainer: { display: "flex", flexDirection: "column", gap: "12px", maxHeight: "400px", overflowY: "auto" },
    ticketItem: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "16px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" },
    ticketContent: { flex: 1 },
    ticketHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", flexWrap: "wrap" },
    ticketType: { padding: "4px 12px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "600", color: "#ffffff" },
    ticketDate: { fontSize: "0.8rem", color: "#94a3b8" },
    ticketDescription: { margin: 0, fontSize: "0.9rem", color: "#475569", lineHeight: "1.5" },
    ticketActions: { display: "flex", gap: "8px", marginLeft: "12px" },
    editButton: { padding: "8px", backgroundColor: "#e6f0ff", border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
    deleteButton: { padding: "8px", backgroundColor: "#fee2e2", border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
    actionIcon: { width: "18px", height: "18px", stroke: "currentColor" },
    statsCard: { width: "500px", backgroundColor: "#ffffff", padding: "30px", borderRadius: "20px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", border: "1px solid #e5e7eb", alignSelf: "flex-start" },
    statsHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "25px" },
    statsIcon: { width: "28px", height: "28px", color: "#8b5cf6", stroke: "currentColor" },
    statsTitle: { margin: 0, fontSize: "1.4rem", fontWeight: "600", color: "#1e293b" },
    chartContainer: { height: "250px", marginBottom: "25px" },
    summaryContainer: { backgroundColor: "#f8fafc", borderRadius: "16px", padding: "20px" },
    summaryItem: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" },
    summaryLabel: { fontSize: "1rem", color: "#64748b" },
    summaryValue: { fontSize: "1.5rem", fontWeight: "700", color: "#1e293b" },
    summaryDivider: { height: "1px", backgroundColor: "#e2e8f0", margin: "15px 0" },
    summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "15px" },
    summaryGridItem: { display: "flex", alignItems: "center", gap: "8px" },
    summaryDot: { width: "10px", height: "10px", borderRadius: "50%" },
    summaryGridLabel: { fontSize: "0.9rem", color: "#64748b", flex: 1 },
    summaryGridValue: { fontSize: "1rem", fontWeight: "600", color: "#1e293b" },
    emptyState: { textAlign: "center", padding: "50px 20px", color: "#94a3b8" },
    emptyIcon: { width: "64px", height: "64px", margin: "0 auto 20px", stroke: "#cbd5e1" },
    emptyText: { fontSize: "1rem", fontWeight: "500", color: "#64748b", marginBottom: "8px" },
    emptySubtext: { fontSize: "0.9rem", color: "#94a3b8" },
  };

  return (
    <div style={styles.page}>
      <ToastContainer />
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <svg style={styles.logoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <div>
            <h2 style={styles.title}>Developer Dashboard</h2>
            {currentUser && <p style={styles.userInfo}>Connecté en tant que : {currentUser.name}</p>}
          </div>
        </div>
        <div style={styles.headerRight}>
          <button onClick={handleSettings} style={styles.settingsButton}>
            <svg style={styles.settingsIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09A1.65 1.65 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Paramètres
          </button>
          <button onClick={handleLogout} style={styles.logout}>
            <svg style={styles.logoutIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Déconnexion
          </button>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.leftColumn}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <svg style={styles.cardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <h3 style={styles.cardTitle}>{editingId ? "Modifier le ticket" : "Créer un nouveau ticket"}</h3>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                Type de problème
              </label>
              <input type="text" value={type} onChange={(e) => setType(e.target.value)} style={styles.input} placeholder="Ex: Bug critique, Problème d'interface, Erreur serveur, etc..." />
              <div style={styles.hint}>
                <svg style={styles.hintIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                <span>Écrivez librement le type de problème (sera affiché dans le tableau IT)</span>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                </svg>
                Description
              </label>
              <textarea value={problem} onChange={(e) => setProblem(e.target.value)} style={styles.textarea} placeholder="Décrivez votre problème en détail..." rows="4" />
            </div>

            <div style={styles.buttonGroup}>
              <button onClick={handleAnalyze} style={styles.button}>
                <svg style={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {editingId ? <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" /> : <line x1="22" y1="2" x2="11" y2="13" />}
                  {editingId ? <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" /> : <polygon points="22 2 15 22 11 13 2 9 22 2" />}
                </svg>
                {editingId ? "Mettre à jour" : "Envoyer le ticket"}
              </button>
              {editingId && (
                <button onClick={() => { setEditingId(null); setProblem(""); setType(""); }} style={styles.cancelButton}>
                  <svg style={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Annuler
                </button>
              )}
            </div>
          </div>

          {tickets.length > 0 && (
            <div style={styles.ticketsListCard}>
              <div style={styles.ticketsHeader}>
                <svg style={styles.ticketsIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 12V8H4v4M20 12v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4M20 12h-4a2 2 0 0 0-2 2v4M4 12h4a2 2 0 0 1 2 2v4" />
                </svg>
                <h3 style={styles.ticketsTitle}>Mes tickets ({tickets.length})</h3>
              </div>
              <div style={styles.ticketsContainer}>
                {tickets.map((ticket) => (
                  <div key={ticket.id} style={styles.ticketItem}>
                    <div style={styles.ticketContent}>
                      <div style={styles.ticketHeader}>
                        <span style={{ ...styles.ticketType, backgroundColor: generateColor(categories.indexOf(ticket.type) % 12) }}>{ticket.type}</span>
                        <span style={styles.ticketDate}>{ticket.date}</span>
                      </div>
                      <p style={styles.ticketDescription}>{ticket.description}</p>
                    </div>
                    <div style={styles.ticketActions}>
                      <button onClick={() => handleEdit(ticket)} style={styles.editButton} title="Modifier">
                        <svg style={styles.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
                          <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(ticket.id)} style={styles.deleteButton} title="Supprimer">
                        <svg style={styles.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={styles.statsCard}>
          <div style={styles.statsHeader}>
            <svg style={styles.statsIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7" />
              <polyline points="15 2 21 8 15 8" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <h3 style={styles.statsTitle}>Statistiques par type</h3>
          </div>
          {categories.length > 0 ? (
            <>
              <div style={styles.chartContainer}><Bar data={chartData} options={chartOptions} /></div>
              <div style={styles.summaryContainer}>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>Total tickets</span>
                  <span style={styles.summaryValue}>{totalTickets}</span>
                </div>
                <div style={styles.summaryDivider} />
                <div style={styles.summaryGrid}>
                  {categories.map((category, index) => (
                    <div key={category} style={styles.summaryGridItem}>
                      <span style={{ ...styles.summaryDot, backgroundColor: generateColor(index) }} />
                      <span style={styles.summaryGridLabel}>{category}</span>
                      <span style={styles.summaryGridValue}>{stats[category]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div style={styles.emptyState}>
              <svg style={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7" />
                <polyline points="15 2 21 8 15 8" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <p style={styles.emptyText}>Aucun ticket pour le moment</p>
              <p style={styles.emptySubtext}>Créez votre premier ticket pour voir les statistiques</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}