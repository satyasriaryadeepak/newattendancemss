import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeePortal from './pages/EmployeePortal';
import Reports from './pages/Reports';

const App = () => {
  const isAuthenticated = () => !!localStorage.getItem('token');
  const isAdmin = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.is_admin;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/admin/*" 
          element={isAuthenticated() && isAdmin() ? <AdminDashboard /> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/employee" 
          element={isAuthenticated() ? <EmployeePortal /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/reports" 
          element={isAuthenticated() && isAdmin() ? <Reports /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
