import React, { useContext, useState } from 'react'
import PreRegister from '../pages/PreRegister'
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useEffect } from 'react';

const VisitorDashboard = ({setLoading}) => {
  const { user } = useContext(AuthContext);
    const [showAddForm, setShowAddForm] = useState(false);
    const [appointments, setAppointments] = useState([]);
  const fetchAppointments = async () => {
    try{
      const {data} = await axios.post(import.meta.env.VITE_API_URL + '/visitors/visitor-appointments', { email: user.email });
       setAppointments(data?.appointments);
    } catch(error){
      console.error("Error in fetching appointments:", error);
    }
  }
      const handleSuccess = () => {
  setShowAddForm(false);   // modal close
  fetchAppointments();     // data refresh
};

  useEffect(()=>{
    fetchAppointments();
  }, [user])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Appointments Add</h3>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary" style={{ padding: '8px 16px' }}>
            {showAddForm ? 'Cancel' : '+ Add New Appointment'}
          </button>
        </div>
      {/* {showAddForm && <PreRegister page="visitor-dashboard" />} */}
      
    {showAddForm && (
  <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
    
    <div className="modal-box" onClick={(e) => e.stopPropagation()} >
      
      <button className="modal-close" onClick={() => setShowAddForm(false)} >
        ✖
      </button>

      <PreRegister page="visitor-dashboard" onSuccess={handleSuccess} setLoading={setLoading} />
    </div>

  </div>
)}
      
      <div className="glass-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>System Logs & Activity</h3>
                
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Visitor</th>
                      <th>Host</th>
                      <th>Status</th>
                      {/* <th>Check In</th>
                      <th>Check Out</th> */}
                      <th>Date</th>
                      <th>Pass Id</th>
                      <th>Pass Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(log => (
                      <tr key={log._id}>
                        <td>{user?.name}</td>
                        <td>{log?.hostId?.name}</td>
                        <td>
                          <span className={`badge ${log.status === 'Approved' ? 'badge-approved' : (log.status === 'Pending' ? 'badge-pending' : 'badge-rejected')}`}>
                            {log.status}
                          </span>
                        </td>
                        {/* <td>{log.checkInTime ? new Date(log.checkInTime).toLocaleString() : '-'}</td> */}
                        {/* <td>{log.checkOutTime ? new Date(log.checkOutTime).toLocaleString() : '-'}</td> */}
                        <td>{log.date ? new Date(log.date).toLocaleString() : '-'}</td>
                        <td>{log.passId || '-'}</td>
                        <td>
                          {log.passId ? (
                            <a href={`${import.meta.env.VITE_API_URL}/appointments/download-pass/${log.pdfPassId}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary downloadA">
                              Download
                            </a>
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    ))}
                    {appointments.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', color: '#64748b' }}>No appointments available yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
    </div>
  )
}

export default VisitorDashboard
