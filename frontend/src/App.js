import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login.js';
import Dashboard from './pages/Dashboard';
import Reports from './pages/reports.js';
import Register from './pages/Register';
import Navbar from './components/NavBar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Listen for login/logout events to refresh the UI
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground font-sans antialiased">
        {/* Only show Navbar if authenticated */}
        {isAuthenticated && <Navbar />}

        <div className="App">
          <Routes>
            <Route path="/register" element={<Register />} />
            
            {/* Pass setIsAuthenticated to Login so it can trigger the UI update */}
            <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
            
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/reports" 
              element={isAuthenticated ? <Reports /> : <Navigate to="/login" />} 
            />
            
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;