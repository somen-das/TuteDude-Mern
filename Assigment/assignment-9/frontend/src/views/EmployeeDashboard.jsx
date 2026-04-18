import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import Modal from '../components/Modal';

const EmployeeDashboard = ({ setLoading }) => {
  const [appointments, setAppointments] = useState([]);
  const { user, API } = useContext(AuthContext);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [toast, setToast] = useState(null);
  
 
  const [activeTab, setActiveTab] = useState('pending');
  
  const fetchAppointments = async () => {
    try {
      const { data } = await API.get(`/appointments`);
      const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAppointments(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const pendingRequests = appointments.filter(app => app.status === 'Pending');
  const approvedRequests = appointments.filter(app => app.status === 'Approved' && app.checkStatus !== 'Checked Out');
  const historyRequests = appointments.filter(app => app.status === 'Rejected' || app.checkStatus === 'Checked Out');

  const confirmAction = async () => {
    const { action, appt } = confirmData;
    try {
      setLoading(true);
      if (action === "Delete") {
        await API.delete(`/appointments/${appt._id}`);
        setToast({ message: "Appointment deleted successfully", type: "error" });
      } else {
        await API.put(`/appointments/${appt._id}`, {
          status: action,
        });
        setToast({ message: `Appointment ${action} successfully`, type: "success" });
      }
      fetchAppointments();
      setConfirmData(null);
      setOpenMenuId(null);
    } catch (err) {
      console.error(err);
      setToast({ message: "Action failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const renderTable = (data) => (
    <div style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>Visitor Name</th>
            <th>Company</th>
            <th>Date</th>
            <th>Status</th>
            <th>Pass</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? data.map(appt => (
            <tr key={appt._id}>
              <td>{appt.visitorId?.name}</td>
              <td>{appt.visitorId?.company || 'N/A'}</td>
              <td>{new Date(appt.date).toLocaleString()}</td>
              <td>
                <span className={`badge badge-${appt.status.toLowerCase()}`}>{appt.status}</span>
              </td>
              <td>{appt.status === 'Approved' ? `ID: ${appt.passId}` : "-"}</td>
              <td style={{ position: "relative" }}>
                <div onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setOpenMenuId(openMenuId === appt._id ? null : appt._id)} className="three-dot-btn">⋮</button>
                  {openMenuId === appt._id && (
                    <div className="dropdown-menu">
                      {appt.status === "Pending" && (
                        <>
                          <button className='btn btn-success' onClick={() => setConfirmData({action: "Approved", appt})}>Approve</button>
                          <button className='btn btn-warning' onClick={() => setConfirmData({action: "Rejected", appt})}>Reject</button>
                        </>
                      )}
                      <button className='btn btn-danger' onClick={() => setConfirmData({action: "Delete", appt})}>Delete</button>
                      <button className='btn btn-info' onClick={() => setViewData(appt)}>View</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>No records found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="glass-panel" onClick={() => setOpenMenuId(null)}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Employee Dashboard</h3>

      
      <div className="tab-container">
        <button 
          className={`tab-btn ${activeTab === 'pending' ? 'active orange' : ''}`} 
          onClick={() => setActiveTab('pending')}
        >
          New Requests ({pendingRequests.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'approved' ? 'active green' : ''}`} 
          onClick={() => setActiveTab('approved')}
        >
          Approved ({approvedRequests.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active gray' : ''}`} 
          onClick={() => setActiveTab('history')}
        >
          History ({historyRequests.length})
        </button>
      </div>

      <div className="animate-fade-in">
        {activeTab === 'pending' && renderTable(pendingRequests)}
        {activeTab === 'approved' && renderTable(approvedRequests)}
        {activeTab === 'history' && renderTable(historyRequests)}
      </div>

      <ConfirmModal confirmData={confirmData} setConfirmData={setConfirmData} confirmAction={confirmAction} />

      <Modal isOpen={!!viewData} onClose={() => setViewData(null)} title="Visitor Information" viewData={viewData}></Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default EmployeeDashboard;