
import React from 'react';
import Modal from './Modal';

const ConfirmModal = ({ confirmData, setConfirmData, confirmAction }) => {
  if (!confirmData) return null;

  return (
    <Modal 
      isOpen={!!confirmData} 
      onClose={() => setConfirmData(null)} 
      title={confirmData.action === "Blocked" ? "Warning" : "Confirm Action"}
      maxWidth="400px"
    >
      <div style={{ textAlign: 'center' }}>
        {confirmData.action === "Blocked" ? (
          <>
            <p>{confirmData.message}</p>
            <button className='btn btn-primary' onClick={() => setConfirmData(null)}>OK</button>
          </>
        ) : (
          <>
            <p>Are you sure you want to <b>{confirmData.action}</b>?</p>
            <div className="button-confirm" style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
              <button onClick={confirmAction} className='btn btn-primary'>Yes, Proceed</button>
              <button onClick={() => setConfirmData(null)} className='btn btn-danger'>Cancel</button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ConfirmModal;