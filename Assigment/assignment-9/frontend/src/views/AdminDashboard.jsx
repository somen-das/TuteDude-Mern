import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const [logs, setLogs] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/appointments/logs', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setLogs(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLogs();
  }, [user]);

  return (
    <div className="glass-panel">
      <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>System Logs & Activity</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Visitor</th>
              <th>Host</th>
              <th>Status</th>
              <th>Check In</th>
              <th>Check Out</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id}>
                <td>{log.appointmentId?.visitorId?.name}</td>
                <td>{log.appointmentId?.hostId?.name}</td>
                <td>
                  <span className={`badge ${log.status === 'Checked In' ? 'badge-pending' : (log.status === 'Checked Out' ? 'badge-approved' : 'badge-rejected')}`}>
                    {log.status}
                  </span>
                </td>
                <td>{log.checkInTime ? new Date(log.checkInTime).toLocaleString() : '-'}</td>
                <td>{log.checkOutTime ? new Date(log.checkOutTime).toLocaleString() : '-'}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8' }}>No logs available yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
