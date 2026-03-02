import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Tous les champs sont obligatoires.");
      setSuccess("");
      return;
    }

    // Simulation login réussi
    setError("");
    setSuccess("Connexion réussie !");

    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center animated-bg">
      <div
        className="card p-4 shadow-lg"
        style={{ width: "400px", borderRadius: "15px" }}
      >
        <h3 className="text-center mb-4">Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} autoComplete="off">
          {/* EMAIL */}
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={form.email}
              autoComplete="email"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-3 position-relative">
            <label>Password</label>

            <input
              type={isPasswordVisible ? "text" : "password"}
              className="form-control pe-5"
              placeholder="Password"
              value={form.password}
              autoComplete="current-password"
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
                color: "#6c757d",
              }}
            >
              {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* FORGOT PASSWORD */}
          <div className="text-end mb-3">
            <Link
              to="/forgot-password"
              className="text-decoration-none"
              style={{ fontSize: "14px" }}
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <button className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;