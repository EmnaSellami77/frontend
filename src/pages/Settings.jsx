import { useState } from "react";

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    )}
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [pwdSaved, setPwdSaved] = useState(false);

  const [user, setUser] = useState({
    nom: "Hajri",
    prenom: "Emna",
    email: "consultant.it@gmail.com",
    role: "IT Consultant",
    phone: "+216 98 765 432",
    location: "Tunis, Tunisie",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({ current: false, new: false, confirm: false });

  const calculateStrength = (pw) => {
    let s = 0;
    if (pw.length > 6) s++;
    if (pw.match(/[A-Z]/)) s++;
    if (pw.match(/[0-9]/)) s++;
    if (pw.match(/[^A-Za-z0-9]/)) s++;
    return s;
  };

  const strength = calculateStrength(passwords.newPassword);
  const strengthMeta = [
    { label: "Très faible", color: "#ef4444" },
    { label: "Faible", color: "#f97316" },
    { label: "Moyen", color: "#eab308" },
    { label: "Fort", color: "#22c55e" },
  ];

  const handleSaveProfile = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordUpdate = () => {
    if (passwords.newPassword !== passwords.confirmPassword) return;
    setPwdSaved(true);
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setPwdSaved(false), 2500);
  };

  const initials = `${user.prenom[0]}${user.nom[0]}`.toUpperCase();

  const tabs = [
    { id: "profile", label: "Profil", icon: <UserIcon /> },
    { id: "security", label: "Sécurité", icon: <LockIcon /> },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f4ff 0%, #fafafa 100%)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "40px 16px",
    }}>
      <div style={{ width: "100%", maxWidth: 720 }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: "-0.5px" }}>
            Paramètres du compte
          </h1>
          <p style={{ color: "#64748b", marginTop: 6, fontSize: 14 }}>
            Gérez vos informations personnelles et la sécurité de votre compte.
          </p>
        </div>

        {/* Profile Card */}
        <div style={{
          background: "#fff",
          borderRadius: 20,
          padding: "28px 32px",
          marginBottom: 20,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)",
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 22, flexShrink: 0,
            boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: "#0f172a" }}>
              {user.prenom} {user.nom}
            </div>
            <div style={{ color: "#64748b", fontSize: 14, marginTop: 2 }}>{user.email}</div>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "#ede9fe", color: "#7c3aed",
              fontSize: 11, fontWeight: 600, padding: "3px 10px",
              borderRadius: 20, marginTop: 8, letterSpacing: "0.3px",
            }}>
              <ShieldIcon /> {user.role}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: 4, background: "#f1f5f9",
          padding: 4, borderRadius: 12, marginBottom: 20,
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                gap: 8, padding: "10px 16px", border: "none", cursor: "pointer",
                borderRadius: 9, fontSize: 14, fontWeight: 600, transition: "all 0.2s",
                background: activeTab === tab.id ? "#fff" : "transparent",
                color: activeTab === tab.id ? "#0f172a" : "#64748b",
                boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Main Card */}
        <div style={{
          background: "#fff", borderRadius: 20,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}>

          {/* ===== PROFILE TAB ===== */}
          {activeTab === "profile" && (
            <div style={{ padding: "32px 32px" }}>
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                  Informations personnelles
                </h3>
                <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>
                  Modifiez vos informations de profil.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {[
                  { label: "Nom", name: "nom" },
                  { label: "Prénom", name: "prenom" },
                  { label: "Email", name: "email", type: "email", fullWidth: true },
                  { label: "Téléphone", name: "phone" },
                  { label: "Localisation", name: "location" },
                ].map(({ label, name, type = "text", fullWidth }) => (
                  <div key={name} style={{ gridColumn: fullWidth ? "1 / -1" : "auto" }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 7 }}>
                      {label}
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={user[name]}
                      onChange={e => setUser({ ...user, [name]: e.target.value })}
                      style={{
                        width: "100%", padding: "10px 14px",
                        border: "1.5px solid #e2e8f0", borderRadius: 10,
                        fontSize: 14, color: "#0f172a", outline: "none",
                        transition: "border-color 0.2s", boxSizing: "border-box",
                        background: "#fafafa",
                      }}
                      onFocus={e => e.target.style.borderColor = "#6366f1"}
                      onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </div>
                ))}

                {/* Role (disabled) */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 7 }}>
                    Rôle
                  </label>
                  <input
                    type="text"
                    value={user.role}
                    disabled
                    style={{
                      width: "100%", padding: "10px 14px",
                      border: "1.5px solid #e2e8f0", borderRadius: 10,
                      fontSize: 14, color: "#94a3b8", background: "#f8fafc",
                      cursor: "not-allowed", boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 14 }}>
                <button
                  onClick={handleSaveProfile}
                  style={{
                    padding: "11px 28px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    color: "#fff", border: "none", borderRadius: 10, fontWeight: 600,
                    fontSize: 14, cursor: "pointer", boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={e => e.target.style.opacity = "0.88"}
                  onMouseLeave={e => e.target.style.opacity = "1"}
                >
                  Enregistrer les modifications
                </button>
                {saved && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    color: "#22c55e", fontSize: 13, fontWeight: 600,
                    animation: "fadeIn 0.3s ease",
                  }}>
                    <CheckIcon /> Modifications enregistrées
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== SECURITY TAB ===== */}
          {activeTab === "security" && (
            <div style={{ padding: "32px 32px" }}>
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                  Modifier le mot de passe
                </h3>
                <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>
                  Utilisez un mot de passe fort et unique.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 440 }}>
                {[
                  { label: "Mot de passe actuel", name: "currentPassword", showKey: "current" },
                  { label: "Nouveau mot de passe", name: "newPassword", showKey: "new" },
                  { label: "Confirmer le mot de passe", name: "confirmPassword", showKey: "confirm" },
                ].map(({ label, name, showKey }) => {
                  const isConfirm = name === "confirmPassword";
                  const isNew = name === "newPassword";
                  const match = passwords.confirmPassword === passwords.newPassword && passwords.confirmPassword !== "";
                  const mismatch = passwords.confirmPassword !== "" && !match;

                  return (
                    <div key={name}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 7 }}>
                        {label}
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={show[showKey] ? "text" : "password"}
                          name={name}
                          value={passwords[name]}
                          onChange={e => setPasswords({ ...passwords, [name]: e.target.value })}
                          style={{
                            width: "100%", padding: "10px 44px 10px 14px",
                            border: `1.5px solid ${isConfirm && passwords.confirmPassword ? (match ? "#22c55e" : "#ef4444") : "#e2e8f0"}`,
                            borderRadius: 10, fontSize: 14, color: "#0f172a",
                            outline: "none", background: "#fafafa",
                            transition: "border-color 0.2s", boxSizing: "border-box",
                          }}
                          onFocus={e => { if (!isConfirm || !passwords.confirmPassword) e.target.style.borderColor = "#6366f1"; }}
                          onBlur={e => { if (!isConfirm || !passwords.confirmPassword) e.target.style.borderColor = "#e2e8f0"; }}
                        />
                        <button
                          onClick={() => setShow(s => ({ ...s, [showKey]: !s[showKey] }))}
                          style={{
                            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                            background: "none", border: "none", cursor: "pointer",
                            color: "#94a3b8", display: "flex", padding: 0,
                          }}
                        >
                          <EyeIcon open={show[showKey]} />
                        </button>
                      </div>

                      {/* Strength bar */}
                      {isNew && passwords.newPassword && (
                        <div style={{ marginTop: 10 }}>
                          <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                            {[1, 2, 3, 4].map(i => (
                              <div key={i} style={{
                                flex: 1, height: 4, borderRadius: 4,
                                background: i <= strength ? (strengthMeta[strength - 1]?.color || "#e2e8f0") : "#e2e8f0",
                                transition: "background 0.3s",
                              }} />
                            ))}
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: strengthMeta[strength - 1]?.color || "#94a3b8" }}>
                            {strengthMeta[strength - 1]?.label || "Très faible"}
                          </span>
                        </div>
                      )}

                      {/* Match message */}
                      {isConfirm && passwords.confirmPassword && (
                        <div style={{
                          marginTop: 7, fontSize: 12, fontWeight: 600,
                          color: match ? "#22c55e" : "#ef4444",
                          display: "flex", alignItems: "center", gap: 5,
                        }}>
                          {match ? <><CheckIcon /> Les mots de passe correspondent</> : "✖ Les mots de passe ne correspondent pas"}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 14 }}>
                <button
                  onClick={handlePasswordUpdate}
                  disabled={
                    !passwords.currentPassword ||
                    !passwords.newPassword ||
                    passwords.newPassword !== passwords.confirmPassword
                  }
                  style={{
                    padding: "11px 28px",
                    background: passwords.currentPassword && passwords.newPassword && passwords.newPassword === passwords.confirmPassword
                      ? "linear-gradient(135deg, #0f172a, #1e293b)"
                      : "#e2e8f0",
                    color: passwords.currentPassword && passwords.newPassword && passwords.newPassword === passwords.confirmPassword
                      ? "#fff" : "#94a3b8",
                    border: "none", borderRadius: 10, fontWeight: 600,
                    fontSize: 14, cursor: "pointer", transition: "all 0.2s",
                  }}
                >
                  Mettre à jour le mot de passe
                </button>
                {pwdSaved && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#22c55e", fontSize: 13, fontWeight: 600 }}>
                    <CheckIcon /> Mot de passe mis à jour
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}