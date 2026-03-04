import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="container-fluid p-4">

      {/* HEADER STYLE DEV DASHBOARD */}
      <div
        className="d-flex justify-content-between align-items-center mb-4 p-4 rounded"
        style={{
          background: "linear-gradient(90deg, #1e293b, #0f172a)",
          color: "white",
        }}
      >
        <div>
          <h2 className="mb-1">IT Dashboard</h2>
          <h5 className="mb-0">
            Bienvenue {role === "developer" ? "Développeur" : "Consultant IT"}
          </h5>
        </div>

        <button
          className="btn btn-outline-light"
          onClick={handleLogout}
        >
          🔓 Déconnexion
        </button>
      </div>

      {/* CARDS STATISTIQUES */}
      <div className="row">
        <div className="col-md-4">
          <div className="card text-bg-primary mb-3 shadow">
            <div className="card-body">
              <h5 className="card-title">Total Tickets</h5>
              <p className="card-text fs-3">120</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-bg-success mb-3 shadow">
            <div className="card-body">
              <h5 className="card-title">Resolved</h5>
              <p className="card-text fs-3">95</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-bg-danger mb-3 shadow">
            <div className="card-body">
              <h5 className="card-title">Pending</h5>
              <p className="card-text fs-3">25</p>
            </div>
          </div>
        </div>
      </div>

      {/* PRIORITÉ + ACTIONS */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header fw-bold">
              Tickets par priorité
            </div>
            <div className="card-body">
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Haute priorité
                  <span className="badge bg-danger rounded-pill">15</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Priorité moyenne
                  <span className="badge bg-warning rounded-pill">45</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Basse priorité
                  <span className="badge bg-success rounded-pill">60</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header fw-bold">
              Actions rapides
            </div>
            <div className="card-body">
              {role === "developer" ? (
                <div className="d-grid gap-2">
                  <button className="btn btn-primary">
                    Créer un nouveau ticket
                  </button>
                  <button className="btn btn-outline-primary">
                    Voir mes tickets
                  </button>
                </div>
              ) : (
                <div className="d-grid gap-2">
                  <button className="btn btn-primary">
                    Voir tous les tickets
                  </button>
                  <button className="btn btn-outline-primary">
                    Analyses et rapports
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;