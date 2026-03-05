import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "IT",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    if (form.password.length < 6) {
      setError("Mot de passe minimum 6 caractères.");
      return;
    }

    setError("");
    setSuccess("Compte créé avec succès !");
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center animated-bg">
      <div className="card p-4 shadow-lg fade-in" style={{ width: "400px" }}>
        <h3 className="text-center mb-4">Sign Up</h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          {/* PASSWORD PROFESSIONNEL */}
          <div className="mb-3 position-relative">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              placeholder="Password"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "15px",
                top: "38px",
                cursor: "pointer",
                color: "#6c757d",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button className="btn btn-success w-100">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Register;