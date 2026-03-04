import { useState } from "react";
import { Link } from "react-router-dom";
import capLogo from "../cap.png";

function HomePage() {
  const [dark, setDark] = useState(false);

  return (
    <div
      className="container-fluid vh-100 p-0"
      style={{
        fontFamily: "'Segoe UI', sans-serif",
        background: dark ? "#0f172a" : "#f8fafc",
        transition: "background 0.4s ease",
        position: "relative",
      }}
    >
      {/* ===== LOGO TOP RIGHT (NO FRAME) ===== */}
      <img
        src={capLogo}
        alt="CAP Enterprise Logo"
        style={{
          position: "absolute",
          top: "25px",
          right: "40px",
          width: "160px",
          height: "auto",
          objectFit: "contain",
          zIndex: 10,
        }}
      />

      <div className="row g-0 h-100">

        {/* ===== SIDEBAR ===== */}
        <div
          className="col-md-3 d-flex flex-column justify-content-between p-4 text-white"
          style={{
            background: dark ? "#0f172a" : "#2563eb",
            transition: "background 0.4s ease",
            position: "relative",
          }}
        >
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDark(!dark)}
            title={dark ? "Mode clair" : "Mode sombre"}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              width: "44px",
              height: "24px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              background: dark ? "#facc15" : "rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              padding: "2px 4px",
            }}
          >
            <span
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: dark ? "#2563eb" : "#fff",
                transform: dark ? "translateX(20px)" : "translateX(0px)",
                transition: "0.3s",
                fontSize: "11px",
                lineHeight: "18px",
                textAlign: "center",
              }}
            >
              {dark ? "☀️" : "🌙"}
            </span>
          </button>

          <div>
            <h2 className="fw-bold mb-4">IT Support System</h2>
            <p style={{ opacity: 0.9 }}>
              Plateforme intelligente de gestion et classification automatique
              des tickets IT basée sur l'IA.
            </p>
          </div>

        </div>

        {/* ===== MAIN CONTENT ===== */}
        <div className="col-md-9 d-flex align-items-center justify-content-center">
          <div className="w-100 px-5 text-center">

            {/* HERO SECTION */}
            <div className="mb-5">
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 18px",
                  borderRadius: "999px",
                  background: dark ? "#1e293b" : "#dbeafe",
                  color: "#2563eb",
                  fontSize: "14px",
                  letterSpacing: "1px",
                  fontWeight: "600",
                  marginBottom: "20px",
                }}
              >
                • SYSTÈME DE GESTION DES TICKETS
              </span>

              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: "800",
                  lineHeight: "1.2",
                  color: dark ? "#f1f5f9" : "#0f172a",
                }}
              >
                Gérez vos tickets IT <br />
                avec <span style={{ color: "#2563eb" }}>intelligence</span>
              </h1>

              <p
                style={{
                  marginTop: "20px",
                  fontSize: "18px",
                  color: dark ? "#94a3b8" : "#64748b",
                }}
              >
                Classification automatique, suivi en temps réel
                <br />
                et résolution efficace des incidents IT.
              </p>
            </div>

            {/* CARDS SECTION */}
            <div className="row">

              {/* IT CONSULTANT */}
              <div className="col-md-6 mb-4">
                <div
                  className="card border-0 h-100 text-center p-4 card-hover"
                  style={{
                    background: dark ? "#1e293b" : "#ffffff",
                    boxShadow: dark
                      ? "0 8px 32px rgba(0,0,0,0.4)"
                      : "0 8px 32px rgba(0,0,0,0.08)",
                    borderRadius: "16px",
                  }}
                >
                  <h3 className="mb-3 fw-bold" style={{ color: "#2563eb" }}>
                    IT Consultant
                  </h3>
                  <p style={{ color: dark ? "#94a3b8" : "#6c757d" }}>
                    Consultez, créez et suivez les tickets IT.
                  </p>
                  <div className="mt-4 d-flex justify-content-center gap-3">
                    <Link to="/login" className="btn btn-primary px-4">
                      Login
                    </Link>
                    <Link to="/register" className="btn btn-outline-primary px-4">
                      Sign Up
                    </Link>
                  </div>
                </div>
              </div>

              {/* DEVELOPPEUR */}
              <div className="col-md-6 mb-4">
                <div
                  className="card border-0 h-100 text-center p-4 card-hover"
                  style={{
                    background: dark ? "#1e293b" : "#ffffff",
                    boxShadow: dark
                      ? "0 8px 32px rgba(0,0,0,0.4)"
                      : "0 8px 32px rgba(0,0,0,0.08)",
                    borderRadius: "16px",
                  }}
                >
                  <h3 className="mb-3 fw-bold" style={{ color: "#2563eb" }}>
                    Développeur
                  </h3>
                  <p style={{ color: dark ? "#94a3b8" : "#6c757d" }}>
                    Traitez et analysez les tickets IT.
                  </p>
                  <div className="mt-4 d-flex justify-content-center gap-3">
                    <Link to="/developer/login" className="btn btn-primary px-4">
                      Login
                    </Link>
                    <Link to="/register-dev" className="btn btn-outline-primary px-4">
                      Sign Up
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Hover Animation */}
      <style>{`
        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}

export default HomePage;