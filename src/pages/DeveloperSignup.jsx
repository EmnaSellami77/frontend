// frontend/src/pages/DeveloperSignup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../services/api";

export default function DeveloperSignup() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      setError("Tous les champs sont obligatoires");
      return;
    }
    
    // Validation mot de passe : 6 caractères + 1 lettre + 1 chiffre
    const regex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

    if (!regex.test(form.password)) {
      setError("Mot de passe :6 caractères min, lettres et chiffre");
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    
    setLoading(true);
    
    try {
      // Appel API pour l'inscription avec rôle developer
      const response = await API.post("/auth/signup", {
        name: form.fullName,
        email: form.email,
        password: form.password,
        role: "developer"
      });
      
      setLoading(false);
      // Rediriger vers la page de login
      navigate("/developer/login");
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.error || "Erreur lors de l'inscription";
      setError(errorMessage);
    }
  };

  return (
    <div style={styles.container}>
      {/* Bouton retour */}
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        <svg style={styles.backIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Retour
      </button>

      {/* Carte d'inscription */}
      <div style={styles.card}>
        {/* En-tête avec logo */}
        <div style={styles.header}>
          <svg style={styles.logo} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <h2 style={styles.title}>Inscription Développeur</h2>
          <p style={styles.subtitle}>Créez votre compte développeur</p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div style={styles.errorMessage}>
            <svg style={styles.errorIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Nom complet */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Nom complet
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              style={styles.input}
              disabled={loading}
            />
          </div>

          {/* Email */}
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
              value={form.email}
              onChange={handleChange}
              placeholder="emna@example.com"
              style={styles.input}
              disabled={loading}
            />
          </div>

          {/* Mot de passe */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Mot de passe
            </label>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={styles.passwordInput}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirmer mot de passe */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Confirmer le mot de passe
            </label>
            <div style={styles.passwordContainer}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                style={styles.passwordInput}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
                disabled={loading}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Conditions d'utilisation */}
          <div style={styles.termsContainer}>
            <input type="checkbox" id="terms" style={styles.checkbox} disabled={loading} />
            <label htmlFor="terms" style={styles.termsLabel}>
              J'accepte les <a href="/terms" style={styles.termsLink}>conditions d'utilisation</a>
            </label>
          </div>

          {/* Bouton d'inscription */}
          <button 
            type="submit" 
            style={styles.button}
            disabled={loading}
          >
            {loading ? (
              <span style={styles.loadingSpinner}></span>
            ) : (
              <>
                <svg style={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
                Créer mon compte
              </>
            )}
          </button>
        </form>

        {/* Lien vers connexion */}
        <div style={styles.loginContainer}>
          <p style={styles.loginText}>
            Déjà un compte ? <Link to="/developer/login" style={styles.loginLink}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: "20px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: "20px",
    left: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    color: "#475569",
    fontSize: "0.95rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    zIndex: 10,
  },
  backIcon: {
    width: "18px",
    height: "18px",
    stroke: "currentColor",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "24px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02)",
    border: "1px solid #e5e7eb",
    width: "100%",
    maxWidth: "450px",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  logo: {
    width: "48px",
    height: "48px",
    color: "#3b82f6",
    stroke: "currentColor",
    marginBottom: "16px",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#1e293b",
  },
  subtitle: {
    margin: 0,
    fontSize: "0.95rem",
    color: "#64748b",
  },
  errorMessage: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fee2e2",
    borderRadius: "12px",
    color: "#ef4444",
    fontSize: "0.9rem",
    marginBottom: "20px",
  },
  errorIcon: {
    width: "18px",
    height: "18px",
    stroke: "currentColor",
    flexShrink: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#475569",
  },
  labelIcon: {
    width: "16px",
    height: "16px",
    stroke: "#94a3b8",
  },
  input: {
    padding: "12px 16px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "0.95rem",
    color: "#1e293b",
    outline: "none",
    transition: "all 0.2s ease",
  },
  passwordContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    padding: "12px 16px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "0.95rem",
    color: "#1e293b",
    outline: "none",
    paddingRight: "45px",
  },
  eyeButton: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    color: "#64748b",
    cursor: "pointer",
    fontSize: "1.1rem",
    display: "flex",
    alignItems: "center",
    padding: "4px",
  },
  termsContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "10px",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    cursor: "pointer",
  },
  termsLabel: {
    fontSize: "0.9rem",
    color: "#475569",
  },
  termsLink: {
    color: "#3b82f6",
    textDecoration: "none",
    fontWeight: "500",
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
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
    marginTop: "10px",
  },
  buttonIcon: {
    width: "18px",
    height: "18px",
    stroke: "currentColor",
  },
  loadingSpinner: {
    width: "20px",
    height: "20px",
    border: "2px solid #ffffff",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loginContainer: {
    textAlign: "center",
    marginTop: "20px",
  },
  loginText: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#64748b",
  },
  loginLink: {
    color: "#3b82f6",
    textDecoration: "none",
    fontWeight: "500",
  },
};

// Ajout de l'animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);