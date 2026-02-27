import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">

        {/* IT CONSULTANT */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center bg-primary text-white">
          <h1 className="mb-4">IT Consultant</h1>
          <p className="mb-4 text-center w-75">
            Accédez au système pour consulter et gérer les tickets IT.
          </p>

          <div className="d-flex gap-3">
            <Link to="/login-it" className="btn btn-light btn-lg">
              Login
            </Link>
            <Link to="/register-it" className="btn btn-outline-light btn-lg">
              Sign Up
            </Link>
          </div>
        </div>

        {/* DEVELOPPEUR */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center bg-dark text-white">
          <h1 className="mb-4">Développeur</h1>
          <p className="mb-4 text-center w-75">
            Accédez à votre espace pour traiter et classifier les tickets.
          </p>

          <div className="d-flex gap-3">
            <Link to="/login-dev" className="btn btn-warning btn-lg">
              Login
            </Link>
            <Link to="/register-dev" className="btn btn-outline-warning btn-lg">
              Sign Up
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default HomePage;