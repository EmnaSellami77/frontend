// src/services/authService.js
import { api } from './api';

export const authService = {
  async signup(userData) {
    try {
      const response = await api.post('/auth/signup', {
        name: userData.name || userData.fullName,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'user'
      });
      console.log('✅ Inscription réussie:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur inscription:', error);
      throw error;
    }
  },

  async login(credentials) {
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('userId', response.user.id);
        localStorage.setItem('userRole', response.user.role);
        localStorage.setItem('userName', response.user.name);
        
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      }
      
      console.log('✅ Connexion réussie:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur connexion:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    console.log('👋 Déconnexion effectuée');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return localStorage.getItem('user') !== null;
  },

  getRole() {
    return localStorage.getItem('userRole');
  },

  getUserId() {
    return localStorage.getItem('userId');
  },

  getUserName() {
    return localStorage.getItem('userName');
  }
};