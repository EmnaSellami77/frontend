import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';

function App() {
  return (
    <Router>
      <div>
        <Navbar userRole="developer" onLogout={() => console.log('logout')} />
        <Routes>
          <Route path="/" element={<Login onLogin={(role) => console.log('Login')} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;