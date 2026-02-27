import React from 'react';
import { Link } from 'react-router-dom';

const MyTickets = () => {
  console.log('MyTickets chargé');
  return (
    <div>
      <h1>My Tickets</h1>
      <Link to="/developer/dashboard">Back</Link>
    </div>
  );
};

export default MyTickets;