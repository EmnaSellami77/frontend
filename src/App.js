import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google'; // ← AJOUTE CET IMPORT

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Public pages
import HomePage from "./pages/HomePage";

// IT Auth
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
// IT Dashboard - Page unifiée (utilisée pour l'IT Consultant)
import UnifiedDashboard from "./pages/UnifiedDashboard";
import Settings from "./pages/Settings";

// Developer Auth
import DeveloperLogin from "./pages/DeveloperLogin";
import DeveloperSignup from "./pages/DeveloperSignup";

// Developer Dashboard
import DeveloperDashboard from "./pages/DeveloperDashboard";
import DeveloperSettings from "./pages/DeveloperSettings";
import TermsOfService from "./pages/TermsOfService";
// ⭐ AJOUTE CETTE CONSTANTE (ton client_id Google)
const GOOGLE_CLIENT_ID = "84499611206-pquink4aps0ked49ngi5t3rqk5p6ho6v.apps.googleusercontent.com";

function App() {
  return (
    // ⭐ ENVELOPPE TOUTE L'APPLICATION AVEC GoogleOAuthProvider
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Navbar />
        <Routes>
          {/* Pages publiques */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/terms" element={<TermsOfService />} />

          {/* Routes IT Consultant (protégées si nécessaire) */}
          <Route path="/dashboard" element={<UnifiedDashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          

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
    </GoogleOAuthProvider>
  );
}

export default App;