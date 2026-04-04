import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminDashboard from '../views/AdminDashboard';
import EmployeeDashboard from '../views/EmployeeDashboard';
import SecurityDashboard from '../views/SecurityDashboard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 className="heading" style={{ marginBottom: '8px' }}>Welcome, {user.name}</h1>
        <p style={{ color: '#94a3b8' }}>Here is your {user.role} dashboard overview.</p>
      </div>

      {user.role === 'Admin' && <AdminDashboard />}
      {user.role === 'Employee' && <EmployeeDashboard />}
      {user.role === 'Security' && <SecurityDashboard />}
    </div>
  );
};

export default Dashboard;
