import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Download, Search, FileText, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { getReports } from '../api';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [date]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await getReports(date);
      setReports(res.data);
    } catch (err) {
      console.error('Error fetching reports', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (reports.length === 0) return;
    
    const headers = ['Employee ID', 'Name', 'Date', 'Check In', 'Check Out', 'Status'];
    const rows = reports.map(r => [
      r.employee_id,
      r.name,
      r.date,
      r.check_in,
      r.check_out,
      r.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Attendance_Report_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container animate-fade-in">
        <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem', borderRadius: '0.75rem' }}>
              <FileText size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Attendance Reports</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>View and download daily logs</p>
            </div>
          </div>
          <button 
            onClick={downloadCSV} 
            className="btn" 
            style={{ background: '#f8fafc', border: '1px solid var(--border)', color: 'var(--primary)' }}
            disabled={reports.length === 0}
          >
            <Download size={18} /> Download CSV
          </button>
        </div>

        <div className="card" style={{ marginBottom: '2.5rem' }}>
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Filter size={18} color="var(--text-muted)" />
              <span style={{ fontWeight: '500' }}>Filter by Date:</span>
              <div style={{ position: 'relative' }}>
                <CalendarIcon size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
                <input 
                  type="date" 
                  className="input-field" 
                  style={{ paddingLeft: '40px', width: '200px' }}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Records Found</p>
                <p style={{ fontSize: '1.25rem', fontWeight: '700' }}>{reports.length}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Present</p>
                <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--success)' }}>
                  {reports.filter(r => r.status === 'Present').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((rec, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '500' }}>{rec.employee_id}</td>
                    <td>{rec.name}</td>
                    <td>{rec.date}</td>
                    <td>{rec.check_in}</td>
                    <td>{rec.check_out}</td>
                    <td>
                      <span style={{ 
                        color: rec.status === 'Present' ? 'var(--success)' : 'var(--danger)',
                        fontWeight: '600'
                      }}>
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && !loading && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                      No reports found for the selected date.
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '4rem' }}>
                      Loading data...
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

export default Reports;
