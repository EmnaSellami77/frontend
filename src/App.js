import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


// Layout
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages IT
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";

// Pages Developer
import DeveloperLogin from "./pages/DeveloperLogin";
import DeveloperSignup from "./pages/DeveloperSignup";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import DeveloperSettings from "./pages/DeveloperSettings";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* IT Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Developer Auth */}
        <Route path="/developer/login" element={<DeveloperLogin />} />
        <Route path="/developer/register" element={<DeveloperSignup />} />

        {/* IT Dashboard */}
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

        {/* Developer Dashboard */}
        <Route
          path="/developer/dashboard"
          element={
            <ProtectedRoute allowedRole="developer">
              <DeveloperDashboard />
            </ProtectedRoute>
          }
        />

        {/* IT Pages */}
        <Route
          path="/tickets"
          element={
            <ProtectedRoute allowedRole="it">
              <Tickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRole="it">
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Developer Settings */}
        <Route
          path="/developer/settings"
          element={
            <ProtectedRoute allowedRole="developer">
              <DeveloperSettings />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;