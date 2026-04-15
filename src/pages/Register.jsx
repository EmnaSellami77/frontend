import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin } from '@react-oauth/google';
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
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    const regex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!regex.test(form.password)) {
      setError("Mot de passe : 6 caractères min, lettres et chiffre");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const response = await API.post("/auth/signup", {
        name: form.fullName,
        email: form.email,
        password: form.password,
        role: "it_consultant"
      });
      setSuccessMessage(response.data.message || "Inscription réussie ! Un code de vérification a été envoyé.");
      // Redirection vers la page de vérification
      setTimeout(() => navigate("/verify-email"), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  // Inscription avec Google (IT Consultant)
  const handleGoogleSuccess = async (credentialResponse) => {
    const id_token = credentialResponse.credential;
    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const response = await API.post('/auth/google', {
        id_token: id_token,
        role: "it_consultant"
      });
      const data = response.data;
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        const role = data.user.role || 'it_consultant';
        localStorage.setItem('role', role);
        navigate("/dashboard");
      } else {
        setError(data.error || "Erreur d'inscription avec Google");
      }
    } catch (err) {
      console.error('Erreur Google:', err);
      setError(err.response?.data?.error || "Erreur lors de l'inscription avec Google");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.log('Inscription Google échouée');
    setError("L'inscription avec Google a échoué. Veuillez réessayer.");
  };

  // Styles (inchangés, identiques à votre version)
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
    successMessage: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
      padding: "12px 16px",
      backgroundColor: "#d1fae5",
      border: "1px solid #a7f3d0",
      borderRadius: "12px",
      color: "#065f46",
      fontSize: "0.9rem",
      marginBottom: "20px",
      textAlign: "center",
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
    loginContainer: {
      textAlign: "center",
      marginTop: "20px",
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
      display: "flex",
      justifyContent: "center",
      gap: "12px",
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        <svg style={{ width: "18px", height: "18px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Retour
      </button>

      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <svg style={styles.logo} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 13.255A23.931 23.931 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2m4 6h.01M5 20h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
            </svg>
          </div>
          <p style={styles.subtitle}>Créez votre compte consultant IT</p>
        </div>

        {error && (
          <div style={styles.errorMessage}>
            <svg style={{ width: "18px", height: "18px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
            {error}
          </div>
        )}

        {successMessage && (
          <div style={styles.successMessage}>
            <svg style={{ width: "18px", height: "18px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            {successMessage}
            <Link to="/login" style={{ color: "#065f46", fontWeight: "bold", marginTop: "8px" }}>
              Aller à la page de connexion →
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nom complet</label>
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

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
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

          <div style={styles.formGroup}>
            <label style={styles.label}>Mot de passe</label>
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

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirmer le mot de passe</label>
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

          <div style={styles.termsContainer}>
            <input type="checkbox" id="terms" style={styles.checkbox} disabled={loading} />
            <label htmlFor="terms" style={styles.termsLabel}>
              <Link to="/terms" style={styles.termsLink}>conditions d'utilisation</Link>
            </label>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Création en cours..." : "Créer mon compte"}
          </button>
        </form>

        <div style={styles.loginContainer}>
          <p>Déjà un compte ? <Link to="/login" style={styles.loginLink}>Se connecter</Link></p>
        </div>

        <div style={styles.separator}>
          <span style={styles.separatorText}>ou</span>
        </div>

        <div style={styles.socialContainer}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="signup_with"
            theme="outline"
            size="large"
            shape="rectangular"
            width="200"
          />
        </div>
      </div>
    </div>
  );
}