// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DeveloperLogin from "./pages/DeveloperLogin";
import DeveloperSignup from "./pages/DeveloperSignup";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import Settings from "./pages/Settings";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* ================= HOME ================= */}
        <Route path="/" element={<HomePage />} />

        {/* ================= AUTH IT ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= AUTH DEVELOPER ================= */}
        <Route path="/developer/login" element={<DeveloperLogin />} />
        <Route path="/developer/register" element={<DeveloperSignup />} />

        {/* ================= IT DASHBOARD ================= */}
        <Route
          path="/dashboard"
          element={
            <div className="container-fluid">
              <div className="row">
                <Sidebar />
                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 mt-4">
                  <Dashboard />
                </main>
              </div>
            </div>
          }
        />

        {/* ================= DEVELOPER DASHBOARD ================= */}
        <Route
          path="/developer/dashboard"
          element={<DeveloperDashboard />}
        />

        {/* ================= OTHER PAGES ================= */}
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;