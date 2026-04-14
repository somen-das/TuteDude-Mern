import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loading from '../components/Loading';
import { editUser } from '../../../backend/controllers/authController';

const PreRegister = ({ page, onSuccess, setLoading  }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '', company: '', hostId: '', date: '', purpose: ''
  });
  const [hosts, setHosts] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoadingState] = useState(false);
  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const { data } = await axios.get(import.meta.env.VITE_API_URL + '/visitors/hosts');
        setHosts(data);
      } catch (err) {
        console.error('Failed to load hosts', err);
      }
    };
    fetchHosts();
  }, []);
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [photoFile, setPhotoFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(page === 'visitor-dashboard') {
      if (!validateEmail(editUser.email)) {
    setErrorMsg("Please enter a valid email address");
    return;
  }
      try{
        setLoading(true);
      const appointmentPayload = {
        hostId: formData.hostId,
        date: formData.date,
        purpose: formData.purpose,
        email: user.email
       };

        await axios.post(import.meta.env.VITE_API_URL + '/visitors/appointment', appointmentPayload);
        setSuccessMsg('Your appointment request submitted successfully!');
        setTimeout(() => {
          onSuccess();
        }, 1000);
      
      } catch(err){
        setErrorMsg(err.response?.data?.message || err.response?.data || 'Failed to submit appointment request');
      }finally{
        setLoading(false);
      }
      return;
    }

    try {
      setLoadingState(true);
      let photoUrl = "https://res.cloudinary.com/dwysh6bvr/image/upload/v1775825615/visitor_passes/czciecopau7opagozdq8.jpg";

      if (!validateEmail(editUser.email)) {
    setErrorMsg("Please enter a valid email address");
    return;
  }

      const payload = { 
        name:formData.name, 
        email:formData.email,
        phone:formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        company:formData.company, 
        photoUrl: photoUrl, 
        role: "Visitor"
       };
        
      await axios.post(import.meta.env.VITE_API_URL + '/visitors/register', payload);
      
      setSuccessMsg('Registration request submitted successfully!');
      setErrorMsg('');
      setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '', company: '', hostId: '', date: '', purpose: '' });
      setPhotoFile(null);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.response?.data || 'Failed to submit registration');
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', padding: '20px' }}>
      {loading && <Loading />}
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '600px' }}>
        <h2 className="heading" style={{ textAlign: 'center' }}>Visitor Pre-Registration</h2>
        <p style={{ textAlign: 'center', color: '#475569', marginBottom: '24px' }}>Please fill out the form to request a visitor pass.</p>

        {successMsg && <div style={{ background: '#d1fae5', color: '#059669', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>{successMsg}</div>}
        {errorMsg && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>{errorMsg}</div>}

        <form onSubmit={handleSubmit} style={{ gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          {page === 'visitor-dashboard' ?     
          <>
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
            <textarea type="text" name="purpose" className="input-field" value={formData.purpose} onChange={handleChange} required />
          </div>
          </>
           : 
           <>
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
            <label>Password</label>
            <input type="password" name="password" className="input-field" value={formData.password} onChange={handleChange} required />
          </div>
          <div>
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" className="input-field" value={formData.confirmPassword} onChange={handleChange} required />
          </div>
          <div>
            <label>Company (Optional)</label>
            <input type="text" name="company" className="input-field" value={formData.company} onChange={handleChange} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label>Visitor Photo</label>
            <input type="file" accept="image/*" className="input-field" onChange={(e) => setPhotoFile(e.target.files[0])} required />
          </div>
          </>
          }
          
          <div style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
            <button 
             type="submit" className="btn btn-success" style={{ width: '100%' }}>  Submit Request</button>
          </div>
        </form>

        {page === 'visitor-dashboard' ? null :
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: '#475569' }}>Are you a visitor?</span>
          <Link to="/visitor/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Visitor Login</Link>
        </div>
        }
      </div>
    </div>
    </>
  );
};

export default PreRegister;
