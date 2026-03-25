// frontend/src/services/ticketService.js
import { api } from './api';

export const ticketService = {
  // Prédire la catégorie d'un ticket et le sauvegarder
  async predictAndSaveTicket(ticketText, userId = null) {
    try {
      const response = await api.post('/predict', {
        text: ticketText,
        user_id: userId || localStorage.getItem('userId')
      });
      return response;
    } catch (error) {
      console.error('Erreur prédiction:', error);
      throw error;
    }
  },

  // Récupérer tous les tickets
  async getAllTickets() {
    try {
      const tickets = await api.get('/tickets/');
      return tickets;
    } catch (error) {
      console.error('Erreur récupération tickets:', error);
      throw error;
    }
  },

  // Récupérer un ticket spécifique
  async getTicketById(ticketId) {
    try {
      const ticket = await api.get(`/tickets/${ticketId}`);
      return ticket;
    } catch (error) {
      console.error('Erreur récupération ticket:', error);
      throw error;
    }
  },

  // Récupérer les tickets d'un utilisateur
  async getUserTickets(userId) {
    try {
      const tickets = await api.get(`/tickets/user/${userId}`);
      return tickets;
    } catch (error) {
      console.error('Erreur récupération tickets utilisateur:', error);
      throw error;
    }
  },

  // Récupérer les tickets par statut
  async getTicketsByStatus(status) {
    try {
      const tickets = await api.get(`/tickets/status/${status}`);
      return tickets;
    } catch (error) {
      console.error('Erreur récupération tickets par statut:', error);
      throw error;
    }
  },

  // Mettre à jour le statut d'un ticket
  async updateTicketStatus(ticketId, status) {
    try {
      const response = await api.put(`/tickets/${ticketId}/status`, { status });
      return response;
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      throw error;
    }
  },

  // Supprimer un ticket
  async deleteTicket(ticketId) {
    try {
      const response = await api.delete(`/tickets/${ticketId}`);
      return response;
    } catch (error) {
      console.error('Erreur suppression ticket:', error);
      throw error;
    }
  },

  // Récupérer les statistiques des tickets
  async getTicketStats() {
    try {
      const stats = await api.get('/tickets/stats');
      return stats;
    } catch (error) {
      console.error('Erreur récupération statistiques:', error);
      throw error;
    }
  },
};