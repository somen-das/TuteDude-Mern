import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PreRegister = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', hostId: '', date: '', purpose: ''
  });
  const [hosts, setHosts] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const { data } = await axios.get(import.meta.env.VITE_API_URL + '/visitors/hosts');
        setHosts(data);
      } catch (err) {
        console.error('Failed to load hosts');
      }
    };
    fetchHosts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/visitors/register', formData);
      setSuccessMsg('Registration request submitted successfully! Once approved, you will receive your pass.');
      setErrorMsg('');
      setFormData({ name: '', email: '', phone: '', company: '', hostId: '', date: '', purpose: '' });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit registration');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '600px' }}>
        <h2 className="heading" style={{ textAlign: 'center' }}>Visitor Pre-Registration</h2>
        <p style={{ textAlign: 'center', color: '#475569', marginBottom: '24px' }}>Please fill out the form to request a visitor pass.</p>

        {successMsg && <div style={{ background: '#d1fae5', color: '#059669', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>{successMsg}</div>}
        {errorMsg && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>{errorMsg}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label>Full Name</label>
            <input type="text" name="name" className="input-field" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <label>Email Address</label>
            <input type="email" name="email" className="input-field" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Phone Number</label>
            <input type="text" name="phone" className="input-field" value={formData.phone} onChange={handleChange} required />
          </div>
          <div>
            <label>Company (Optional)</label>
            <input type="text" name="company" className="input-field" value={formData.company} onChange={handleChange} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label>Host (Employee viewing)</label>
            <select name="hostId" className="input-field" value={formData.hostId} onChange={handleChange} required>
              <option value="">Select Host</option>
              {hosts.map(host => (
                <option key={host._id} value={host._id}>{host.name} - {host.department}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Date of Visit</label>
            <input type="datetime-local" name="date" className="input-field" value={formData.date} onChange={handleChange} required />
          </div>
          <div>
            <label>Purpose of Visit</label>
            <input type="text" name="purpose" className="input-field" value={formData.purpose} onChange={handleChange} required />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
            <button type="submit" className="btn btn-success" style={{ width: '100%' }}>Submit Request</button>
          </div>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: '#475569' }}>Are you a staff member? </span>
          <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Staff Login</Link>
        </div>
      </div>
    </div>
  );
};

export default PreRegister;
