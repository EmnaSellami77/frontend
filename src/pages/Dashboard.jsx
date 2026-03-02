import React from 'react';

function Dashboard() {
  const role = localStorage.getItem("role");

  return (
    <div className="dashboard-container">
   
      <h2 className="mb-4">Dashboard</h2>
      
      <h4 className="mb-4">Bienvenue {role === 'developer' ? 'Développeur' : 'Consultant IT'}</h4>

      <div className="row">
        <div className="col-md-4">
          <div className="card text-bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Tickets</h5>
              <p className="card-text fs-3">120</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Resolved</h5>
              <p className="card-text fs-3">95</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-bg-danger mb-3">
            <div className="card-body">
              <h5 className="card-title">Pending</h5>
              <p className="card-text fs-3">25</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
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
          <div className="card">
            <div className="card-header">
              Actions rapides
            </div>
            <div className="card-body">
              {role === 'developer' ? (
                <div className="d-grid gap-2">
                  <button className="btn btn-primary">Créer un nouveau ticket</button>
                  <button className="btn btn-outline-primary">Voir mes tickets</button>
                </div>
              ) : (
                <div className="d-grid gap-2">
                  <button className="btn btn-primary">Voir tous les tickets</button>
                  <button className="btn btn-outline-primary">Analyses et rapports</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// UN SEUL export default à la fin du fichier !
export default Dashboard;