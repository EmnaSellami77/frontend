import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function DeveloperSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Tous les champs sont obligatoires.");
      return;
    }
    // simulate save
    localStorage.setItem("developer", JSON.stringify(form));
    setError("");
    // redirect
    navigate("/developer/login");
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Developer Sign Up</h3>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}
export default DeveloperSignup;