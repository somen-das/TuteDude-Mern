import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Users, UserCheck, BarChart2 } from 'lucide-react';
import './ComponentFile.css';

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
    <aside className='comp-aside'>
      <h2 className='comp-aside-h2' >
        Pass<span style={{ color: 'var(--primary)' }}>Manager</span>
      </h2>

      <nav className='cap-aside-nav' >
        <div 
          className='cap-aside-nav-container'
          onClick={() => navigate('/dashboard')}
          style={{background: isActive('/dashboard') ? 'rgba(37; 99; 235; 0.1)' : 'transparent', 
            color: isActive('/dashboard') ? 'var(--primary)' : '#475569'}}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </div>
        
        {user?.role === 'Admin' && (
          <div className='cap-aside-nav-admin'
            onClick={() => navigate('/analytics')}
            style={{background: isActive('/analytics') ? 'rgba(37; 99; 235; 0.1)' : 'transparent', 
              color: isActive('/analytics') ? 'var(--primary)' : '#475569'}}
          >
            <BarChart2 size={20} />
            <span>Analytics</span>
          </div>
        )}
      </nav>

      <div className='dashboard-side-section' >
        <p className='dashboard-side-para' >{user?.name}</p>
        <p className='dashboard-side-pararole' >{user?.role}</p>
      </div>

      <button onClick={handleLogout} className="btn btn-danger dashboard-sidebtn" >
        <LogOut size={16} /> Logout
      </button>
    </aside>
  );
};

const AppLayout = ({ children }) => {
  return (
    <div   className='layout-container'>
      <Sidebar />
      <main className='layout-container-main'>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
