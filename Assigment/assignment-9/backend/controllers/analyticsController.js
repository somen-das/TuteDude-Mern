const Visitor = require('../models/Visitor');
const Appointment = require('../models/Appointment');
const CheckLog = require('../models/CheckLog');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    const orgQuery = req.user && req.user.organization ? { organization: req.user.organization } : {};

    const totalVisitors = await Visitor.countDocuments(orgQuery);
    
    const appointments = await Appointment.find(orgQuery);
    const pendingAppointments = appointments.filter(a => a.status === 'Pending').length;
    const approvedAppointments = appointments.filter(a => a.status === 'Approved').length;
    const rejectedAppointments = appointments.filter(a => a.status === 'Rejected').length;
    
    const hostsAggregation = await Appointment.aggregate([
      { $match: orgQuery },
      { $group: { _id: "$hostId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    const hostIds = hostsAggregation.map(h => h._id);
    const hosts = await User.find({ _id: { $in: hostIds } }, 'name');
    const mostActiveHosts = hostsAggregation.map(h => ({
      name: hosts.find(user => user._id.toString() === h._id.toString())?.name || 'Unknown',
      count: h.count
    }));

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const checkLogs = await CheckLog.find({ ...orgQuery, checkInTime: { $gte: sevenDaysAgo } });
    const checkInByDay = {
      Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0
    };
    checkLogs.forEach(log => {
      if (log.checkInTime) {
        const day = new Date(log.checkInTime).toLocaleDateString('en-US', { weekday: 'short' });
        if (checkInByDay[day] !== undefined) {
          checkInByDay[day]++;
        }
      }
    });

    res.json({
      totalVisitors,
      appointments: {
        total: appointments.length,
        pending: pendingAppointments,
        approved: approvedAppointments,
        rejected: rejectedAppointments
      },
      mostActiveHosts,
      checkInsWeekly: Object.keys(checkInByDay).map(day => ({ name: day, checkIns: checkInByDay[day] }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
