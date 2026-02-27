import React from 'react';
import { Link } from 'react-router-dom';

const CreateTicket = () => {
  console.log('CreateTicket chargé');
  return (
    <div>
      <h1>Create Ticket</h1>
      <Link to="/developer/dashboard">Back</Link>
    </div>
  );
};

export default CreateTicket;