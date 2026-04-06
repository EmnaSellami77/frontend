import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function DeveloperLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Vérification champs vides
    if (!form.email || !form.password) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    const password = form.password;

    // 🔐 Conditions mot de passe
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (!hasNumber) {
      setError("Le mot de passe doit contenir au moins un chiffre.");
      return;
    }

    if (!hasLetter) {
      setError("Le mot de passe doit contenir au moins une lettre.");
      return;
    }

    // ✅ OK
    setError("");

    // 🔐 Stocker rôle developer
    localStorage.setItem("role", "developer");

    // 🚀 Redirection
    navigate("/developer/dashboard");
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center animated-bg">
      <div
        className="card p-4 shadow-lg"
        style={{ width: "400px", borderRadius: "15px" }}
      >
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div className="mb-3 position-relative">
            <label>Mot de passe</label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              className="form-control pe-5"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <span
              onClick={() =>
                setIsPasswordVisible(!isPasswordVisible)
              }
              style={{
                position: "absolute",
                right: "15px",
                top: "38px",
                cursor: "pointer",
              }}
            >
              {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="text-end mb-3">
            <Link to="/forgot-password?role=developer">
              Mot de passe oublié ?
            </Link>
          </div>

          <button className="btn btn-primary w-100">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}

export default DeveloperLogin;