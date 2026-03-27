// frontend/src/pages/DeveloperLogin.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
      // Appel API vers le backend
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Connexion réussie
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user.id);
        
        navigate("/developer/dashboard");
      } else {
        // Erreur du backend
        setError(data.error || "Email ou mot de passe incorrect");
        setLoading(false);
      }
      
    } catch (err) {
      console.error("Erreur API:", err);
      setError("Impossible de contacter le serveur. Vérifiez que le backend est démarré sur http://localhost:5000");
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center animated-bg">
      <div className="card p-4 shadow-lg" style={{ width: "400px", borderRadius: "15px" }}>
        
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="mb-3 position-relative">
            <label>mot de passe</label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              className="form-control pe-5"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              disabled={loading}
            />
            <span
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              style={{ position: "absolute", right: "15px", top: "38px", cursor: "pointer" }}
            >
              {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="text-end mb-3">
            <Link to="/forgot-password?role=developer">
              Mot de passe oublié ?
            </Link>
          </div>

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Connexion en cours..." : "se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default DeveloperLogin;