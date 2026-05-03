import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Tous les champs sont obligatoires.");
      return;
    }
    try {
      const res = await API.post('/auth/login', {
        email: form.email,
        password: form.password
      });
      const { token, user } = res.data;

      // 🔒 Interdire l'accès aux développeurs sur cette page de login
      if (user.role === 'developer') {
        setError("Accès refusé : les comptes développeur ne peuvent pas se connecter via cette interface.");
        return; // On arrête ici, on ne stocke rien
      }

      // Connexion autorisée pour les autres rôles
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role);

      // Redirection unique vers le dashboard IT (quel que soit le rôle autorisé)
      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.error || "Identifiants incorrects");
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center animated-bg">
      <div className="card p-4 shadow-lg" style={{ width: "400px", borderRadius: "15px" }}>
        <h3 className="text-center mb-3">Connexion IT</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="mb-3 position-relative">
            <label>Mot de passe</label>
            <input type={isPasswordVisible ? "text" : "password"} className="form-control pe-5" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <span onClick={() => setIsPasswordVisible(!isPasswordVisible)} style={{ position: "absolute", right: "15px", top: "38px", cursor: "pointer" }}>
              {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="text-end mb-3">
            <Link to="/forgot-password?role=it">Mot de passe oublié ?</Link>
          </div>
          <button className="btn btn-primary w-100">Se connecter</button>
        </form>
      </div>
    </div>
  );
}

export default Login;