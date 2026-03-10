import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Users, Clock, ShieldCheck } from 'lucide-react';
import { initAdmin } from '../api';

const Home = () => {
  useEffect(() => {
    // Attempt to initialize admin on first load
    initAdmin().catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="navbar">
        <h1>MSSQUARE TECHNOLOGIES</h1>
        <div className="flex gap-4">
          <Link to="/login" className="btn btn-primary" style={{ background: 'rgba(255,255,255,0.1)' }}>
            Login
          </Link>
        </div>
      </nav>

      <main className="flex-1 container flex flex-col items-center justify-center text-center">
        <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--primary)' }}>
            Real-Time Attendance Management
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
            A modern, secure, and efficient way to manage your workforce attendance. 
            Track check-ins, generate reports, and manage employees with ease.
          </p>

          <div className="grid grid-3" style={{ width: '100%', marginBottom: '4rem' }}>
            <div className="card">
              <Clock size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>Real-Time Tracking</h3>
              <p>Instant check-in and check-out with automatic timestamps.</p>
            </div>
            <div className="card">
              <Users size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>Employee Portal</h3>
              <p>Simple interface for employees to mark their daily attendance.</p>
            </div>
            <div className="card">
              <ShieldCheck size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>Admin Dashboard</h3>
              <p>Powerful tools for managers to track and export attendance data.</p>
            </div>
          </div>

          <div className="flex gap-6 justify-center">
            <Link to="/login" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
              <LogIn size={20} /> Get Started
            </Link>
          </div>
        </div>
      </main>

      <footer style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        &copy; 2026 MSSQUARE TECHNOLOGIES. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
