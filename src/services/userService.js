// frontend/src/services/userService.js
import { api } from './api';

export const userService = {
  // Récupérer tous les utilisateurs
  async getAllUsers() {
    try {
      const users = await api.get('/auth/users');
      return users;
    } catch (error) {
      console.error('Erreur récupération utilisateurs:', error);
      throw error;
    }
  },

  // Récupérer un utilisateur spécifique
  async getUserById(userId) {
    try {
      const user = await api.get(`/auth/users/${userId}`);
      return user;
    } catch (error) {
      console.error('Erreur récupération utilisateur:', error);
      throw error;
    }
  },
};