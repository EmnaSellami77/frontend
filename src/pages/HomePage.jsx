import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">

        {/* SIDEBAR */}
        <div className="col-md-3 d-flex flex-column justify-content-between p-4 text-white"
             style={{
               background: "linear-gradient(135deg, #1e3c72, #2a5298)"
             }}>
          
          <div>
            <h2 className="fw-bold mb-4">IT Support System</h2>
            <p>
              Système intelligent de classification et gestion des tickets IT.
            </p>
          </div>

          <div>
            <p className="small">© 2026 PFE Project</p>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="col-md-9 d-flex align-items-center justify-content-center bg-light">

          <div className="row w-100 px-5">

            {/* IT CONSULTANT CARD */}
            <div className="col-md-6 mb-4">
              <div className="card shadow-lg border-0 h-100 text-center p-4">
                <h3 className="mb-3 text-primary fw-bold">IT Consultant</h3>
                <p className="text-muted">
                  Consultez, créez et suivez les tickets IT.
                </p>

                <div className="mt-4 d-flex justify-content-center gap-3">
                  <Link to="/dashboard" className="btn btn-primary px-4">
                    Login
                  </Link>
                  <Link to="/register-it" className="btn btn-outline-primary px-4">
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>

            {/* DEVELOPPEUR CARD */}
            <div className="col-md-6 mb-4">
              <div className="card shadow-lg border-0 h-100 text-center p-4">
                <h3 className="mb-3 text-success fw-bold">Développeur</h3>
                <p className="text-muted">
                  Traitez et analysez les tickets avec intelligence.
                </p>

                <div className="mt-4 d-flex justify-content-center gap-3">
                  <Link to="/dashboard" className="btn btn-success px-4">
                    Login
                  </Link>
                  <Link to="/register-dev" className="btn btn-outline-success px-4">
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default HomePage;