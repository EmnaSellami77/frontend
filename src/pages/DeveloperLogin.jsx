// frontend/src/pages/DeveloperLogin.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { authService } from "../services/authService";

function DeveloperLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authService.login({
        email: form.email,
        password: form.password
      });

      console.log("Connexion réussie:", response);

      if (response.user.role === "developer") {
        navigate("/developer/dashboard");
      } else {
        setError("Ce compte n'est pas un compte développeur. Veuillez utiliser le bon espace de connexion.");
        authService.logout();
      }
    } catch (err) {
      console.error("Erreur connexion:", err);
      setError(err.message || "Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
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

      {/* Carte de connexion */}
      <div style={styles.card}>
        {/* En-tête avec logo */}
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <svg style={styles.logo} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h2 style={styles.title}>Espace Développeur</h2>
          <p style={styles.subtitle}>Connectez-vous à votre compte développeur</p>
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
              className="form-control"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="jean.dupont@email.com"
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
                type={isPasswordVisible ? "text" : "password"}
                className="form-control"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                style={styles.passwordInput}
                disabled={loading}
              />
              <span
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                style={styles.eyeButton}
              >
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Lien mot de passe oublié */}
          <div style={styles.forgotContainer}>
            <Link to="/forgot-password?role=developer" style={styles.forgotLink}>
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Bouton de connexion */}
          <button 
            type="submit" 
            style={styles.button}
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={styles.loadingSpinner}></span>
                Connexion en cours...
              </>
            ) : (
              <>
                <svg style={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Se connecter
              </>
            )}
          </button>
        </form>

        {/* Lien vers inscription */}
        <div style={styles.signupContainer}>
          <p style={styles.signupText}>
            Pas encore de compte ? <Link to="/developer/register" style={styles.signupLink}>S'inscrire</Link>
          </p>
        </div>

        {/* Séparateur */}
        <div style={styles.separator}>
          <span style={styles.separatorText}>ou</span>
        </div>

        {/* Informations supplémentaires */}
        <div style={styles.infoContainer}>
          <p style={styles.infoText}>
            <svg style={styles.infoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <circle cx="12" cy="8" r="0.5" fill="currentColor" />
            </svg>
            Accédez à votre espace développeur pour créer et gérer vos tickets
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
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
    padding: "10px 20px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "12px",
    color: "#ffffff",
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
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    width: "100%",
    maxWidth: "440px",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  iconContainer: {
    width: "70px",
    height: "70px",
    margin: "0 auto 16px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "40px",
    height: "40px",
    color: "#ffffff",
    stroke: "currentColor",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#1e293b",
  },
  subtitle: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#64748b",
  },
  errorMessage: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    color: "#dc2626",
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
    gap: "8px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#334155",
  },
  labelIcon: {
    width: "16px",
    height: "16px",
    stroke: "#94a3b8",
  },
  input: {
    padding: "12px 16px",
    backgroundColor: "#f8fafc",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "0.95rem",
    color: "#1e293b",
    outline: "none",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },
  passwordContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    padding: "12px 45px 12px 16px",
    backgroundColor: "#f8fafc",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "0.95rem",
    color: "#1e293b",
    outline: "none",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
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
  forgotContainer: {
    textAlign: "right",
    marginTop: "-5px",
  },
  forgotLink: {
    color: "#667eea",
    textDecoration: "none",
    fontSize: "0.85rem",
    fontWeight: "500",
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "14px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: "10px",
  },
  buttonIcon: {
    width: "18px",
    height: "18px",
    stroke: "currentColor",
  },
  loadingSpinner: {
    width: "18px",
    height: "18px",
    border: "2px solid #ffffff",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    display: "inline-block",
  },
  signupContainer: {
    textAlign: "center",
    marginTop: "24px",
    paddingTop: "20px",
    borderTop: "1px solid #e2e8f0",
  },
  signupText: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#64748b",
  },
  signupLink: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "600",
    marginLeft: "5px",
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
    fontSize: "0.85rem",
    zIndex: 2,
  },
  infoContainer: {
    marginTop: "20px",
    padding: "16px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  infoText: {
    margin: 0,
    fontSize: "0.8rem",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  infoIcon: {
    width: "14px",
    height: "14px",
    stroke: "currentColor",
    flexShrink: 0,
  },
};

// Ajout de l'animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  input:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background-color: #ffffff;
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px -5px rgba(102, 126, 234, 0.4);
  }
  
  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .back-button:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: translateX(-2px);
  }
  
  a:hover {
    text-decoration: underline;
  }
`;
document.head.appendChild(style);

export default DeveloperLogin;