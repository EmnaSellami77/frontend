// frontend/src/services/authService.js
import { api } from './api';

export const authService = {
  // Inscription
  async signup(userData) {
    try {
      const response = await api.post('/auth/signup', userData);
      return response;
    } catch (error) {
      console.error('Erreur inscription:', error);
      throw error;
    }
  },

  // Connexion
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Sauvegarder les données utilisateur dans localStorage
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('role', response.user.role);
        localStorage.setItem('userId', response.user.id);
      }
      
      return response;
    } catch (error) {
      console.error('Erreur connexion:', error);
      throw error;
    }
  },

  // Déconnexion
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
  },

  // Récupérer l'utilisateur connecté
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return localStorage.getItem('user') !== null;
  },

  // Vérifier le rôle
  hasRole(role) {
    const userRole = localStorage.getItem('role');
    return userRole === role;
  },
};