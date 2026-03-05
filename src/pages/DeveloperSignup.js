import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DeveloperSignup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    if (!form.email.includes("@")) {
      setError("Email invalide.");
      return;
    }

    if (form.password.length < 6) {
      setError("Mot de passe minimum 6 caractères.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setError("");
    setSuccess("Compte développeur créé avec succès !");

    // Stocker le rôle
    localStorage.setItem("role", "DEV");

    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center animated-bg">
      <div className="card shadow-lg p-4 fade-in" style={{ width: "420px" }}>
        <h3 className="text-center mb-4 text-success">
          Developer Sign Up
        </h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Nom complet</label>
            <input
              type="text"
              className="form-control"
              placeholder="Votre nom"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="developer@email.com"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Mot de passe"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label>Confirmer Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Confirmer mot de passe"
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          </div>

          <button className="btn btn-success w-100 mt-2">
            Créer un compte développeur
          </button>
        </form>
      </div>
    </div>
  );
}

export default DeveloperSignup;