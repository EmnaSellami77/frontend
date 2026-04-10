import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


// Public pages
import HomePage from "./pages/HomePage";

// IT Auth
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// IT Dashboard - Page unifiée (utilisée pour l'IT Consultant)
import UnifiedDashboard from "./pages/UnifiedDashboard";
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
        {/* Pages publiques */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Routes IT Consultant (protégées si nécessaire) */}
        <Route path="/dashboard" element={<UnifiedDashboard />} />
        <Route path="/settings" element={<Settings />} />

        {/* Routes Développeur */}
        <Route path="/developer/login" element={<DeveloperLogin />} />
        <Route path="/developer/register" element={<DeveloperSignup />} />
        <Route path="/developer/dashboard" element={<DeveloperDashboard />} />
        <Route path="/developer/settings" element={<DeveloperSettings />} />

        {/* Redirection par défaut (optionnelle) */}
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;