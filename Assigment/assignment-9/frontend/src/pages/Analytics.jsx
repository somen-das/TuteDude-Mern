import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Users, CalendarCheck, CalendarX } from 'lucide-react';
import './Analytics.css';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

const Analytics = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = user?.token;
        const res = await axios.get(process.env.VITE_APP_TITLE + '/analytics/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
        console.log(res);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8">Loading analytics...</div>;
  if (!stats) return <div className="p-8">Failed to load analytics data.</div>;

  const pieData = [
    { name: 'Approved', value: stats.appointments.approved },
    { name: 'Pending', value: stats.appointments.pending },
    { name: 'Rejected', value: stats.appointments.rejected }
  ];

  return (
    <div className="analytics-container animate-fade-in">
      <div className="analytics-header">
        <h1 className="heading">Workspace Analytics</h1>
        <p className="subtitle">Overview and visitor trends across your organization.</p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card glass-panel">
          <div className="kpi-header">
            <h3 className="kpi-title">Total Visitors</h3>
            <Users className="kpi-icon" style={{ color: '#3b82f6' }} />
          </div>
          <p className="kpi-value">{stats.totalVisitors}</p>
        </div>
        <div className="kpi-card glass-panel">
          <div className="kpi-header">
            <h3 className="kpi-title">Appointments</h3>
            <CalendarCheck className="kpi-icon" style={{ color: '#10b981' }} />
          </div>
          <p className="kpi-value">{stats.appointments.total}</p>
        </div>
        <div className="kpi-card glass-panel">
          <div className="kpi-header">
            <h3 className="kpi-title">Pending Approvals</h3>
            <CalendarX className="kpi-icon" style={{ color: '#f59e0b' }} />
          </div>
          <p className="kpi-value">{stats.appointments.pending}</p>
        </div>
        <div className="kpi-card glass-panel">
          <div className="kpi-header">
            <h3 className="kpi-title">Active Hosts</h3>
            <TrendingUp className="kpi-icon" style={{ color: '#8b5cf6' }} />
          </div>
          <p className="kpi-value">{stats.mostActiveHosts.length}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card glass-panel">
          <h3 className="chart-title">Appointment Statuses</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card glass-panel">
          <h3 className="chart-title">Check-ins Last 7 Days</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.checkInsWeekly}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                <Bar dataKey="checkIns" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {stats.mostActiveHosts.length > 0 && (
        <div className="hosts-section glass-panel">
          <h3 className="chart-title">Most Active Hosts</h3>
          <div className="hosts-list">
            {stats.mostActiveHosts.map((host, idx) => (
              <div key={idx} className="host-item">
                <div className="host-info">
                  <div className="host-avatar">{host.name.charAt(0)}</div>
                  <span className="host-name">{host.name}</span>
                </div>
                <div className="host-count">{host.count} Appointments</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
