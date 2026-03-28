import React, { useState, useEffect } from 'react';
import { ticketService } from '../services';

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', category: '' });

  useEffect(() => {
    loadTickets();
  }, [filters]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketService.getAllTickets(filters);
      setTickets(response.tickets || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await ticketService.updateTicketStatus(id, newStatus);
      loadTickets();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) {
      try {
        await ticketService.deleteTicket(id);
        loadTickets();
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: 'badge bg-warning',
      in_progress: 'badge bg-info',
      resolved: 'badge bg-success',
      closed: 'badge bg-secondary'
    };
    return badges[status] || 'badge bg-secondary';
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      low: 'badge bg-success',
      medium: 'badge bg-warning',
      high: 'badge bg-danger',
      critical: 'badge bg-dark'
    };
    return badges[priority] || 'badge bg-secondary';
  };

  if (loading) {
    return (
      <div className="card shadow">
        <div className="card-body text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-2">Chargement des tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow">
      <div className="card-header bg-info text-white">
        <h4 className="mb-0">📋 Liste des tickets</h4>
      </div>
      <div className="card-body">
        {/* Filtres */}
        <div className="row mb-3">
          <div className="col-md-6">
            <select
              className="form-control"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">Tous les statuts</option>
              <option value="open">Ouvert</option>
              <option value="in_progress">En cours</option>
              <option value="resolved">Résolu</option>
              <option value="closed">Fermé</option>
            </select>
          </div>
          <div className="col-md-6">
            <select
              className="form-control"
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="">Toutes catégories</option>
              <option value="Matériel">Matériel</option>
              <option value="Logiciel">Logiciel</option>
              <option value="Réseau">Réseau</option>
              <option value="Sécurité">Sécurité</option>
              <option value="Serveur">Serveur</option>
              <option value="Email">Email</option>
            </select>
          </div>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center text-muted py-4">
            <p>Aucun ticket trouvé</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Titre</th>
                  <th>Catégorie</th>
                  <th>Statut</th>
                  <th>Priorité</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(ticket => (
                  <tr key={ticket._id}>
                    <td><strong>{ticket.title}</strong></td>
                    <td><span className="badge bg-secondary">{ticket.category}</span></td>
                    <td>
                      <span className={getStatusBadge(ticket.status)}>
                        {ticket.status}
                      </span>
                    </td>
                    <td>
                      <span className={getPriorityBadge(ticket.priority)}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                    <td>
                      <select
                        className="form-select form-select-sm d-inline-block w-auto me-2"
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                      >
                        <option value="open">Ouvert</option>
                        <option value="in_progress">En cours</option>
                        <option value="resolved">Résolu</option>
                        <option value="closed">Fermé</option>
                      </select>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(ticket._id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketList;