import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import HomePage from "./pages/HomePage";

// IT Auth
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// IT Dashboard
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import Settings from "./pages/Settings";

// Developer Auth
import DeveloperLogin from "./pages/DeveloperLogin";
import DeveloperSignup from "./pages/DeveloperSignup";

// Developer Dashboard
import DeveloperDashboard from "./pages/DeveloperDashboard";
import DeveloperSettings from "./pages/DeveloperSettings";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<HomePage />} />

        {/* IT AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* DEVELOPER AUTH */}
        <Route path="/developer/login" element={<DeveloperLogin />} />
        <Route path="/developer/register" element={<DeveloperSignup />} />

        {/* IT DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="it">
              <div style={{ display: "flex" }}>
                <Sidebar />
                <main style={{ flex: 1, padding: "20px" }}>
                  <Dashboard />
                </main>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets"
          element={
            <ProtectedRoute allowedRole="it">
              <div style={{ display: "flex" }}>
                <Sidebar />
                <main style={{ flex: 1, padding: "20px" }}>
                  <Tickets />
                </main>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRole="it">
              <div style={{ display: "flex" }}>
                <Sidebar />
                <main style={{ flex: 1, padding: "20px" }}>
                  <Settings />
                </main>
              </div>
            </ProtectedRoute>
          }
        />

        {/* DEVELOPER DASHBOARD */}
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

        {/* 404 */}
        <Route path="*" element={<HomePage />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;