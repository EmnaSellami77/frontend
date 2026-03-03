import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function HomePage() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const d = dark;

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .page-wrap {
      min-height: 100vh;
      background: ${d ? "#080e1a" : "#f4f6fb"};
      font-family: 'DM Sans', sans-serif;
      color: ${d ? "#e8edf7" : "#0d1b35"};
      transition: background 0.4s ease, color 0.4s ease;
    }

    /* ── NAVBAR ── */
    .navbar-pro {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 3rem;
      height: 68px;
      background: ${d ? "rgba(8,14,26,0.9)" : "rgba(255,255,255,0.9)"};
      border-bottom: 1px solid ${d ? "#1e2e4a" : "#e2e6f0"};
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 100;
      backdrop-filter: blur(14px);
      transition: background 0.4s ease, border-color 0.4s ease;
    }

    .navbar-brand-pro {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 1.15rem;
      color: ${d ? "#e8edf7" : "#0d1b35"};
      letter-spacing: -0.5px;
      text-decoration: none;
    }

    .brand-icon-pro {
      width: 34px; height: 34px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px;
    }

    .navbar-right-pro {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .nav-badge-pro {
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      color: ${d ? "#5a6f94" : "#7a88a8"};
      text-transform: uppercase;
    }

    /* Dark mode toggle pill */
    .dm-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px 6px 8px;
      background: ${d ? "#162035" : "#eef1f8"};
      border: 1px solid ${d ? "#1e2e4a" : "#e2e6f0"};
      border-radius: 999px;
      cursor: pointer;
      transition: background 0.3s, border-color 0.3s;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.78rem;
      font-weight: 500;
      color: ${d ? "#94a3c0" : "#5a6880"};
    }

    .dm-pill:hover {
      background: ${d ? "#1e2e4a" : "#e2e8f4"};
    }

    .dm-icon-circle {
      width: 26px; height: 26px;
      border-radius: 50%;
      background: ${d ? "#2563eb" : "#ffffff"};
      display: flex; align-items: center; justify-content: center;
      font-size: 13px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      transition: background 0.3s;
    }

    /* ── BG BLOBS ── */
    .blob {
      position: fixed;
      border-radius: 50%;
      filter: blur(90px);
      pointer-events: none;
      z-index: 0;
      opacity: ${d ? 0.07 : 0.06};
    }
    .blob1 { width: 500px; height: 500px; background: #2563eb; top: -120px; right: -100px; }
    .blob2 { width: 400px; height: 400px; background: #059669; bottom: -80px; left: -80px; }

    /* ── HERO ── */
    .hero-pro {
      position: relative;
      z-index: 1;
      padding-top: 68px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .hero-header {
      padding: 5rem 2rem 2.5rem;
      text-align: center;
      opacity: ${mounted ? 1 : 0};
      transform: translateY(${mounted ? "0px" : "22px"});
      transition: opacity 0.65s ease, transform 0.65s ease;
    }

    .eyebrow-pro {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: ${d ? "rgba(37,99,235,0.14)" : "rgba(37,99,235,0.07)"};
      border: 1px solid ${d ? "rgba(37,99,235,0.28)" : "rgba(37,99,235,0.18)"};
      color: #2563eb;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 5px 14px;
      border-radius: 999px;
      margin-bottom: 1.6rem;
    }

    .pulse-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #2563eb;
      animation: pdot 2.2s infinite;
    }

    @keyframes pdot {
      0%,100% { opacity:1; transform:scale(1); }
      50%      { opacity:0.3; transform:scale(0.6); }
    }

    .hero-h1 {
      font-family: 'Syne', sans-serif;
      font-size: clamp(2rem, 5vw, 3.4rem);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -1.5px;
      color: ${d ? "#e8edf7" : "#0d1b35"};
      margin-bottom: 1rem;
    }

    .hero-h1 .grad {
      background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-sub-pro {
      font-size: 1rem;
      color: ${d ? "#5a6f94" : "#7a88a8"};
      max-width: 460px;
      margin: 0 auto 2.5rem;
      line-height: 1.75;
      font-weight: 300;
    }

    .divider-accent {
      width: 48px; height: 2px;
      background: linear-gradient(90deg, #2563eb, transparent);
      margin: 0 auto 3rem;
      border-radius: 2px;
    }

    /* ── CARDS ── */
    .cards-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 420px));
      gap: 1.5rem;
      justify-content: center;
      padding: 0 2rem 5rem;
      opacity: ${mounted ? 1 : 0};
      transform: translateY(${mounted ? "0px" : "28px"});
      transition: opacity 0.65s ease 0.18s, transform 0.65s ease 0.18s;
    }

    .role-card-pro {
      background: ${d ? "#0f1829" : "#ffffff"};
      border: 1px solid ${d ? "#1e2e4a" : "#e2e6f0"};
      border-radius: 20px;
      padding: 2.4rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      position: relative;
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    }

    .role-card-pro::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      border-radius: 20px 20px 0 0;
    }

    .role-card-pro.blue::after { background: linear-gradient(90deg, #2563eb, #7c3aed); }
    .role-card-pro.green::after { background: linear-gradient(90deg, #059669, #0ea5e9); }

    .role-card-pro:hover {
      transform: translateY(-7px);
      box-shadow: ${d ? "0 28px 52px rgba(0,0,0,0.55)" : "0 28px 52px rgba(13,27,53,0.1)"};
      border-color: ${d ? "#2e3f60" : "#d0d8ec"};
    }

    .card-icon-pro {
      width: 50px; height: 50px;
      border-radius: 13px;
      display: flex; align-items: center; justify-content: center;
      font-size: 21px;
    }
    .blue .card-icon-pro  { background: ${d ? "rgba(37,99,235,0.14)" : "rgba(37,99,235,0.08)"}; }
    .green .card-icon-pro { background: ${d ? "rgba(5,150,105,0.14)" : "rgba(5,150,105,0.08)"}; }

    .card-role-label {
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    .blue .card-role-label  { color: #2563eb; }
    .green .card-role-label { color: #059669; }

    .card-role-title {
      font-family: 'Syne', sans-serif;
      font-size: 1.45rem;
      font-weight: 800;
      color: ${d ? "#e8edf7" : "#0d1b35"};
      letter-spacing: -0.4px;
    }

    .card-role-desc {
      font-size: 0.875rem;
      color: ${d ? "#5a6f94" : "#7a88a8"};
      line-height: 1.7;
      font-weight: 300;
      flex: 1;
    }

    .card-tags-pro {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
    }

    .tag-pro {
      font-size: 0.7rem;
      font-weight: 500;
      padding: 4px 10px;
      border-radius: 7px;
      background: ${d ? "#162035" : "#eef1f8"};
      color: ${d ? "#5a6f94" : "#7a88a8"};
      border: 1px solid ${d ? "#1e2e4a" : "#e2e6f0"};
    }

    .card-actions-pro {
      display: flex;
      gap: 10px;
      margin-top: 6px;
    }

    .btn-fill {
      flex: 1;
      padding: 11px 0;
      border-radius: 10px;
      border: none;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      text-align: center;
      color: #fff;
      transition: opacity 0.2s, transform 0.15s;
    }
    .btn-fill:hover { opacity: 0.86; transform: scale(0.98); color: #fff; }
    .blue  .btn-fill  { background: #2563eb; }
    .green .btn-fill  { background: #059669; }

    .btn-ghost {
      flex: 1;
      padding: 11px 0;
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      text-align: center;
      background: transparent;
      transition: background 0.2s, transform 0.15s;
    }
    .btn-ghost:hover { transform: scale(0.98); }
    .blue .btn-ghost  { border: 1.5px solid ${d ? "rgba(37,99,235,0.4)" : "#2563eb"}; color: #2563eb; }
    .blue .btn-ghost:hover  { background: rgba(37,99,235,0.07); }
    .green .btn-ghost { border: 1.5px solid ${d ? "rgba(5,150,105,0.4)" : "#059669"}; color: #059669; }
    .green .btn-ghost:hover { background: rgba(5,150,105,0.07); }

    /* ── FOOTER ── */
    .footer-pro {
      text-align: center;
      padding: 1.25rem;
      font-size: 0.74rem;
      color: ${d ? "#3a4e6a" : "#b0b9cc"};
      border-top: 1px solid ${d ? "#1e2e4a" : "#e2e6f0"};
      background: ${d ? "rgba(8,14,26,0.6)" : "rgba(255,255,255,0.6)"};
      transition: all 0.4s ease;
      position: relative; z-index: 1;
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div className="page-wrap">
        <div className="blob blob1" />
        <div className="blob blob2" />

        {/* ── NAVBAR ── */}
        <nav className="navbar-pro">
          <div className="navbar-brand-pro">
            <div className="brand-icon-pro">🖥️</div>
            IT Support System
          </div>
          <div className="navbar-right-pro">
            <span className="nav-badge-pro">PFE · 2026</span>
            <button
              className="dm-pill"
              onClick={() => setDark(!dark)}
              aria-label="Toggle dark mode"
            >
              <span className="dm-icon-circle">{d ? "☀️" : "🌙"}</span>
              {d ? "Mode clair" : "Mode sombre"}
            </button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <div className="hero-pro">
          <div className="hero-header">
            <div className="eyebrow-pro">
              <span className="pulse-dot" />
              Système de gestion des tickets
            </div>
            <h1 className="hero-h1">
              Gérez vos tickets IT<br />
              avec <span className="grad">intelligence</span>
            </h1>
            <p className="hero-sub-pro">
              Classification automatique, suivi en temps réel<br />
              et résolution efficace des incidents IT.
            </p>
            <div className="divider-accent" />
          </div>

          {/* ── CARDS ── */}
          <div className="cards-row">

            {/* IT Consultant */}
            <div className="role-card-pro blue">
              <div className="card-icon-pro">🧑‍💼</div>
              <div>
                <div className="card-role-label">Accès Consultant</div>
                <div className="card-role-title">IT Consultant</div>
              </div>
              <p className="card-role-desc">
                Soumettez, consultez et suivez vos tickets IT en temps réel depuis un tableau de bord centralisé et intuitif.
              </p>
              <div className="card-tags-pro">
                <span className="tag-pro">📋 Tickets</span>
                <span className="tag-pro">📊 Suivi</span>
                <span className="tag-pro">🔔 Alertes</span>
              </div>
              <div className="card-actions-pro">
                <Link to="/login" className="btn-fill">Se connecter</Link>
                <Link to="/register" className="btn-ghost">S'inscrire</Link>
              </div>
            </div>

            {/* Développeur */}
            <div className="role-card-pro green">
              <div className="card-icon-pro">👨‍💻</div>
              <div>
                <div className="card-role-label">Accès Développeur</div>
                <div className="card-role-title">Développeur</div>
              </div>
              <p className="card-role-desc">
                Analysez, classifiez et résolvez les tickets avec des outils intelligents et une vue complète des incidents en cours.
              </p>
              <div className="card-tags-pro">
                <span className="tag-pro">🤖 IA</span>
                <span className="tag-pro">⚙️ Analyse</span>
                <span className="tag-pro">🛠️ Résolution</span>
              </div>
              <div className="card-actions-pro">
                <Link to="/developer/link" className="btn-fill">Se connecter</Link>
                <Link to="/register-dev" className="btn-ghost">S'inscrire</Link>
              </div>
            </div>

          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="footer-pro">
          © 2026 IT Support System · PFE Project · Tous droits réservés
        </footer>
      </div>
    </>
  );
}

export default HomePage;