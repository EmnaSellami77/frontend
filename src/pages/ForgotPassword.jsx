import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Entrez votre email");
      return;
    }

    alert("Lien de réinitialisation envoyé !");

    if (role === "developer") {
      navigate("/developer/login");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Mot de passe oublié</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="btn btn-primary w-100">
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;