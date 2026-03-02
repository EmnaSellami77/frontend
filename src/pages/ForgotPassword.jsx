import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError("Veuillez entrer votre email.");
      return;
    }

    // Simulation d'envoi email
    setError("");
    setMessage("Un lien de réinitialisation a été envoyé à votre email.");
    setEmail("");
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center animated-bg">
      <div className="card p-4 shadow-lg fade-in" style={{ width: "400px" }}>
        <h3 className="text-center mb-4">Mot de passe oublié</h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 position-relative">
            <input
              type="email"
              className="form-control"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaEnvelope
              style={{
                position: "absolute",
                right: "15px",
                top: "12px",
                color: "#6c757d",
              }}
            />
          </div>

          <button className="btn btn-primary w-100">
            Envoyer le lien
          </button>
        </form>

        <div className="text-center mt-3">
          <a href="/login" className="text-decoration-none">
            Retour à la connexion
          </a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;