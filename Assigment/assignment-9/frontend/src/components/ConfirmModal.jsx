import React from 'react'

const ConfirmModal = ({ confirmData, setConfirmData, confirmAction }) => {
  return (
    <div className="modal-overlay" onClick={() => setConfirmData(null)}>
          <div className="modal-box" onClick={(e)=>e.stopPropagation()}>
            {confirmData.action === "Blocked" ? (
              <>
                <p>{confirmData.message}</p>
                <button className='button-confirm model-close btn btn-primary' onClick={() => setConfirmData(null)}>OK</button>
              </>
            ) : (
              <>
                <h3>Confirm</h3>
                <p>Are you sure you want to {confirmData.action}?</p>
                <div class="button-confirm">
                  <button onClick={confirmAction} className='btn btn-primary'>Yes</button>
                  <button onClick={() => setConfirmData(null)} className='btn btn-danger'>Cancel</button>
                </div>
                
              </>
            )}
          </div>
        </div>
  )
}

export default ConfirmModal
