import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Users, UserCheck, BarChart2 } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/visitor/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside style={{ width: '260px', padding: '24px', background: 'var(--surface)', borderRight: '1px solid var(--surface-border)', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-color)', marginBottom: '40px' }}>
        Pass<span style={{ color: 'var(--primary)' }}>Manager</span>
      </h2>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div 
          onClick={() => navigate('/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: isActive('/dashboard') ? 'rgba(37, 99, 235, 0.1)' : 'transparent', borderRadius: '6px', color: isActive('/dashboard') ? 'var(--primary)' : '#475569', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s ease' }}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </div>
        
        {user?.role === 'Admin' && (
          <div 
            onClick={() => navigate('/analytics')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: isActive('/analytics') ? 'rgba(37, 99, 235, 0.1)' : 'transparent', borderRadius: '6px', color: isActive('/analytics') ? 'var(--primary)' : '#475569', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s ease' }}
          >
            <BarChart2 size={20} />
            <span>Analytics</span>
          </div>
        )}
      </nav>

      <div style={{ padding: '16px', background: '#f8fafc', border: '1px solid var(--surface-border)', borderRadius: '6px', marginBottom: '16px' }}>
        <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem', color: '#0f172a' }}>{user?.name}</p>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem' }}>{user?.role}</p>
      </div>

      <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%' }}>
        <LogOut size={16} /> Logout
      </button>
    </aside>
  );
};

const AppLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: '260px', flex: 1, padding: '40px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
