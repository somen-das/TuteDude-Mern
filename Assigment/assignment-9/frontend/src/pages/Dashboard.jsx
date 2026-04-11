import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminDashboard from '../views/AdminDashboard';
import EmployeeDashboard from '../views/EmployeeDashboard';
import SecurityDashboard from '../views/SecurityDashboard';
import VisitorDashboard from '../views/VisitorDashboard';
import Loading from '../components/Loading';
const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  if (!user) return null;
  return (
    <>
       {loading && <Loading />} 
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 className="heading" style={{ marginBottom: '8px' }}>Welcome, {user.name}</h1>
        <p style={{ color: '#94a3b8' }}>Here is your {user.role} dashboard overview.</p>
      </div>

      {user.role === 'Admin' && <AdminDashboard />}
      {user.role === 'Employee' && <EmployeeDashboard setLoading={setLoading}/>}
      {user.role === 'Security' && <SecurityDashboard setLoading={setLoading}/>}
      {user.role === 'Visitor' && <VisitorDashboard setLoading={setLoading} />}
    </div>
    </>
  );
};

export default Dashboard;
