import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function DeveloperLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    // Simulation login
    navigate("/developer/dashboard");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        <form onSubmit={handleLogin}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            placeholder="Entrer votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>Password</label>
          <div style={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Entrer votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.passwordInput}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div style={styles.forgot}>
            <Link to="/forgot-password">Mot de passe oublié ?</Link>
          </div>

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#1a2a34", // fond sombre comme sur l'image
    fontFamily: "Arial, sans-serif",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    width: "350px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  title: {
    marginBottom: "30px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#111",
  },
  label: {
    display: "block",
    textAlign: "left",
    marginBottom: "5px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  passwordContainer: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "6px",
    marginBottom: "10px",
  },
  passwordInput: {
    flex: 1,
    padding: "12px",
    border: "none",
    outline: "none",
    borderRadius: "6px",
    fontSize: "14px",
  },
  eyeIcon: {
    padding: "0 10px",
    cursor: "pointer",
    color: "#555",
  },
  forgot: {
    textAlign: "right",
    marginBottom: "20px",
    fontSize: "13px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007bff", // bleu comme sur l'image
    border: "none",
    borderRadius: "6px",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
  },
};