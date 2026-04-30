import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Users, CalendarCheck, CalendarX } from 'lucide-react';
import './Analytics.css';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

const Analytics = () => {
  const { user, API } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect( () => {
    const fetchStats = async () => {
      try {
        const token = user?.token;
        const res = await API.get('/analytics/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

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

      {/* total appoitmens details on approve and pending status  */}
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
            <h3 className="kpi-title">Approved Appointments</h3>
            <TrendingUp className="kpi-icon" style={{ color: '#8b5cf6' }} />
          </div>
          <p className="kpi-value">{stats.appointments.approved}</p>
        </div>
      </div>

     
    </div>
  );
};

export default Analytics;
