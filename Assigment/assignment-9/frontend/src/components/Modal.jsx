import React, { useEffect } from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = '600px', 
  appointments, 
  viewData, 
  handleScanSubmit, 
  setOpenVisitorModal 
}) => {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const data = appointments || viewData;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-box" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: maxWidth }}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close-btn" onClick={onClose}>✖</button>
        </div>
        
        <div className="modal-body">
          {children}
          {data && (
            <div className="visitor-modal-content">
              <div className="glass-panel-withImage">
                <div className="visitor-info">
                  <p><b>Name:</b> {data.visitorId?.name}</p>
                  <p><b>Email:</b> {data.visitorId?.email}</p>
                  {data.visitorId?.phone && <p><b>Phone:</b> {data.visitorId?.phone}</p>}
                  <p><b>Company:</b> {data.visitorId?.company || 'N/A'}</p>
                  <p><b>Date:</b> {new Date(data.date).toLocaleString()}</p>
                  
                  {/* Long Purpose handling with custom class */}
                  <div className="purpose-box">
                    <b>Purpose:</b>
                    <p className="purpose-text">{data.purpose}</p>
                  </div>

                  {data.status && (
                    <p><b>Status:</b> <span className={`badge badge-${data.status.toLowerCase()}`}>{data.status}</span></p>
                  )}
                </div>

                <div className="visitor-photo-frame">
                  {data.photoUrl ? (
                    <img src={data.photoUrl} alt="Visitor" className="modal-visitor-img" />
                  ) : (
                    <div className="no-photo">No Photo</div>
                  )}
                </div>
              </div>

              {/* Security Dashboard specific Actions */}
              {appointments && handleScanSubmit && (
                <div className="modal-actions" style={{ marginTop: '20px' }}>
                  {appointments.checkStatus === 'Not Checked In' && (
                    <button className="btn btn-success btn-full" onClick={() => handleScanSubmit(appointments.passId)}>
                      Confirm Check-In
                    </button>
                  )}
                  {appointments.checkStatus === 'Checked In' && (
                    <button className="btn btn-warning btn-full" onClick={() => handleScanSubmit(appointments.passId)}>
                      Confirm Check-Out
                    </button>
                  )}
                  {appointments.checkStatus === 'Checked Out' && (
                    <button className="btn btn-secondary btn-full" onClick={() => setOpenVisitorModal(false)}>
                      Visit Already Completed
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
 
        </div>
      </div>
    </div>
  );
};

export default Modal;