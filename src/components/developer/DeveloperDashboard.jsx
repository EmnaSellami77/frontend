import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './DeveloperStyles.css';

const DeveloperDashboard = () => {
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    criticalTickets: 0
  });

  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalTickets: 24,
        openTickets: 8,
        inProgressTickets: 5,
        resolvedTickets: 11,
        criticalTickets: 2
      });

      setRecentTickets([
        { id: 1, title: 'Problème de connexion DB', status: 'open', priority: 'high', date: '2026-02-27' },
        { id: 2, title: 'Bug dans l\'interface login', status: 'in-progress', priority: 'medium', date: '2026-02-26' },
        { id: 3, title: 'Ajout d\'une nouvelle fonctionnalité', status: 'open', priority: 'low', date: '2026-02-26' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return '#ff6b6b';
      case 'in-progress': return '#4ecdc4';
      case 'resolved': return '#95e1d3';
      default: return '#95a5a6';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>Tableau de bord Développeur</h1>
        <Link to="/developer/create-ticket" className="btn btn-primary">
          <span className="btn-icon">➕</span>
          Nouveau ticket
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total tickets</h3>
            <p className="stat-value">{stats.totalTickets}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>Ouverts</h3>
            <p className="stat-value">{stats.openTickets}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <h3>En cours</h3>
            <p className="stat-value">{stats.inProgressTickets}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Résolus</h3>
            <p className="stat-value">{stats.resolvedTickets}</p>
          </div>
        </div>
      </div>

      <div className="recent-tickets">
        <h2>Tickets récents</h2>
        <div className="tickets-list">
          {recentTickets.map(ticket => (
            <div key={ticket.id} className="ticket-item">
              <div className="ticket-info">
                <h4>{ticket.title}</h4>
                <div className="ticket-meta">
                  <span className="ticket-date">📅 {ticket.date}</span>
                  <span className="ticket-status" style={{backgroundColor: getStatusColor(ticket.status)}}>
                    {ticket.status}
                  </span>
                </div>
              </div>
              <Link to={`/consultant/ticket/${ticket.id}`} className="ticket-link">
                Voir détails →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;