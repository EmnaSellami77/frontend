import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../services/api";

export default function Register() {
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
      // Appel API pour l'inscription avec rôle it_consultant
      const response = await API.post("/auth/signup", {
        name: form.fullName,
        email: form.email,
        password: form.password,
        role: "it_consultant"
      });
      
      setLoading(false);
      // Rediriger vers la page de login
      navigate("/login");
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
        {/* En-tête avec icône spécifique IT Consultant */}
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <svg style={styles.logo} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <p style={styles.subtitle}>Créez votre compte consultant IT</p>
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
              placeholder="Jean Dupont"
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
              placeholder="jean.dupont@entreprise.com"
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
            Déjà un compte ? <Link to="/login" style={styles.loginLink}>Se connecter</Link>
          </p>
        </div>

        {/* Séparateur */}
        <div style={styles.separator}>
          <span style={styles.separatorText}>ou</span>
        </div>

        {/* Boutons de connexion sociale */}
        <div style={styles.socialContainer}>
          <button style={styles.socialButton} disabled={loading}>
            <svg style={styles.socialIcon} viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>
          <button style={styles.socialButton} disabled={loading}>
            <svg style={styles.socialIcon} viewBox="0 0 24 24" fill="#333">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
            Facebook
          </button>
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
  iconContainer: {
    width: "64px",
    height: "64px",
    margin: "0 auto 16px",
    backgroundColor: "#eef2ff",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "36px",
    height: "36px",
    color: "#3b82f6",
    stroke: "currentColor",
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
  separator: {
    position: "relative",
    textAlign: "center",
    margin: "20px 0",
  },
  separatorText: {
    position: "relative",
    backgroundColor: "#ffffff",
    padding: "0 10px",
    color: "#94a3b8",
    fontSize: "0.9rem",
    zIndex: 2,
  },
  socialContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginTop: "10px",
  },
  socialButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "10px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    color: "#1e293b",
    fontSize: "0.9rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  socialIcon: {
    width: "18px",
    height: "18px",
  },
};

// Ajout de l'animation pour le spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .back-button:hover {
    background-color: #f8fafc;
    transform: translateX(-2px);
  }
  
  input:hover {
    border-color: #94a3b8;
  }
  
  input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background-color: #ffffff;
  }
  
  button[type="submit"]:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px -5px rgba(59, 130, 246, 0.5);
  }
  
  button[type="submit"]:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .social-button:hover {
    background-color: #f8fafc;
    border-color: #cbd5e1;
  }
`;
document.head.appendChild(style);