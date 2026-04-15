import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Modal from '../components/Modal';
import PreRegister from '../pages/PreRegister';

const VisitorDashboard = ({ setLoading }) => {
  const { user, API } = useContext(AuthContext); 
  const [showAddForm, setShowAddForm] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('approved');

  const fetchAppointments = async () => {
    try {
      const { data } = await API.post('/visitors/visitor-appointments', { email: user.email });
      setAppointments(data.appointments);
    } catch (error) {
      console.error("Error in fetching appointments:", error);
    }
  };

  const handleSuccess = () => {
    setShowAddForm(false);
    fetchAppointments();
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  
  const approvedApps = appointments.filter(app => app.status === 'Approved' && app.checkStatus !== 'Checked Out');
  const pendingApps = appointments.filter(app => app.status === 'Pending');
  const completedApps = appointments.filter(app => app.checkStatus === 'Checked Out' || app.status === 'Rejected');


  const renderTable = (data, emptyMsg) => (
    <div style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr><th>Host</th><th>Status</th><th>Date</th><th>Pass ID</th><th>Action</th></tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map(log => (
              <tr key={log._id}>
                <td>{log?.hostId?.name}</td>
                <td><span className={`badge badge-${log.status.toLowerCase()}`}>{log.status}</span></td>
                <td>{log.date ? new Date(log.date).toLocaleString() : '-'}</td>
                <td>{log.passId || '-'}</td>
                <td>
                  {log.passId ? (
                    <a href={`${import.meta.env.VITE_API_URL}/appointments/download-pass/${log.pdfPassId}`} target="_blank" rel="noopener noreferrer" className={activeTab === "history" ? "btn btn-sm btn-outline-primary disable" : "btn btn-sm btn-outline-primary"}>
                      Download
                    </a>
                  ) : '-'}
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>{emptyMsg}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Visitor Portal</h3>
        <button onClick={() => setShowAddForm(true)} className="btn btn-primary">+ New Appointment</button>
      </div>

      <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)} title="Schedule New Visit">
        <PreRegister page="visitor-dashboard" onSuccess={handleSuccess} setLoading={setLoading} />
      </Modal>

      
      <div className="tab-container">
        <button 
          className={`tab-btn ${activeTab === 'approved' ? 'active green' : ''}`} 
          onClick={() => setActiveTab('approved')}
        >
          Approved ({approvedApps.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'pending' ? 'active orange' : ''}`} 
          onClick={() => setActiveTab('pending')}
        >
          Pending ({pendingApps.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active gray' : ''}`} 
          onClick={() => setActiveTab('history')}
        >
          History ({completedApps.length})
        </button>
      </div>

  
      <div className="glass-panel animate-fade-in">
        {activeTab === 'approved' && (
          <>
            <h4 style={{ color: '#10b981', marginBottom: '15px' }}>Active & Approved Passes</h4>
            {renderTable(approvedApps, "No active approved appointments found.")}
          </>
        )}

        {activeTab === 'pending' && (
          <>
            <h4 style={{ color: '#f59e0b', marginBottom: '15px' }}>Pending Requests</h4>
            {renderTable(pendingApps, "No pending requests at the moment.")}
          </>
        )}

        {activeTab === 'history' && (
          <>
            <h4 style={{ color: '#64748b', marginBottom: '15px' }}>Visit History</h4>
            {renderTable(completedApps, "Your visit history is empty.")}
          </>
        )}
      </div>
    </div>
  );
};

export default VisitorDashboard;