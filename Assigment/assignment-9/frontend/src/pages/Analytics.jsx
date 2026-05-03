import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TrendingUp, Users, CalendarCheck, CalendarX } from 'lucide-react';
import './Analytics.css';

const Analytics = () => {
  const { user, API } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/analytics/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user, API]);

  if (loading) return <div className="p-8">Loading analytics...</div>;
  if (!stats) return <div className="p-8">Failed to load analytics data.</div>;

  const total = stats.appointments.total || 1;
  const approvedPer = (stats.appointments.approved / total) * 100;
  const pendingPer = (stats.appointments.pending / total) * 100;
  const rejectedPer = (stats.appointments.rejected / total) * 100;

  return (
    <div className="analytics-container animate-fade-in">
      <div className="analytics-header">
        <h1 className="heading">Workspace Analytics</h1>
        <p className="subtitle">Overview and visitor trends across your organization.</p>
      </div>

      <div className="analitich-grid">
        <div className="analitich-card glass-panel">
          <div className="analitich-header">
            <h3 className="analitich-title">Total Visitors</h3>
            <Users className="analitich-icon" style={{ color: '#3b82f6' }} />
          </div>
          <p className="analitich-value">{stats.totalVisitors}</p>
        </div>
        <div className="analitich-card glass-panel">
          <div className="analitich-header">
            <h3 className="analitich-title">Appointments</h3>
            <CalendarCheck className="analitich-icon" style={{ color: '#10b981' }} />
          </div>
          <p className="analitich-value">{stats.appointments.total}</p>
        </div>
        <div className="analitich-card glass-panel">
          <div className="analitich-header">
            <h3 className="analitich-title">Pending</h3>
            <CalendarX className="analitich-icon" style={{ color: '#f59e0b' }} />
          </div>
          <p className="analitich-value">{stats.appointments.pending}</p>
        </div>
        <div className="analitich-card glass-panel">
          <div className="analitich-header">
            <h3 className="analitich-title">Approved</h3>
            <TrendingUp className="analitich-icon" style={{ color: '#8b5cf6' }} />
          </div>
          <p className="analitich-value">{stats.appointments.approved}</p>
        </div>
      </div>

      <div className="charts-grid-manual">
        <div className="chart-card glass-panel">
          <h3 className="chart-title">Appointment Distribution</h3>
          <div className="custom-bar-container">
            <div className="stat-item">
              <div className="stat-label"><span>Approved</span> <span>{stats.appointments.approved}</span></div>
              <div className="progress-bg"><div className="progress-fill approved" style={{ width: `${approvedPer}%` }}></div></div>
            </div>
            <div className="stat-item">
              <div className="stat-label"><span>Pending</span> <span>{stats.appointments.pending}</span></div>
              <div className="progress-bg"><div className="progress-fill pending" style={{ width: `${pendingPer}%` }}></div></div>
            </div>
            <div className="stat-item">
              <div className="stat-label"><span>Rejected</span> <span>{stats.appointments.rejected}</span></div>
              <div className="progress-bg"><div className="progress-fill rejected" style={{ width: `${rejectedPer}%` }}></div></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;