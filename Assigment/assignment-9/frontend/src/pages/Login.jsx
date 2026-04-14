import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Loading from '../components/Loading';
const Login = ({ role }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setloading] = useState(false)
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

  const handleSubmit = async (e) => {
  e.preventDefault();
    setloading(true);
  setError('');

  if (!email.trim()) {
    setError("Email is required");
    return;
  }

  if (!validateEmail(email)) {
    setError("Please enter a valid email address");
    return;
  }

  if (!password.trim()) {
    setError("Password is required");
    return;
  }

  try {
    setloading(true);
    await login(email, password, role);
    navigate('/dashboard');
  } catch (err) {
    setError(err);
  } finally {
    setloading(false);
  }
};
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 className="heading" style={{ marginBottom: '8px' }}>Staff Login</h2>
          <p style={{ color: '#475569' }}>Access your PassManager dashboard</p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label>Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '16px' }}>
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: '#475569' }}>Are you a visitor? </span>
          <Link to="/register-visitor" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Pre-Register Here</Link>
        </div>
      </div>
      {loading && <Loading/>}
    </div>
  );
};

export default Login;
