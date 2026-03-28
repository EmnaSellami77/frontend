// src/services/index.js

// Exporter tous les services
export { api } from './api';
export { authService } from './authService';
export { ticketService } from './ticketService';
export { userService } from './userService';

// Créer un objet pour l'export par défaut
const services = {
  api: require('./api').api,
  authService: require('./authService').authService,
  ticketService: require('./ticketService').ticketService,
  userService: require('./userService').userService
};

// Exporter par défaut
export default services;