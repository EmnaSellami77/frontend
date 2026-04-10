import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation front
    if (!form.fullName.trim() || !form.email.trim() || !form.password || !form.confirmPassword) {
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
    try {
      const payload = {
        name: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        role: 'it_consultant'
      };
      console.log("📤 Envoi inscription IT :", payload);
      const response = await API.post('/auth/signup', payload);
      console.log("✅ Réponse :", response.data);
      navigate("/login");
    } catch (err) {
      console.error("❌ Erreur détaillée :", err.response?.data || err.message);
      const msg = err.response?.data?.error || "Erreur d'inscription. Vérifiez vos champs.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Styles identiques à ceux que vous aviez (je les garde inchangés)
  const styles = {
    container: { minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#f9fafb", padding: "20px", fontFamily: "'Inter', sans-serif", position: "relative" },
    backButton: { position: "absolute", top: "20px", left: "20px", display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", color: "#475569", cursor: "pointer" },
    card: { backgroundColor: "#ffffff", padding: "40px", borderRadius: "24px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", width: "100%", maxWidth: "450px" },
    header: { textAlign: "center", marginBottom: "30px" },
    iconContainer: { width: "64px", height: "64px", margin: "0 auto 16px", backgroundColor: "#eef2ff", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" },
    logo: { width: "36px", height: "36px", color: "#3b82f6", stroke: "currentColor" },
    subtitle: { margin: 0, fontSize: "0.95rem", color: "#64748b" },
    errorMessage: { display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", backgroundColor: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "12px", color: "#ef4444", marginBottom: "20px" },
    form: { display: "flex", flexDirection: "column", gap: "20px" },
    formGroup: { display: "flex", flexDirection: "column", gap: "6px" },
    label: { display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", fontWeight: "500", color: "#475569" },
    labelIcon: { width: "16px", height: "16px", stroke: "#94a3b8" },
    input: { padding: "12px 16px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "0.95rem", color: "#1e293b", outline: "none" },
    passwordContainer: { position: "relative", display: "flex", alignItems: "center" },
    passwordInput: { flex: 1, padding: "12px 16px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", paddingRight: "45px" },
    eyeButton: { position: "absolute", right: "12px", background: "none", border: "none", cursor: "pointer" },
    termsContainer: { display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" },
    checkbox: { width: "16px", height: "16px" },
    termsLabel: { fontSize: "0.9rem", color: "#475569" },
    termsLink: { color: "#3b82f6", textDecoration: "none" },
    button: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "14px", background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", border: "none", borderRadius: "12px", color: "#ffffff", fontWeight: "600", cursor: "pointer" },
    loginContainer: { textAlign: "center", marginTop: "20px" },
    loginLink: { color: "#3b82f6", textDecoration: "none" },
    separator: { position: "relative", textAlign: "center", margin: "20px 0" },
    separatorText: { backgroundColor: "#ffffff", padding: "0 10px", color: "#94a3b8" },
    socialContainer: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "10px" },
    socialButton: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "10px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", cursor: "pointer" },
    socialIcon: { width: "18px", height: "18px" },
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        <svg style={{ width: "18px", height: "18px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
        Retour
      </button>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <svg style={styles.logo} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 13.255A23.931 23.931 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2m4 6h.01M5 20h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" /></svg>
          </div>
          <p style={styles.subtitle}>Créez votre compte consultant IT</p>
        </div>

        {error && (
          <div style={styles.errorMessage}>
            <svg style={{ width: "18px", height: "18px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><circle cx="12" cy="16" r="1" fill="currentColor" /></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nom complet</label>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Jean Dupont" style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="jean.dupont@entreprise.com" style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Mot de passe</label>
            <div style={styles.passwordContainer}>
              <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" style={styles.passwordInput} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeButton}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirmer le mot de passe</label>
            <div style={styles.passwordContainer}>
              <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" style={styles.passwordInput} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</button>
            </div>
          </div>
          <div style={styles.termsContainer}>
            <input type="checkbox" id="terms" style={styles.checkbox} />
            <label htmlFor="terms" style={styles.termsLabel}>J'accepte les <a href="/terms" style={styles.termsLink}>conditions d'utilisation</a></label>
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Création en cours..." : "Créer mon compte"}
          </button>
        </form>

        <div style={styles.loginContainer}>
          <p>Déjà un compte ? <Link to="/login" style={styles.loginLink}>Se connecter</Link></p>
        </div>

        <div style={styles.separator}><span style={styles.separatorText}>ou</span></div>
        <div style={styles.socialContainer}>
          <button style={styles.socialButton}>Google</button>
          <button style={styles.socialButton}>Facebook</button>
        </div>
      </div>
    </div>
  );
}