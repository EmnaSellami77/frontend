import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function VerifyEmail() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !code) {
      setError("Veuillez saisir votre email et le code reçu");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await API.post("/auth/verify-email", { email, code });
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur de vérification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6", fontFamily: "sans-serif" }}>
      <div style={{ background: "white", padding: "40px", borderRadius: "16px", width: "400px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Vérification de l'email</h2>
        <p style={{ textAlign: "center", marginBottom: "20px", color: "#6b7280" }}>
          Entrez votre email et le code à 6 chiffres reçu.
        </p>
        {error && <div style={{ background: "#fee2e2", color: "#dc2626", padding: "10px", borderRadius: "8px", marginBottom: "15px" }}>{error}</div>}
        {message && <div style={{ background: "#d1fae5", color: "#065f46", padding: "10px", borderRadius: "8px", marginBottom: "15px" }}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }}
              disabled={loading}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label>Code de vérification</label>
            <input
              type="text"
              className="form-control"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              maxLength="6"
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }}
              disabled={loading}
            />
          </div>
          <button type="submit" style={{ width: "100%", padding: "12px", background: "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }} disabled={loading}>
            {loading ? "Vérification..." : "Vérifier"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyEmail;