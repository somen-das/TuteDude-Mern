import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Employee', department: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchLogs();
    fetchUsers();
  }, [user]);

  const fetchLogs = async () => {
    try {
      const { data } = await axios.get(process.env.VITE_API_URL + '/appointments/logs', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setLogs(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(process.env.VITE_API_URL + '/auth/users', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setStaffList(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      await axios.post(process.env.VITE_API_URL + '/auth/register', formData);
      setMsg({ type: 'success', text: 'New staff added successfully!' });
      setShowAddForm(false);
      setFormData({ name: '', email: '', password: '', role: 'Employee', department: '' });
      fetchUsers();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to add staff' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>


      <div className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Staff Management</h3>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary" style={{ padding: '8px 16px' }}>
            {showAddForm ? 'Cancel' : '+ Add New Staff'}
          </button>
        </div>

        {msg.text && (
          <div style={{ background: msg.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: msg.type === 'success' ? '#34d399' : '#f87171', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
            {msg.text}
          </div>
        )}

        {showAddForm && (
          <form onSubmit={handleAddStaff} className="animate-fade-in" style={{ background: '#f8fafc', border: '1px solid var(--surface-border)', padding: '20px', borderRadius: '8px', marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label>Full Name</label>
              <input type="text" name="name" className="input-field" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div>
              <label>Email Address</label>
              <input type="email" name="email" className="input-field" value={formData.email} onChange={handleInputChange} required />
            </div>
            <div>
              <label>Password</label>
              <input type="password" name="password" className="input-field" value={formData.password} onChange={handleInputChange} required minLength="6" />
            </div>
            <div>
              <label>Role</label>
              <select name="role" className="input-field" value={formData.role} onChange={handleInputChange} required>
                <option value="Employee">Employee (Host)</option>
                <option value="Security">Security Guard</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label>Department (Optional - only needed for Employees)</label>
              <input type="text" name="department" className="input-field" value={formData.department} onChange={handleInputChange} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn btn-success" style={{ width: '100%' }}>Create Account</button>
            </div>
          </form>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map(staff => (
                <tr key={staff._id}>
                  <td>{staff.name}</td>
                  <td>{staff.email}</td>
                  <td><span className="badge badge-approved">{staff.role}</span></td>
                  <td>{staff.department || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


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
                  <td colSpan="5" style={{ textAlign: 'center', color: '#64748b' }}>No logs available yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
