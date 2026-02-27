import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ConsultantStyles.css';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTickets([
        {
          id: 1,
          title: 'Problème de connexion DB',
          status: 'pending',
          priority: 'high',
          createdBy: 'Jean Dupont',
          createdAt: '2026-02-27'
        },
        {
          id: 2,
          title: 'Bug interface login',
          status: 'in-progress',
          priority: 'medium',
          createdBy: 'Marie Martin',
          createdAt: '2026-02-26'
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="status-badge pending">En attente</span>;
      case 'in-progress':
        return <span className="status-badge progress">En cours</span>;
      case 'resolved':
        return <span className="status-badge resolved">Résolu</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="tickets-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="tickets-container fade-in">
      <h1>Gestion des tickets</h1>
      
      <div className="tickets-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Créateur</th>
              <th>Statut</th>
              <th>Priorité</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id}>
                <td>#{ticket.id}</td>
                <td>{ticket.title}</td>
                <td>{ticket.createdBy}</td>
                <td>{getStatusBadge(ticket.status)}</td>
                <td>
                  <span className={`priority-badge ${ticket.priority}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td>{ticket.createdAt}</td>
                <td>
                  <Link to={`/consultant/ticket/${ticket.id}`} className="btn-icon">
                    👁️
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketList;