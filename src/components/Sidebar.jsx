import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse vh-100">
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link" to="/">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/tickets">Tickets</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/settings">Settings</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Sidebar;