import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Users, UserPlus, Trash2, CheckCircle, XCircle, UsersRound } from 'lucide-react';
import { getEmployees, getStats, createEmployee, deleteEmployee } from '../api';

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0 });
  const [newEmployee, setNewEmployee] = useState({ employee_id: '', name: '', password: '', is_admin: false });
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empRes, statRes] = await Promise.all([getEmployees(), getStats()]);
      setEmployees(empRes.data);
      setStats(statRes.data);
    } catch (err) {
      console.error('Error fetching data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      await createEmployee(newEmployee);
      setMessage({ type: 'success', text: 'Employee created successfully!' });
      setNewEmployee({ employee_id: '', name: '', password: '', is_admin: false });
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error creating employee' });
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id);
        setMessage({ type: 'success', text: 'Employee deleted successfully!' });
        fetchData();
      } catch (err) {
        setMessage({ type: 'error', text: 'Error deleting employee' });
      }
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container animate-fade-in">
        <div className="flex-between" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Admin Dashboard</h2>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary">
            <UserPlus size={18} /> {showAddForm ? 'Cancel' : 'Add Employee'}
          </button>
        </div>

        {message.text && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: '0.5rem', 
            marginBottom: '1.5rem', 
            background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: message.type === 'success' ? '#166534' : '#991b1b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
            {message.text}
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-3" style={{ marginBottom: '2.5rem' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '1rem', color: '#1e40af' }}>
              <UsersRound size={32} />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Employees</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '700' }}>{stats.total}</h3>
            </div>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: '#dcfce7', padding: '1rem', borderRadius: '1rem', color: '#166534' }}>
              <CheckCircle size={32} />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Present Today</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#166534' }}>{stats.present}</h3>
            </div>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: '#fee2e2', padding: '1rem', borderRadius: '1rem', color: '#991b1b' }}>
              <XCircle size={32} />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Absent Today</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#991b1b' }}>{stats.absent}</h3>
            </div>
          </div>
        </div>

        {/* Add Employee Form */}
        {showAddForm && (
          <div className="card" style={{ marginBottom: '2.5rem', background: '#f8fafc' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>Enter Employee Details</h3>
            <form onSubmit={handleCreateEmployee} className="grid grid-3" style={{ alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>Employee ID</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={newEmployee.employee_id}
                  onChange={(e) => setNewEmployee({...newEmployee, employee_id: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>Full Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>Password</label>
                <input 
                  type="password" 
                  className="input-field" 
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                  required 
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  checked={newEmployee.is_admin}
                  onChange={(e) => setNewEmployee({...newEmployee, is_admin: e.target.checked})}
                />
                <label style={{ fontSize: '0.8125rem' }}>Make Admin</label>
              </div>
              <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2' }}>
                Save Employee
              </button>
            </form>
          </div>
        )}

        {/* Employee Table */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>Employee Management</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Today's Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.employee_id}>
                    <td style={{ fontWeight: '500' }}>{emp.employee_id}</td>
                    <td>{emp.name}</td>
                    <td>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '0.25rem', 
                        fontSize: '0.75rem', 
                        background: emp.is_admin ? '#ede9fe' : '#f1f5f9',
                        color: emp.is_admin ? '#5b21b6' : '#475569'
                      }}>
                        {emp.is_admin ? 'Admin' : 'Employee'}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.25rem',
                        color: emp.status === 'Present' ? '#10b981' : '#ef4444',
                        fontWeight: '600'
                      }}>
                        {emp.status === 'Present' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {emp.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleDeleteEmployee(emp.id)} 
                        className="btn btn-danger" 
                        style={{ padding: '0.4rem', borderRadius: '0.4rem' }}
                        title="Delete Employee"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {employees.length === 0 && !loading && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No employees found. Start by adding one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
