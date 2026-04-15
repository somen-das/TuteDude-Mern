import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Modal from '../components/Modal'; 

const SecurityDashboard = ({ setLoading }) => {
  const [passId, setPassId] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const { API } = useContext(AuthContext);
  const [appointments, setAppointments] = useState(null);
  const [openVisitorModal, setOpenVisitorModal] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    const onScanSuccess = (decodedText) => {
      handleManualCheck(decodedText);
      scanner.pause(true);
      setTimeout(() => scanner.resume(), 5000);
    };

    scanner.render(onScanSuccess, (err) => {
      console.error(err)
    });

    return () => {
      scanner.clear().catch(err => console.error(err));
    };
  }, []);

  const handleScanSubmit = async (scannedId) => {
    try {
      setLoading(true);
      const { data } = await API.post('/appointments/scan',
        { passId: scannedId }
      );
      setScanResult(data);
      setErrorMsg('');
      setOpenVisitorModal(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to scan pass');
      setScanResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheck = async (scannedId) => {
    try {
      setLoading(true);
      const { data } = await API.get('/appointments');
      
      const found = data.find(res => res.passId === scannedId);
      if (!found) {
        setErrorMsg('Invalid Pass ID');
        setScanResult(null);
        return;
      }

      setAppointments(found);
      setOpenVisitorModal(true);
      setErrorMsg('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="security-grid">
      <div className="glass-panel">
        <h3 className="panel-title">QR Scanner</h3>
        <div id="reader"></div>
        
        <form onSubmit={(e) => { e.preventDefault(); handleManualCheck(passId); }} style={{ marginTop: '20px' }}>
          <label>Manual Pass ID Entry</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              className="input-field"
              value={passId}
              onChange={(e) => setPassId(e.target.value)}
              placeholder="Enter Pass ID..."
            />
            <button type="submit" className="btn btn-primary" disabled={!passId}>Check</button>
          </div>
        </form>
      </div>

      <div className="glass-panel">
        <h3 className="panel-title">Last Scan Status</h3>
        {errorMsg && <div className="alert alert-error">{errorMsg}</div>}
        
        {scanResult ? (
          <div className="scan-success-card animate-fade-in">
            <h4>{scanResult.message}</h4>
            <div className="scan-details">
              <p><strong>Visitor:</strong> {scanResult.appointment?.visitorId?.name}</p>
              <p><strong>Status:</strong> <span className="badge badge-approved">{scanResult.status}</span></p>
              <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        ) : (
          <div className="empty-state">Awaiting next scan...</div>
        )}
      </div>

      {/* my Visitor Details Modal */}
      <Modal 
        isOpen={openVisitorModal} 
        onClose={() => setOpenVisitorModal(false)} 
        title="Visitor Verification"
        appointments={appointments}
        handleScanSubmit={handleScanSubmit}
        setOpenVisitorModal={setOpenVisitorModal}
      >
      </Modal>
    </div>
  );
};

export default SecurityDashboard;