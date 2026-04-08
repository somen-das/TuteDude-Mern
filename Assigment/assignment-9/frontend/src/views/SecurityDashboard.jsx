import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const SecurityDashboard = () => {
  const [passId, setPassId] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const { user } = useContext(AuthContext);


  const handleScanSubmit = async (scannedId = passId) => {
    try {
      const { data } = await axios.post(process.env.VITE_APP_TITLE + '/appointments/scan', 
        { passId: scannedId },
        { headers: { Authorization: `Bearer ${user.token}` }}
      );
      setScanResult(data);
      setErrorMsg('');
      setPassId('');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to scan pass');
      setScanResult(null);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (passId) handleScanSubmit(passId);
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
            <button type="submit" className="btn btn-primary">Process</button>
          </div>
        </form>
      </div>

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
              <p><strong>Status:</strong> {scanResult.log?.status}</p>
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
