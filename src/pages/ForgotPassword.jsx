import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Veuillez entrer votre email");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await API.post("/user/forgot-password", { email });
      setMessage(response.data.message || "Lien de réinitialisation envoyé !");

      setTimeout(() => {
        if (role === "developer") {
          navigate("/developer/login");
        } else {
          navigate("/login");
        }
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Erreur lors de l'envoi de l'email";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Mot de passe oublié</h3>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className="alert alert-success" role="alert">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading ? "Envoi en cours..." : "Envoyer"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;