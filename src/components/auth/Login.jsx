import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login onLogin={(role) => console.log('Login avec rôle:', role)} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;