// frontend/src/services/ticketService.js
import { api } from './api';

export const ticketService = {
  // Prédire et sauvegarder un ticket
  async predictAndSave(text, userId = null) {
    try {
      const response = await api.post('/predict', {
        text: text,
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
      return await api.get('/tickets');
    } catch (error) {
      console.error('Erreur récupération tickets:', error);
      throw error;
    }
  },

  // Récupérer les tickets d'un utilisateur
  async getUserTickets(userId) {
    try {
      // Votre backend actuel n'a pas de route /tickets/user/:id
      // Pour l'instant, on retourne tous les tickets
      return await this.getAllTickets();
    } catch (error) {
      console.error('Erreur récupération tickets utilisateur:', error);
      throw error;
    }
  },

  // Récupérer les tickets par statut
  async getTicketsByStatus(status) {
    try {
      // Votre backend n'a pas cette route, on filtre côté client
      const allTickets = await this.getAllTickets();
      return allTickets.filter(ticket => ticket.status === status);
    } catch (error) {
      console.error('Erreur récupération tickets par statut:', error);
      throw error;
    }
  },

  // Mettre à jour le statut d'un ticket
  async updateStatus(ticketId, status) {
    try {
      return await api.put(`/tickets/${ticketId}/status`, { status });
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      throw error;
    }
  },

  // Supprimer un ticket
  async deleteTicket(ticketId) {
    try {
      return await api.delete(`/tickets/${ticketId}`);
    } catch (error) {
      console.error('Erreur suppression ticket:', error);
      throw error;
    }
  },

  // Récupérer les statistiques
  async getStats() {
    try {
      const tickets = await this.getAllTickets();
      // Calculer les stats côté client
      const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        in_progress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
        closed: tickets.filter(t => t.status === 'closed').length,
        categories: {}
      };
      
      tickets.forEach(ticket => {
        if (ticket.category) {
          stats.categories[ticket.category] = (stats.categories[ticket.category] || 0) + 1;
        }
      });
      
      return stats;
    } catch (error) {
      console.error('Erreur récupération statistiques:', error);
      throw error;
    }
  }
};