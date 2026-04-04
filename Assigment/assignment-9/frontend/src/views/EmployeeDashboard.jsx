import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';

const EmployeeDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/appointments', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setAppointments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-panel">
      <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Visitor Requests</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Visitor Name</th>
              <th>Company</th>
              <th>Date</th>
              <th>Purpose</th>
              <th>Status</th>
              <th>Actions / Pass</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appt => (
              <tr key={appt._id}>
                <td>{appt.visitorId?.name}</td>
                <td>{appt.visitorId?.company || 'N/A'}</td>
                <td>{new Date(appt.date).toLocaleString()}</td>
                <td>{appt.purpose}</td>
                <td>
                  <span className={`badge badge-${appt.status.toLowerCase()}`}>
                    {appt.status}
                  </span>
                </td>
                <td>
                  {appt.status === 'Pending' ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleStatusChange(appt._id, 'Approved')} className="btn btn-success" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Approve</button>
                      <button onClick={() => handleStatusChange(appt._id, 'Rejected')} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Reject</button>
                    </div>
                  ) : appt.status === 'Approved' ? (
                     <div>
                       <QRCodeSVG value={appt.passId} size={50} />
                       <div style={{ fontSize: '0.7rem' }}>Pass: {appt.passId}</div>
                     </div>
                  ) : (
                    <span style={{ color: '#94a3b8' }}>-</span>
                  )}
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8' }}>No visitor requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
