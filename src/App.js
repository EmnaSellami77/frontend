// IMPORTATION UNIQUE DE REACT
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import HomePage from "./pages/HomePage";

// IT Consultant Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// IT Consultant Dashboard Pages
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import Settings from "./pages/Settings";

// Developer Auth Pages
import DeveloperLogin from "./pages/DeveloperLogin";
import DeveloperSignup from "./pages/DeveloperSignup";

// Developer Dashboard Pages
import DeveloperDashboard from "./pages/DeveloperDashboard";
import DeveloperSettings from "./pages/DeveloperSettings";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* ============ PUBLIC ROUTES ============ */}
        <Route path="/" element={<HomePage />} />

        {/* ============ IT CONSULTANT AUTH ROUTES ============ */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ============ DEVELOPER AUTH ROUTES ============ */}
        <Route path="/developer/login" element={<DeveloperLogin />} />
        
        {/* Route pour /register-dev (CELLE QUE VOUS UTILISEZ) */}
        <Route path="/register-dev" element={<DeveloperSignup />} />
        
        {/* Autres routes pour compatibilité */}
        <Route path="/developer/register" element={<DeveloperSignup />} />
        <Route path="/developer/signup" element={<DeveloperSignup />} />
        
        <Route path="/developer/forgot-password" element={<ForgotPassword role="developer" />} />

        {/* ============ IT CONSULTANT PROTECTED ROUTES ============ */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="it">
              <div className="container-fluid">
                <div className="row">
                  <Sidebar />
                  <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 mt-4">
                    <Dashboard />
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets"
          element={
            <ProtectedRoute allowedRole="it">
              <div className="container-fluid">
                <div className="row">
                  <Sidebar />
                  <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 mt-4">
                    <Tickets />
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRole="it">
              <div className="container-fluid">
                <div className="row">
                  <Sidebar />
                  <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 mt-4">
                    <Settings />
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* ============ DEVELOPER PROTECTED ROUTES ============ */}
        <Route
          path="/developer/dashboard"
          element={
            <ProtectedRoute allowedRole="developer">
              <DeveloperDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/developer/settings"
          element={
            <ProtectedRoute allowedRole="developer">
              <DeveloperSettings />
            </ProtectedRoute>
          }
        />

        {/* ============ 404 NOT FOUND ============ */}
        <Route
          path="*"
          element={
            <div style={styles.notFound}>
              <h1>404</h1>
              <p>Page non trouvée</p>
              <p>L'URL "{window.location.pathname}" n'existe pas</p>
              <a href="/" style={styles.homeLink}>Retour à l'accueil</a>
            </div>
          }
        />
      </Routes>

      <Footer />
    </Router>
  );
}

const styles = {
  notFound: {
    minHeight: "60vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "40px",
  },
  homeLink: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "500",
  },
};

export default App;