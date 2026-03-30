const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Fonction pour récupérer le token
const getToken = () => localStorage.getItem('token');

// Configuration des headers
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Service pour les tickets
export const ticketService = {
  // Récupérer tous les tickets
  getAllTickets: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${API_URL}/tickets${queryParams ? `?${queryParams}` : ''}`;
    const response = await fetch(url, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération des tickets');
    return response.json();
  },
  
  // Récupérer un ticket par ID
  getTicketById: async (id) => {
    const response = await fetch(`${API_URL}/tickets/${id}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Ticket non trouvé');
    return response.json();
  },
  
  // Créer un ticket
  createTicket: async (ticketData) => {
    const response = await fetch(`${API_URL}/tickets`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(ticketData)
    });
    if (!response.ok) throw new Error('Erreur lors de la création du ticket');
    return response.json();
  },
  
  // Mettre à jour un ticket
  updateTicket: async (id, ticketData) => {
    const response = await fetch(`${API_URL}/tickets/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(ticketData)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour');
    return response.json();
  },
  
  // Supprimer un ticket
  deleteTicket: async (id) => {
    const response = await fetch(`${API_URL}/tickets/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression');
    return response.json();
  },
  
  // Récupérer les statistiques
  getTicketStats: async () => {
    const response = await fetch(`${API_URL}/tickets/stats/summary`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération des stats');
    return response.json();
  },
  
  // Rechercher des tickets
  searchTickets: async (term) => {
    const response = await fetch(`${API_URL}/tickets/search/${term}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la recherche');
    return response.json();
  },
  
  // Récupérer les tickets d'un développeur
  getTicketsByDeveloper: async (developerName) => {
    const response = await fetch(`${API_URL}/tickets/developer/${developerName}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération');
    return response.json();
  }
};

// Service pour l'authentification
export const authService = {
  // Inscription
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'inscription');
    }
    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('role', data.user.role);
    return data;
  },
  
  // Connexion
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la connexion');
    }
    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('role', data.user.role);
    return data;
  },
  
  // Déconnexion
  logout: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (response.ok) {
        console.log('Déconnexion réussie');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    }
  },
  
  // Récupérer l'utilisateur courant
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  // Vérifier si l'utilisateur est authentifié
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  // Récupérer l'utilisateur courant depuis le serveur
  getMe: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Non authentifié');
    return response.json();
  }
};