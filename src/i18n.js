import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      dashboard: "Dashboard",
      tickets: "Tickets",
      settings: "Settings",
      welcome: "Welcome"
    }
  },

  fr: {
    translation: {
      login: "Connexion",
      signup: "Créer un compte",
      logout: "Déconnexion",
      dashboard: "Tableau de bord",
      tickets: "Tickets",
      settings: "Paramètres",
      welcome: "Bienvenue"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;