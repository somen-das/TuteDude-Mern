import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminDashboard from '../views/AdminDashboard';
import EmployeeDashboard from '../views/EmployeeDashboard';
import SecurityDashboard from '../views/SecurityDashboard';
import VisitorDashboard from '../views/VisitorDashboard';
import Loading from '../components/Loading';
import defaultUser from '../assets/icons/user.png';
import Toast from '../components/Toast';
const Dashboard = () => {
  const { user, setUser, API } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await API.put(`/auth/edit/${user._id}`,
        {
          name: name,
          role: user.role
        },
        {
          headers: {
            authorization: `Bearer ${user.token}`
          }
        }
      );
      const updatedUser = { ...user, ...res.data.user};
      localStorage.setItem('userInfo', JSON.stringify(updatedUser))
      setUser(updatedUser);
      setIsEditing(false);
      setToast({ message: "Name Update Successfully", type: "success", onClose: () => setToast(null) })

    } catch (err) {
      console.error('error message',err.response?.data || err.message);
      setToast({ message: err.message, type: "error", onClose: () => setToast(null) })
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {loading && <Loading />}
      <div className="animate-fade-in">
        <div style={{ marginBottom: '32px' }}>
          <div className="dasboardHeader">
            <div className="username">
              {!isEditing ? (
                <>
                  <h1 className="heading" style={{ marginBottom: '8px' }}>
                    Welcome, {user.name}
                  </h1>

                  {/* Edit Icon */}
                  <span
                    onClick={() => setIsEditing(true)}
                    style={{ cursor: 'pointer', fontSize: '18px' }}
                    title="Edit Name"
                  >
                    ✏️
                  </span>
                </>
              ) : (
                <>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid #ccc'
                    }}
                  />

                  <button className='btn btn-success' onClick={handleUpdate} disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </button>

                  <button className='btn btn-warning' onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                </>
              )}
            </div>
            <div className="usericon">
              <img height={60} width={60} style={{ borderRadius: 30 }} src={user.visitor?.photoUrl || defaultUser} alt="Avatar" />
            </div>
          </div>
          <p style={{ color: '#94a3b8' }}>Here is your {user.role} dashboard overview.</p>
        </div>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        {user.role === 'Admin' && <AdminDashboard />}
        {user.role === 'Employee' && <EmployeeDashboard setLoading={setLoading} />}
        {user.role === 'Security' && <SecurityDashboard setLoading={setLoading} />}
        {user.role === 'Visitor' && <VisitorDashboard setLoading={setLoading} />}
      </div>
    </>
  );
};

export default Dashboard;
