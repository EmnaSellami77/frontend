import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './ConsultantStyles.css';

const TicketDetails = () => {
  const { id } = useParams();

  return (
    <div className="ticket-details fade-in">
      <h1>Détails du ticket #{id}</h1>
      <Link to="/consultant/tickets" className="btn btn-secondary">
        Retour à la liste
      </Link>
    </div>
  );
};

export default TicketDetails;