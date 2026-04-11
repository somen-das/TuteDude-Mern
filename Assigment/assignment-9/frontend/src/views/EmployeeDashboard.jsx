
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';

const EmployeeDashboard = ({ setLoading }) => {
  const [appointments, setAppointments] = useState([]);
  const { user } = useContext(AuthContext);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [toast, setToast] = useState(null);
  const API = import.meta.env.VITE_API_URL;

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(`${API}/appointments`, {
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


  const openConfirm = (action, appt) => {
    setConfirmData({ action, appt });
  };

  const handleDelete = (appt) => {
    const meetingTime = new Date(appt.date);
    const now = new Date();

    if (appt.status === "Approved" && meetingTime > now) {
      setConfirmData({
        action: "Blocked",
        message: "Already approved. You can delete after meeting."
      });
      return;
    }

    openConfirm("Delete", appt);
  };

  const confirmAction = async () => {
    const { action, appt } = confirmData;
    try {
      
      if (action === "Delete") {
        setLoading(true);
        await axios.delete(`${API}/appointments/${appt._id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setToast({ message: "Appointment deleted successfully", type: "error" });
      } else {
        setLoading(true);
        await axios.put(`${API}/appointments/${appt._id}`, {
          status: action,
        }, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setToast({ message: "Appointment updated successfully", type: "success" });
      }
      fetchAppointments();
      setConfirmData(null);
      setOpenMenuId(null);
    } catch (err) {
      setLoading(false);
      console.error(err);
    } finally{
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" onClick={() => setOpenMenuId(null)}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>
        Visitor Requests
      </h3>

      <div >
        <table className="data-table">
          <thead>
            <tr>
              <th>Visitor Name</th>
              <th>Company</th>
              <th>Date</th>
              <th>Purpose</th>
              <th>Status</th>
              <th>Pass</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map(appt => (
              <tr key={appt._id}>
                <td>{appt.visitorId?.name}</td>
                <td>{appt.visitorId?.company || 'N/A'}</td>
                <td>{new Date(appt.date).toLocaleString()}</td>
                <td className="purpose-cell">
                  <div className="purpose-wrapper">
                    <span className="short-text">
                      {appt.purpose.length > 20
                        ? appt.purpose.slice(0, 20) + "..."
                        : appt.purpose}
                    </span>

                    <div className="tooltip-box">
                      {appt.purpose}
                    </div>
                  </div>
                </td>

                <td>
                  <span className={`badge badge-${appt.status.toLowerCase()}`}>
                    {appt.status}
                  </span>
                </td>

                <td>
                  {appt.status === 'Approved' ? (
                    <div>
                      <div style={{ fontSize: '0.7rem' }}>
                        Pass: {appt.passId}
                      </div>
                    </div>
                  ) : (
                    "-"
                  )}
                </td>

               
                <td style={{ position: "relative" }}>
                  <div onClick={(e)=>e.stopPropagation()}> 
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === appt._id ? null : appt._id) } 
                    className="three-dot-btn" >
                    ⋮
                  </button>

                  {openMenuId === appt._id && (
                    <div className="dropdown-menu">
                      {appt.status === "Pending" && (
                        <>
                          <button className='btn btn-success' onClick={() => openConfirm("Approved", appt)}>Approve</button>
                          <button className='btn btn-warning' onClick={() => openConfirm("Rejected", appt)}>Reject</button>
                          <button className='btn btn-danger' onClick={() => handleDelete(appt)}>Delete</button>
                        </>
                      )}

                      {appt.status === "Approved" && (
                        <button className='btn btn-danger' onClick={() => handleDelete(appt)}>Delete</button>
                      )}

                      <button className='btn btn-info' onClick={() => setViewData(appt)}>View</button>
                    </div>
                  )}
                  </div>
                </td>
              </tr>
            ))}

            {appointments.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>
                  No visitor requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* for confirm modal */}
      {confirmData && (
        <ConfirmModal confirmData={confirmData} setConfirmData={setConfirmData} confirmAction={confirmAction} />
      )}

      {/* for view modal */}
      {viewData && (
        <div className="modal-overlay"  onClick={() => setConfirmData(null)} >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close btn btn-danger"
                onClick={() => setViewData(null)}>
                ✖
            </button>
            <h3>Visitor Details</h3>
            <div className="glass-panel-withImage">
            <div>
            <p><b>Name:</b> {viewData.visitorId?.name}</p>
            <p><b>Email:</b> {viewData.visitorId?.email}</p>
            <p><b>Phone:</b> {viewData.visitorId?.phone}</p>
            <p><b>Company:</b> {viewData.visitorId?.company}</p>
            <p><b>Purpose:</b> {viewData.purpose}</p>
            <p><b>Date:</b> {new Date(viewData.date).toLocaleString()}</p>
            </div>
            <div >
              {viewData.photoUrl ? (
                <img src={viewData.photoUrl} alt="Visitor" />
              ) : (
                <p>No photo available</p>
              )}

            </div>
            </div>

          </div>
        </div>
      )}


      {toast && (
  <Toast
    message={toast.message}
    type={toast.type}
    onClose={() => setToast(null)}
  />
)}
    </div>
  );
};

export default EmployeeDashboard;