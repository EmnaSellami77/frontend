import React, { useState } from "react";

function Settings() {

  const [user, setUser] = useState({
    nom: "Hajri",
    prenom: "Emna",
    email: "consultant.it@gmail.com",
    role: "IT Consultant",
    notifications: true
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("Informations mises à jour !");
  };

  const handlePasswordUpdate = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }
    alert("Mot de passe modifié !");
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Paramètres du compte</h2>

      <div className="card p-4 shadow-sm">

        {/* Informations personnelles */}
        <h5 className="mb-3">Informations personnelles</h5>

        <div className="row mb-3">
          <div className="col-md-6">
            <label>Nom</label>
            <input
              type="text"
              name="nom"
              className="form-control"
              value={user.nom}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>Prénom</label>
            <input
              type="text"
              name="prenom"
              className="form-control"
              value={user.prenom}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-3">
          <label>Email (Gmail)</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={user.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Rôle</label>
          <input
            type="text"
            className="form-control"
            value={user.role}
            disabled
          />
        </div>

        <button className="btn btn-primary mb-4" onClick={handleSave}>
          Enregistrer les modifications
        </button>

        <hr />

        {/* Modification mot de passe */}
        <h5 className="mb-3">Modifier le mot de passe</h5>

        <div className="mb-3">
          <input
            type="password"
            name="currentPassword"
            className="form-control"
            placeholder="Mot de passe actuel"
            value={passwords.currentPassword}
            onChange={handlePasswordChange}
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            name="newPassword"
            className="form-control"
            placeholder="Nouveau mot de passe"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            name="confirmPassword"
            className="form-control"
            placeholder="Confirmer le mot de passe"
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
          />
        </div>

        <button className="btn btn-warning mb-4" onClick={handlePasswordUpdate}>
          Modifier mot de passe
        </button>

        <hr />

        {/* Notifications */}
        <h5 className="mb-3">Notifications</h5>

        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            checked={user.notifications}
            onChange={() =>
              setUser({ ...user, notifications: !user.notifications })
            }
          />
          <label className="form-check-label">
            {user.notifications ? "Notifications activées" : "Notifications désactivées"}
          </label>
        </div>

      </div>
    </div>
  );
}

export default Settings;