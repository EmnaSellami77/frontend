// frontend/src/services/authService.js
import { api } from './api';

export const authService = {
  // Inscription - utilise /signup (pas /api/auth/signup)
  async signup(userData) {
    try {
      const response = await api.post('/signup', {
        name: userData.fullName,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'developer'
      });
      return response;
    } catch (error) {
      console.error('Erreur inscription:', error);
      throw error;
    }
  },

  // Connexion - utilise /login (pas /api/auth/login)
  async login(credentials) {
    try {
      const response = await api.post('/login', {
        email: credentials.email,
        password: credentials.password
      });
      
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

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return localStorage.getItem('user') !== null;
  },

  getRole() {
    return localStorage.getItem('role');
  }
};