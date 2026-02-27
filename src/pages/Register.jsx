import { useState } from "react";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "IT",
  });

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
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <select
            className="form-select mb-3"
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="IT">IT Consultant</option>
            <option value="DEV">Développeur</option>
          </select>

          <button className="btn btn-success w-100">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Register;