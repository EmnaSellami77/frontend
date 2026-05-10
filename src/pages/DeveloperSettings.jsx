import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function DeveloperSettings() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [originalData, setOriginalData] = useState({
    username: "",
    email: ""
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/developer/login");
      return;
    }
    try {
      const user = JSON.parse(userStr);
      if (!user._id) {
        navigate("/developer/login");
        return;
      }
      setUserId(user._id);
      const username = user.name || user.username || "";
      const email = user.email || "";
      setFormData(prev => ({
        ...prev,
        username,
        email
      }));
      setOriginalData({ username, email });
    } catch (error) {
      console.error(error);
      navigate("/developer/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setErrorMessage("Session expirée, veuillez vous reconnecter.");
      setTimeout(() => navigate("/developer/login"), 1500);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await API.put(`/user/update/${userId}`, {
        name: formData.username,
        email: formData.email
      });

      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setErrorMessage("Les mots de passe ne correspondent pas");
          setLoading(false);
          return;
        }
        if (formData.newPassword.length < 6) {
          setErrorMessage("Le mot de passe doit contenir au moins 6 caractères");
          setLoading(false);
          return;
        }
        await API.put(`/user/update/${userId}`, {
          password: formData.newPassword
        });
      }

      setSuccessMessage("Modifications enregistrées avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);

      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userData = JSON.parse(userStr);
        userData.name = formData.username;
        userData.email = formData.email;
        localStorage.setItem("user", JSON.stringify(userData));
      }

      setOriginalData({
        username: formData.username,
        email: formData.email
      });

      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.error || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(prev => ({
      ...prev,
      username: originalData.username,
      email: originalData.email,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }));
  };

  const handleDeleteAccount = async () => {
    if (!userId) {
      setErrorMessage("Session expirée");
      return;
    }
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) return;
    setLoading(true);
    try {
      await API.delete(`/user/delete-me`);
      localStorage.clear();
      navigate("/");
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Erreur lors de la suppression");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleBackToDashboard = () => {
    navigate("/developer/dashboard");
  };

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
    dashboardButton: {
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
    buttonIcon: {
      width: "18px",
      height: "18px",
      stroke: "currentColor",
    },
    logoutIcon: {
      width: "18px",
      height: "18px",
      stroke: "currentColor",
    },
    successMessage: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "16px 20px",
      backgroundColor: "#ecfdf5",
      border: "1px solid #a7f3d0",
      borderRadius: "12px",
      color: "#065f46",
      marginBottom: "20px",
    },
    successIcon: {
      width: "20px",
      height: "20px",
      stroke: "currentColor",
    },
    errorMessage: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "16px 20px",
      backgroundColor: "#fef2f2",
      border: "1px solid #fee2e2",
      borderRadius: "12px",
      color: "#dc2626",
      marginBottom: "20px",
    },
    tabsContainer: {
      display: "flex",
      gap: "8px",
      marginBottom: "20px",
      backgroundColor: "#ffffff",
      padding: "8px",
      borderRadius: "14px",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
      maxWidth: "400px",
    },
    tab: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "10px 20px",
      backgroundColor: "transparent",
      border: "none",
      borderRadius: "10px",
      color: "#6b7280",
      fontSize: "0.95rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      flex: 1,
    },
    activeTab: {
      backgroundColor: "#f3f4f6",
      color: "#1e293b",
    },
    tabIcon: {
      width: "18px",
      height: "18px",
      stroke: "currentColor",
    },
    container: {
      display: "flex",
      gap: "30px",
      marginTop: "10px",
    },
    formCard: {
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
      flex: 1,
    },
    avatarSection: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
      marginBottom: "30px",
      padding: "20px",
      backgroundColor: "#f8fafc",
      borderRadius: "12px",
    },
    avatar: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #3b82f6, #2563eb)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      fontSize: "1.5rem",
      fontWeight: "600",
      color: "#ffffff",
    },
    avatarButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      backgroundColor: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      color: "#475569",
      fontSize: "0.9rem",
      cursor: "pointer",
    },
    avatarIcon: {
      width: "16px",
      height: "16px",
      stroke: "currentColor",
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
    input: {
      width: "100%",
      padding: "12px 16px",
      backgroundColor: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      fontSize: "0.95rem",
      color: "#1e293b",
      outline: "none",
      transition: "all 0.2s ease",
    },
    // ✅ deleteSection est maintenant un style de carte séparée
    deleteSection: {
      marginTop: "20px",
      padding: "20px",
      backgroundColor: "#fef2f2",
      borderRadius: "20px",
      border: "1px solid #fee2e2",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    },
    deleteButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      width: "100%",
      padding: "12px",
      backgroundColor: "#ef4444",
      border: "none",
      borderRadius: "10px",
      color: "#ffffff",
      fontSize: "0.95rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      marginBottom: "10px",
    },
    deleteIcon: {
      width: "18px",
      height: "18px",
      stroke: "currentColor",
    },
    deleteWarning: {
      margin: 0,
      fontSize: "0.85rem",
      color: "#991b1b",
      textAlign: "center",
    },
    formActions: {
      marginTop: "30px",
      paddingTop: "20px",
      borderTop: "1px solid #e5e7eb",
      display: "flex",
      gap: "12px",
    },
    saveButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      flex: 1,
      padding: "14px",
      background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      border: "none",
      borderRadius: "12px",
      color: "#ffffff",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
    },
    cancelButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      flex: 1,
      padding: "14px",
      backgroundColor: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      color: "#64748b",
      fontSize: "1rem",
      fontWeight: "500",
      cursor: "pointer",
    },
    saveIcon: {
      width: "18px",
      height: "18px",
      stroke: "currentColor",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <svg style={styles.logoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <h2 style={styles.title}>Paramètres</h2>
        </div>
        <div style={styles.headerRight}>
          <button onClick={handleBackToDashboard} style={styles.dashboardButton}>
            <svg style={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="9" />
              <rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" />
              <rect x="3" y="16" width="7" height="5" />
            </svg>
            Dashboard
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

      {successMessage && (
        <div style={styles.successMessage}>
          <svg style={styles.successIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={styles.errorMessage}>
          <span>❌</span> {errorMessage}
        </div>
      )}

      <div style={styles.tabsContainer}>
        <button
          onClick={() => setActiveTab("profile")}
          style={{ ...styles.tab, ...(activeTab === "profile" ? styles.activeTab : {}) }}
        >
          <svg style={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Profil
        </button>
        <button
          onClick={() => setActiveTab("security")}
          style={{ ...styles.tab, ...(activeTab === "security" ? styles.activeTab : {}) }}
        >
          <svg style={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Sécurité
        </button>
      </div>

      <div style={styles.container}>
        {/* ✅ FORM : contient uniquement les champs et les boutons save/cancel */}
        <form onSubmit={handleSubmit} style={styles.formCard}>
          {activeTab === "profile" && (
            <div>
              <div style={styles.cardHeader}>
                <svg style={styles.cardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <h3 style={styles.cardTitle}>Informations du profil</h3>
              </div>

              <div style={styles.avatarSection}>
                <div style={styles.avatar}>
                  <span style={styles.avatarText}>{formData.username.charAt(0).toUpperCase()}</span>
                </div>
                <button type="button" style={styles.avatarButton} disabled>
                  <svg style={styles.avatarIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  Changer la photo
                </button>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  style={styles.input}
                  disabled={loading}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div>
              <div style={styles.cardHeader}>
                <svg style={styles.cardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <h3 style={styles.cardTitle}>Sécurité</h3>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Optionnel"
                  disabled={loading}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Nouveau mot de passe</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Minimum 6 caractères"
                  disabled={loading}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Confirmer le mot de passe</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Confirmez votre mot de passe"
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div style={styles.formActions}>
            <button type="submit" style={styles.saveButton} disabled={loading}>
              <svg style={styles.saveIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button type="button" onClick={handleCancel} style={styles.cancelButton} disabled={loading}>
              Annuler
            </button>
          </div>
        </form>
      </div>

      {/* ✅ DELETE SECTION : EN DEHORS du <form>, dans son propre bloc */}
      {activeTab === "profile" && (
        <div style={styles.deleteSection}>
          <button
            type="button"
            onClick={handleDeleteAccount}
            style={styles.deleteButton}
            disabled={loading}
          >
            <svg style={styles.deleteIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
            Supprimer mon compte
          </button>
          <p style={styles.deleteWarning}>
            Cette action est irréversible. Toutes vos données seront supprimées.
          </p>
        </div>
      )}
    </div>
  );
}