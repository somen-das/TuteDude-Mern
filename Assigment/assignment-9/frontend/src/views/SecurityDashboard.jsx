import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Html5QrcodeScanner } from 'html5-qrcode';

const SecurityDashboard = ({ setLoading }) => {
  const [passId, setPassId] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [openVisitorModal, setOpenVisitorModal] = useState(false);
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    const onScanSuccess = (decodedText) => {
      handleScanSubmit(decodedText);
      scanner.pause(true); 
      setTimeout(() => scanner.resume(), 4000);
    };

    const onScanFailure = (error) => {
    };

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, []);

  const handleScanSubmit = async (scannedId = passId) => {
  try {
    setLoading(true);

    const { data } = await axios.post(
      import.meta.env.VITE_API_URL + '/appointments/scan',
      { passId: scannedId },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );

    console.log("Scan result from server:", data);

    setScanResult(data);
    setErrorMsg('');
    setPassId('');

    setOpenVisitorModal(false);

  } catch (err) {
    console.error("Error processing scan:", err);
    setErrorMsg(err.response?.data?.message || 'Failed to scan pass');
    setScanResult(null);
  } finally {
    setLoading(false); 
    // setOpenVisitorModal(false);
  }
};

  const handleManualSubmit = async (e, scannedId = passId) => {
  e.preventDefault();

  try {
    const { data } = await axios.get(
      import.meta.env.VITE_API_URL + '/appointments',
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    const filteredData = data.filter(res => res.passId === scannedId);
    if (filteredData.length === 0) {
      setErrorMsg('Invalid Pass ID');
      setScanResult(null);
      return;
    }

    setAppointments(filteredData[0]);
    setOpenVisitorModal(true);

  } catch (err) {
    console.error("Error processing scan:", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <div className="glass-panel">
        <div id="reader" style={{ width: '100%', marginBottom: '20px', borderRadius: '8px', overflow: 'hidden' }}></div>

        <form onSubmit={handleManualSubmit}>
          <label>Or Enter Pass ID Manually</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              className="input-field"
              value={passId}
              onChange={(e) => setPassId(e.target.value)}
              placeholder="e.g. 8fa19b..."
              style={{ marginBottom: 0 }}
            />
            <button type="submit" className={!passId ? "btn btn-primary disabled" : "btn btn-primary"} disabled={!passId}>Process</button>
          </div>
        </form>
      </div>
      {openVisitorModal && (
        <div className="modal-overlay" onClick={() => setOpenVisitorModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="modal-close btn btn-danger"
                onClick={() => setOpenVisitorModal(false)}>
                ✖
            </button>
            <h3>Visitor Details</h3>
            </div>
            <div className="glass-panel-withImage">
            <div>
            <p><b>Name:</b> {appointments.visitorId?.name}</p>
            <p><b>Email:</b> {appointments.visitorId?.email}</p>
            <p><b>Phone:</b> {appointments.visitorId?.phone}</p>
            <p><b>Company:</b> {appointments.visitorId?.company}</p>
            <p><b>Purpose:</b> {appointments.purpose}</p>
            <p><b>Date:</b> {new Date(appointments.date).toLocaleString()}</p>
            </div>
            <div >
              {appointments.photoUrl ? (
                <img src={appointments.photoUrl} alt="Visitor" />
              ) : (
                <p>No photo available</p>
              )}

            </div>
            </div>
            <div className="confirmbtn">
            {appointments.checkStatus === 'Not Checked In' && (
              <button className="btn btn-success" onClick={() => handleScanSubmit(appointments.passId)}>
                Check In
              </button>
            )}
            {appointments.checkStatus === 'Checked In' && (
              <button className="btn btn-warning" onClick={() => handleScanSubmit(appointments.passId)}>
                Check Out
              </button> 
              )}
              {appointments.checkStatus === 'Checked Out' && (
                <button className="btn btn-warning" onClick={()=>setOpenVisitorModal(false)}>
                  Visit Completed
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Scan Result</h3>
        {errorMsg && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '16px', borderRadius: '8px' }}>
            {errorMsg}
          </div>
        )}

        {scanResult && (
          <div className="animate-fade-in" style={{ padding: '20px', background: '#d1fae5', border: '1px solid var(--success)', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--success)', marginBottom: '8px', fontSize: '1.2rem' }}>{scanResult.message}</h4>
            <div style={{ marginBottom: '16px' }}>
              <p><strong>Visitor:</strong> {scanResult.appointment?.visitorId?.name}</p>
              <p><strong>Host:</strong> {scanResult.appointment?.hostId?.name}</p>
              <p><strong>Status:</strong> {scanResult?.status}</p>
            </div>
          </div>
        )}

        {!scanResult && !errorMsg && (
          <div style={{ color: '#64748b', textAlign: 'center', padding: '40px 0' }}>
            Awaiting scan...
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityDashboard;
