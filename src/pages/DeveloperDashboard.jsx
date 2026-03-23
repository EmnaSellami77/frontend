import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function DeveloperDashboard() {
  const navigate = useNavigate();

  const [problem, setProblem] = useState("");
  const [type, setType] = useState("");

  const [stats, setStats] = useState({
    frontend: 0,
    backend: 0,
    database: 0,
    devops: 0,
  });

  const handleAnalyze = () => {
    if (!problem || !type) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    // Mise à jour statistiques
    setStats({
      ...stats,
      [type]: stats[type] + 1,
    });

    setProblem("");
    setType("");
  };

  const handleSettings = () => {
    navigate("/developer/settings");
  };

  const handleLogout = () => {
    navigate("/");
  };

  const chartData = {
    labels: ["Frontend", "Backend", "Database", "DevOps"],
    datasets: [
      {
        label: "Nombre de tickets",
        data: [
          stats.frontend,
          stats.backend,
          stats.database,
          stats.devops,
        ],
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#8b5cf6",
          "#f59e0b",
        ],
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#e5e7eb",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div style={styles.page}>
      {/* Header avec dégradé */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <svg style={styles.logoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <h2 style={styles.title}>Developer Dashboard</h2>
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
        {/* FORMULAIRE */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <svg style={styles.cardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <h3 style={styles.cardTitle}>Créer un nouveau ticket</h3>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              Type de problème
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={styles.select}
            >
              <option value="">-- Sélectionner un type --</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="database">Database</option>
              <option value="devops">DevOps</option>
            </select>
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
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              style={styles.textarea}
              placeholder="Décrivez votre problème en détail..."
              rows="4"
            />
          </div>

          <button onClick={handleAnalyze} style={styles.button}>
            <svg style={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Envoyer le ticket
          </button>
        </div>

        {/* STATISTIQUES */}
        <div style={styles.statsCard}>
          <div style={styles.statsHeader}>
            <svg style={styles.statsIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7" />
              <polyline points="15 2 21 8 15 8" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <h3 style={styles.statsTitle}>Statistiques des tickets</h3>
          </div>
          
          <div style={styles.chartContainer}>
            <Bar data={chartData} options={chartOptions} />
          </div>

          {/* Résumé des tickets */}
          <div style={styles.summaryContainer}>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Total tickets</span>
              <span style={styles.summaryValue}>
                {stats.frontend + stats.backend + stats.database + stats.devops}
              </span>
            </div>
            <div style={styles.summaryDivider} />
            <div style={styles.summaryGrid}>
              <div style={styles.summaryGridItem}>
                <span style={{...styles.summaryDot, backgroundColor: '#3b82f6'}} />
                <span style={styles.summaryGridLabel}>Frontend</span>
                <span style={styles.summaryGridValue}>{stats.frontend}</span>
              </div>
              <div style={styles.summaryGridItem}>
                <span style={{...styles.summaryDot, backgroundColor: '#10b981'}} />
                <span style={styles.summaryGridLabel}>Backend</span>
                <span style={styles.summaryGridValue}>{stats.backend}</span>
              </div>
              <div style={styles.summaryGridItem}>
                <span style={{...styles.summaryDot, backgroundColor: '#8b5cf6'}} />
                <span style={styles.summaryGridLabel}>Database</span>
                <span style={styles.summaryGridValue}>{stats.database}</span>
              </div>
              <div style={styles.summaryGridItem}>
                <span style={{...styles.summaryDot, backgroundColor: '#f59e0b'}} />
                <span style={styles.summaryGridLabel}>DevOps</span>
                <span style={styles.summaryGridValue}>{stats.devops}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
    padding: "30px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    padding: "20px 30px",
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    borderRadius: "16px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02)",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoIcon: {
    width: "32px",
    height: "32px",
    color: "#60a5fa",
    stroke: "currentColor",
  },
  title: {
    margin: 0,
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: "-0.5px",
  },
  settingsButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "0.95rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    backdropFilter: "blur(10px)",
  },
  settingsIcon: {
    width: "18px",
    height: "18px",
    stroke: "currentColor",
  },
  logout: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "0.95rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    backdropFilter: "blur(10px)",
  },
  logoutIcon: {
    width: "18px",
    height: "18px",
    stroke: "currentColor",
  },
  container: {
    display: "flex",
    gap: "30px",
    marginTop: "10px",
  },
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "25px",
  },
  cardIcon: {
    width: "28px",
    height: "28px",
    color: "#3b82f6",
    stroke: "currentColor",
  },
  cardTitle: {
    margin: 0,
    fontSize: "1.4rem",
    fontWeight: "600",
    color: "#1e293b",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "8px",
    fontSize: "0.95rem",
    fontWeight: "500",
    color: "#475569",
  },
  labelIcon: {
    width: "16px",
    height: "16px",
    stroke: "#94a3b8",
  },
  select: {
    width: "100%",
    padding: "12px 16px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "0.95rem",
    color: "#1e293b",
    outline: "none",
    transition: "all 0.2s ease",
    cursor: "pointer",
  },
  textarea: {
    width: "100%",
    padding: "12px 16px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "0.95rem",
    color: "#1e293b",
    resize: "vertical",
    outline: "none",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    border: "none",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
  },
  buttonIcon: {
    width: "18px",
    height: "18px",
    stroke: "currentColor",
  },
  statsCard: {
    width: "500px",
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
  },
  statsHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "25px",
  },
  statsIcon: {
    width: "28px",
    height: "28px",
    color: "#8b5cf6",
    stroke: "currentColor",
  },
  statsTitle: {
    margin: 0,
    fontSize: "1.4rem",
    fontWeight: "600",
    color: "#1e293b",
  },
  chartContainer: {
    height: "250px",
    marginBottom: "25px",
  },
  summaryContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: "16px",
    padding: "20px",
  },
  summaryItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  summaryLabel: {
    fontSize: "1rem",
    color: "#64748b",
  },
  summaryValue: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#1e293b",
  },
  summaryDivider: {
    height: "1px",
    backgroundColor: "#e2e8f0",
    margin: "15px 0",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px",
  },
  summaryGridItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  summaryDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  summaryGridLabel: {
    fontSize: "0.9rem",
    color: "#64748b",
    flex: 1,
  },
  summaryGridValue: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#1e293b",
  },
};