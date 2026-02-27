import React from 'react';
import { Link } from 'react-router-dom';

const ConsultantDashboard = () => {
  console.log('ConsultantDashboard chargé');
  return (
    <div>
      <h1>Consultant Dashboard</h1>
      <Link to="/consultant/tickets">View Tickets</Link>
    </div>
  );
};

export default ConsultantDashboard;