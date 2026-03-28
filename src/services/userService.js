// src/services/userService.js
import { authService } from './authService';

export const userService = {
  async getCurrentUserProfile() {
    try {
      const user = authService.getCurrentUser();
      return user || null;
    } catch (error) {
      console.error('❌ Erreur récupération profil:', error);
      throw error;
    }
  },

  async updateProfile(userData) {
    try {
      console.warn('⚠️ Route de mise à jour profil non implémentée');
      return { error: 'Fonctionnalité à venir' };
    } catch (error) {
      console.error('❌ Erreur mise à jour profil:', error);
      throw error;
    }
  },

  async getAllUsers() {
    try {
      console.warn('⚠️ Route de liste utilisateurs non implémentée');
      return { users: [] };
    } catch (error) {
      console.error('❌ Erreur récupération utilisateurs:', error);
      throw error;
    }
  }
};