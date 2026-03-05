import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "IT",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validations
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Tous les champs sont obligatoires.");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Veuillez entrer un email valide.");
      setLoading(false);
      return;
    }

    setError("");
    setSuccess("Compte IT Consultant créé avec succès !");
    
    // Simulation d'inscription
    setTimeout(() => {
      setLoading(false);
      // Redirection vers login après 2 secondes
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center p-4 animated-bg">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          {/* Bouton retour */}
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-link text-decoration-none mb-3 d-inline-flex align-items-center"
            style={{ color: "#2563eb" }}
          >
            <FaArrowLeft className="me-2" /> Retour
          </button>

          {/* Carte principale */}
          <div className="card border-0 shadow-lg fade-in overflow-hidden">
            {/* En-tête avec dégradé */}
            <div 
              className="card-header text-white border-0 p-4"
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)"
              }}
            >
              <div className="d-flex align-items-center">
                <div 
                  className="rounded-circle bg-white d-flex align-items-center justify-content-center me-3"
                  style={{ width: "50px", height: "50px" }}
                >
                  <span style={{ fontSize: "28px" }}>👨‍💼</span>
                </div>
                <div>
                  <h3 className="mb-1 fw-bold">IT Consultant</h3>
                  <p className="mb-0 opacity-75">Créez votre compte professionnel</p>
                </div>
              </div>
            </div>

            {/* Corps du formulaire */}
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError("")}></button>
                </div>
              )}
              
              {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="bi bi-check-circle me-2"></i>
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Nom complet */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Nom complet <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control form-control-lg"
                    placeholder="Jean Dupont"
                    value={form.name}
                    onChange={handleChange}
                    disabled={loading || success}
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Email professionnel <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control form-control-lg"
                    placeholder="jean.dupont@entreprise.com"
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading || success}
                  />
                </div>

                {/* Mot de passe */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Mot de passe <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-control form-control-lg"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      disabled={loading || success}
                    />
                    <span
                      onClick={() => !loading && !success && setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: loading || success ? "default" : "pointer",
                        color: "#6c757d",
                        zIndex: 10,
                      }}
                    >
                      {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </span>
                  </div>
                  <small className="text-muted">Minimum 6 caractères</small>
                </div>

                {/* Confirmation mot de passe */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Confirmer le mot de passe <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      className="form-control form-control-lg"
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      disabled={loading || success}
                    />
                    <span
                      onClick={() => !loading && !success && setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: "absolute",
                        right: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: loading || success ? "default" : "pointer",
                        color: "#6c757d",
                        zIndex: 10,
                      }}
                    >
                      {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </span>
                  </div>
                </div>

                {/* Conditions d'utilisation */}
                <div className="mb-4">
                  <div className="form-check">
                    <input 
                      type="checkbox" 
                      className="form-check-input" 
                      id="terms" 
                      required
                      disabled={loading || success}
                    />
                    <label className="form-check-label" htmlFor="terms">
                      J'accepte les{" "}
                      <Link to="/terms" className="text-decoration-none">
                        conditions d'utilisation
                      </Link>{" "}
                      et la{" "}
                      <Link to="/privacy" className="text-decoration-none">
                        politique de confidentialité
                      </Link>
                    </label>
                  </div>
                </div>

                {/* Bouton de soumission */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 btn-lg mb-3"
                  disabled={loading || success}
                  style={{
                    background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                    border: "none",
                    padding: "12px",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Création en cours...
                    </>
                  ) : success ? (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Compte créé !
                    </>
                  ) : (
                    "Créer mon compte consultant"
                  )}
                </button>

                {/* Lien vers connexion */}
                <div className="text-center">
                  <p className="mb-0">
                    Déjà un compte ?{" "}
                    <Link to="/login" className="text-decoration-none fw-semibold">
                      Se connecter
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Badge de sécurité */}
            <div className="card-footer bg-light border-0 p-3 text-center">
              <small className="text-muted">
                🔒 Connexion sécurisée • Chiffrement SSL
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Styles supplémentaires */}
      <style>{`
        .animated-bg {
          background: linear-gradient(-45deg, #f8fafc, #e2e8f0, #dbeafe, #f8fafc);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .fade-in {
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .form-control:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 0.2rem rgba(37, 99, 235, 0.25);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}

export default Register;