import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Clock, CheckCircle, LogIn, LogOut, Calendar } from 'lucide-react';
import { getAttendanceStatus, checkIn, checkOut } from '../api';

const EmployeePortal = () => {
  const [status, setStatus] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await getAttendanceStatus();
      setStatus(res.data);
    } catch (err) {
      console.error('Error fetching status', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      const res = await checkIn();
      setMessage(res.data.message);
      fetchStatus();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await checkOut();
      setMessage(res.data.message);
      fetchStatus();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Check-out failed');
    }
  };

  if (loading && !status) return <div className="container">Loading...</div>;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container animate-fade-in" style={{ maxWidth: '600px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Welcome, {status?.name}!</h2>
          <p style={{ color: 'var(--text-muted)' }}>Employee ID: {status?.employee_id}</p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '3rem', marginBottom: '2rem' }}>
          <Calendar size={24} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>
            {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h3>
          <h1 style={{ fontSize: '4rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '2rem' }}>
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
          </h1>

          <div style={{ 
            display: 'inline-flex', 
            padding: '0.5rem 1rem', 
            borderRadius: '2rem', 
            background: status?.status === 'Present' ? '#dcfce7' : '#f1f5f9',
            color: status?.status === 'Present' ? '#166534' : '#64748b',
            marginBottom: '3rem',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600'
          }}>
            <CheckCircle size={18} /> Status: {status?.status}
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <button 
              onClick={handleCheckIn} 
              disabled={status?.check_in || status?.status === 'Present'}
              className="btn btn-primary" 
              style={{ padding: '1.25rem', fontSize: '1.125rem', opacity: (status?.check_in) ? 0.6 : 1 }}
            >
              <LogIn size={20} /> Check In
            </button>
            <button 
              onClick={handleCheckOut} 
              disabled={!status?.check_in || status?.check_out}
              className="btn" 
              style={{ 
                padding: '1.25rem', 
                fontSize: '1.125rem', 
                background: '#f8fafc', 
                border: '2px solid var(--primary)', 
                color: 'var(--primary)',
                opacity: (!status?.check_in || status?.check_out) ? 0.6 : 1
              }}
            >
              <LogOut size={20} /> Check Out
            </button>
          </div>

          {message && (
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '0.75rem', 
              borderRadius: '0.5rem', 
              background: '#eff6ff', 
              color: 'var(--primary)',
              fontSize: '0.875rem'
            }}>
              {message}
            </div>
          )}
        </div>

        {(status?.check_in || status?.check_out) && (
          <div className="card" style={{ background: '#f8fafc' }}>
            <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Today's Activity</h4>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Check In Time:</span>
              <span style={{ fontWeight: '600' }}>{status.check_in || '--:--'}</span>
            </div>
            <div className="flex-between">
              <span style={{ color: 'var(--text-muted)' }}>Check Out Time:</span>
              <span style={{ fontWeight: '600' }}>{status.check_out || '--:--'}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployeePortal;
