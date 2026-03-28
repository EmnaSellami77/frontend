// src/services/ticketService.js
import { api } from './api';

export const ticketService = {
  async predict(ticketData) {
    try {
      const response = await api.post('/predict', {
        text: ticketData.description || ticketData.text,
        title: ticketData.title,
        priority: ticketData.priority || 'medium',
        user_id: ticketData.userId || localStorage.getItem('userId')
      });
      console.log('✅ Ticket créé avec prédiction:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur prédiction:', error);
      throw error;
    }
  },

  async getAllTickets(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.userId) params.append('user_id', filters.userId);
      if (filters.limit) params.append('limit', filters.limit || 50);
      if (filters.skip) params.append('skip', filters.skip || 0);
      
      const endpoint = `/tickets${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(endpoint);
      console.log('✅ Tickets récupérés:', response.total);
      return response;
    } catch (error) {
      console.error('❌ Erreur récupération tickets:', error);
      throw error;
    }
  },

  async getTicketById(ticketId) {
    try {
      const response = await api.get(`/tickets/${ticketId}`);
      console.log('✅ Ticket récupéré:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur récupération ticket:', error);
      throw error;
    }
  },

  async updateTicketStatus(ticketId, status) {
    try {
      const response = await api.put(`/tickets/${ticketId}/status`, { status });
      console.log('✅ Statut mis à jour:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur mise à jour statut:', error);
      throw error;
    }
  },

  async updateTicket(ticketId, updateData) {
    try {
      const response = await api.put(`/tickets/${ticketId}`, updateData);
      console.log('✅ Ticket mis à jour:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur mise à jour ticket:', error);
      throw error;
    }
  },

  async deleteTicket(ticketId) {
    try {
      const response = await api.delete(`/tickets/${ticketId}`);
      console.log('✅ Ticket supprimé:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur suppression ticket:', error);
      throw error;
    }
  },

  async getTicketsByCategory(category) {
    try {
      const response = await api.get(`/tickets/category/${category}`);
      console.log(`✅ Tickets de la catégorie ${category}:`, response.count);
      return response;
    } catch (error) {
      console.error('❌ Erreur récupération par catégorie:', error);
      throw error;
    }
  },

  async getTicketStats() {
    try {
      const response = await api.get('/stats');
      console.log('✅ Statistiques récupérées:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur récupération statistiques:', error);
      throw error;
    }
  },

  async healthCheck() {
    try {
      const response = await api.get('/health');
      console.log('✅ Serveur en ligne:', response);
      return response;
    } catch (error) {
      console.error('❌ Serveur indisponible:', error);
      throw error;
    }
  }
};