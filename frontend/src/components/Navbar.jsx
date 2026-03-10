import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Home, BarChart2, Users } from 'lucide-react';

const Navbar = ({ title }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="flex items-center gap-4">
        <h1 style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>MSSQUARE TECHNOLOGIES</h1>
        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)', margin: '0 1rem' }}></div>
        <div className="flex gap-4">
          <Link to={user.is_admin ? "/admin" : "/employee"} style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Home size={16} /> Home
          </Link>
          {user.is_admin && (
            <Link to="/reports" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart2 size={16} /> Reports
            </Link>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>{user.name} ({user.employee_id})</span>
        <button onClick={handleLogout} className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
