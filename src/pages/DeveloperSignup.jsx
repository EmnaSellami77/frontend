import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../services/api";

export default function DeveloperSignup() {
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
    try {
      await API.post('/auth/signup', {
        name: form.fullName,
        email: form.email,
        password: form.password,
        role: 'developer'
      });
      navigate("/developer/login");
    } catch (err) {
      setError(err.response?.data?.error || "Erreur d'inscription");
    } finally {
      setLoading(false);
    }
  };

  // Styles identiques à Register (vous pouvez les copier depuis Register.jsx)
  const styles = { /* reprendre exactement les styles de Register.jsx */ };
  // Pour gagner de la place, je ne les répète pas ici, mais vous pouvez les réutiliser.

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        <svg style={{ width: "18px", height: "18px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
        Retour
      </button>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <svg style={styles.logo} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>
          <p style={styles.subtitle}>Créez votre compte développeur</p>
        </div>
        {error && <div style={styles.errorMessage}>...</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nom complet</label>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Doe" style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" style={styles.input} />
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
          <button type="submit" style={styles.button} disabled={loading}>{loading ? "Création..." : "Créer mon compte"}</button>
        </form>
        <div style={styles.loginContainer}>
          <p>Déjà un compte ? <Link to="/developer/login" style={styles.loginLink}>Se connecter</Link></p>
        </div>
      </div>
    </div>
  );
}