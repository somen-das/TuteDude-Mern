import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CSVLink } from 'react-csv';
import ConfirmModal from '../components/ConfirmModal';
import Loading from '../components/Loading';
const AdminDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Employee', department: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const { user, API } = useContext(AuthContext);
  const [confirmData, setConfirmData] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [editRole, setEditRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeLogTab, setActiveLogTab] = useState('active');
  useEffect(() => {
    fetchLogs();
    fetchUsers();
  }, [user]);

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const { data } = await API.get('/appointments/logs');

      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false)
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true)

      const { data } = await API.get('/auth/users');
      setStaffList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false)
    }
  };
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {

      if (!validateEmail(formData.email)) {
        setMsg({ type: 'error', text: 'Invalid email format' });
        return;
      }
      if (formData.name.length < 3) {

        setMsg({ type: 'error', text: 'Name must be at least 3 characters' });
        return;
      }
      if (formData.password.length < 6) {
        setMsg({ type: 'error', text: 'Password must be at least 6 characters' });
        return;
      }

      setLoading(true)

      await API.post('/auth/register', formData);
      setMsg({ type: 'success', text: 'New staff added successfully!' });
      setShowAddForm(false);
      setFormData({ name: '', email: '', password: '', role: 'Employee', department: '' });
      fetchUsers();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to add staff' });
    } finally {
      setLoading(false)
    }
  };

  const openConfirm = (action, user) => {
    setConfirmData({ action, user });
  };

  const confirmAction = async () => {
    const { action, user: targetUser } = confirmData;
    try {
      if (action === "Delete") {
        const data = await API.delete(`/auth/users/${targetUser._id}`);
        fetchUsers();
        setConfirmData(null);
        setOpenMenuId(null);
        setMsg({ type: 'success', text: data?.data?.message });
      }

    } catch (err) {
      console.error(err);
      setMsg({ type: 'error', text: 'Failed to delete user' });
    }
  };

  const handleRoleUpdate = async (id) => {
    try {
      await API.put(`/auth/users/${id}`, {
        role: editRole
      });

      setEditUserId(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const activeVisits = logs.filter(log => log.status === 'Approved' && log.checkStatus === 'Checked In');
  const NoVisit = logs.filter(log => log.status === 'Approved' && log.checkStatus === 'Not Checked In');
  const pendingRequests = logs.filter(log => log.status === 'Pending');
  const completedHistory = logs.filter(log => log.checkStatus === 'Checked Out' || log.status === 'Rejected');

  const renderLogTable = (data) => (
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
          {data.length > 0 ? data.map(log => (
            <tr key={log._id}>
              <td>{log?.visitorId?.name}</td>
              <td>{log?.hostId?.name}</td>
              <td>
                <span className={`badge ${(log.status === 'Approved')
                    ? "badge-approved"
                    : (log.status === 'Pending')
                      ? "badge-pending"
                      : ""
                  }`}>
                  {log.checkStatus !== 'Not Checked In' ? log.checkStatus : log.status}
                </span>
              </td>
              <td>{log.checkInTime ? new Date(log.checkInTime).toLocaleString() : '-'}</td>
              <td>{log.checkOutTime ? new Date(log.checkOutTime).toLocaleString() : '-'}</td>
            </tr>
          )) : (
            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>No records found in this category.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );


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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map(staff => (
                <tr key={staff._id}>
                  <td>{staff.name}</td>
                  <td>{staff.email}</td>
                  {/* <td><span className="badge badge-approved">{staff.role}</span></td> */}
                  <td>
                    {editUserId === staff._id ? (
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="input-field"
                      >
                        <option value="Employee">Employee</option>
                        <option value="Security">Security</option>
                      </select>
                    ) : (
                      <span className="badge badge-approved">{staff.role}</span>
                    )}
                  </td>
                  <td>{staff.department || '-'}</td>
                  <td style={{ position: "relative" }}>
                    <div onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === staff._id ? null : staff._id)
                        }
                        className="three-dot-btn"
                      >
                        ⋮
                      </button>

                      {openMenuId === staff._id && (
                        <div className="dropdown-menu">

                          <button
                            className="btn btn-warning"
                            onClick={() => {
                              setEditUserId(staff._id);
                              setEditRole(staff.role);
                            }}
                          >
                            Edit
                          </button>

                          {editUserId === staff._id && (
                            <button
                              className="btn btn-success"
                              onClick={() => handleRoleUpdate(staff._id)}
                            >
                              Save
                            </button>
                          )}

                          <button
                            className="btn btn-danger"
                            onClick={() => openConfirm("Delete", staff)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {confirmData && (
        <ConfirmModal confirmData={confirmData} setConfirmData={setConfirmData} confirmAction={confirmAction} />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="glass-panel animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>System Logs & Activity</h3>
            <CSVLink
              data={logs.map(log => ({
                Visitor: log?.visitorId?.name,
                Host: log?.hostId?.name,
                Status: log.status,
                CheckStatus: log.checkStatus,
                CheckIn: log.checkInTime ? new Date(log.checkInTime).toLocaleString() : '',
                CheckOut: log.checkOutTime ? new Date(log.checkOutTime).toLocaleString() : ''
              }))}
              filename={"all-visitor-logs.csv"}
              className="btn btn-success"
              style={{ textDecoration: 'none', padding: '6px 12px', fontSize: '0.8rem' }}
            >
              Export All to CSV
            </CSVLink>
          </div>

          <div className="tab-container" style={{ marginBottom: '20px' }}>
            <button
              className={`tab-btn ${activeLogTab === 'active' ? 'active green' : ''}`}
              onClick={() => setActiveLogTab('active')}
            >
              Active Visits ({activeVisits.length})
            </button>
            <button
              className={`tab-btn ${activeLogTab === 'NoVisit' ? 'active orange' : ''}`}
              onClick={() => setActiveLogTab('NoVisit')}
            >
              Approved (but not visit) ({NoVisit.length})
            </button>
            <button
              className={`tab-btn ${activeLogTab === 'pending' ? 'active orange' : ''}`}
              onClick={() => setActiveLogTab('pending')}
            >
              Not Approved ({pendingRequests.length})
            </button>
            <button
              className={`tab-btn ${activeLogTab === 'history' ? 'active gray' : ''}`}
              onClick={() => setActiveLogTab('history')}
            >
              History (already visits) ({completedHistory.length})
            </button>
          </div>

          {activeLogTab === 'active' && renderLogTable(activeVisits)}
          {activeLogTab === 'NoVisit' && renderLogTable(NoVisit)}
          {activeLogTab === 'pending' && renderLogTable(pendingRequests)}
          {activeLogTab === 'history' && renderLogTable(completedHistory)}
        </div>

        {confirmData && (
          <ConfirmModal confirmData={confirmData} setConfirmData={setConfirmData} confirmAction={confirmAction} />
        )}
      </div>

      {loading && <Loading />}
    </div>
  );
};

export default AdminDashboard;
