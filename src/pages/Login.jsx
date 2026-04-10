import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../services/api";

function Login() {
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
      // Appel API pour la connexion
      const response = await API.post("/auth/login", {
        email: form.email,
        password: form.password
      });

      const { token, user } = response.data;

      // Stockage des données
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role || "it_consultant");

      // Redirection vers le dashboard
      navigate("/dashboard");
      
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Email ou mot de passe incorrect";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center animated-bg">
      <div
        className="card p-4 shadow-lg"
        style={{ width: "400px", borderRadius: "15px" }}
      >
        <h3 className="text-center mb-3">Connexion IT</h3>

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
              disabled={loading}
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
              disabled={loading}
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
            <Link to="/forgot-password?role=it">
              Mot de passe oublié ?
            </Link>
          </div>

          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;