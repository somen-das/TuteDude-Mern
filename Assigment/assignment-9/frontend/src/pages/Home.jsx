import { Link } from 'react-router-dom';
import { Shield, Clock, Users, ArrowRight } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <nav className="home-nav">
        <div className="nav-brand">
          <Shield size={28} />
          <span>VMS Portal</span>
        </div>
        <div className="nav-links">
          <Link to="/login" className="nav-btn">Admin Login</Link>
          <Link to="/register-visitor" className="nav-btn nav-btn-primary">
            Pre-Register
          </Link>
        </div>
      </nav>

      <main className="hero-section">
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            Smart & Secure Visitor Management
          </h1>
          <p className="hero-subtitle">
            Streamline your front desk experience. Pre-register visitors, schedule appointments, and maintain security with our modern visitor management system.
          </p>
          
          <div className="hero-cta">
            <Link to="/register-visitor" className="cta-btn cta-primary">
              Register as Visitor
              <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="cta-btn cta-secondary">
              Staff Access
            </Link>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Clock size={28} />
            </div>
            <h3 className="feature-title">Quick Pre-Registration</h3>
            <p className="feature-desc">
              Save time at the front desk. Pre-register online and get a fast-track code for immediate entry when you arrive.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Shield size={28} />
            </div>
            <h3 className="feature-title">Enhanced Security</h3>
            <p className="feature-desc">
              Keep premises secure with verified visitor logs, approval workflows, and instant notifications for hosts.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Users size={28} />
            </div>
            <h3 className="feature-title">Host Dashboard</h3>
            <p className="feature-desc">
              Staff can easily manage their appointments, view expected visitors, and grant approvals from a central dashboard.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
