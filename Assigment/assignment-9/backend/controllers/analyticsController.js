const Visitor = require('../models/Visitor');
const Appointment = require('../models/Appointment');
const CheckLog = require('../models/CheckLog');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    const orgQuery = req.user && req.user.organization ? { organization: req.user.organization } : {};

    const totalVisitors = await Visitor.countDocuments(orgQuery);
    

    const allAppointments = await Appointment.find(orgQuery).populate('hostId', 'name');
    
    const pendingAppointments = allAppointments.filter(a => a.status === 'Pending').length;
    const approvedAppointments = allAppointments.filter(a => a.status === 'Approved').length;
    const rejectedAppointments = allAppointments.filter(a => a.status === 'Rejected').length;
    
    const hostActivity = {};
    allAppointments.forEach(appointment => {
      if (appointment.hostId && appointment.hostId.name) {
        const name = appointment.hostId.name;
        if (!hostActivity[name]) {
          hostActivity[name] = 0;
        }
        hostActivity[name]++;
      }
    });

    const mostActiveHosts = Object.keys(hostActivity)
      .map(name => ({ name, count: hostActivity[name] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const checkLogs = await CheckLog.find({ ...orgQuery, checkInTime: { $gte: sevenDaysAgo } });
    
    const checkInByDay = {
      Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0
    };

    for (let i = 0; i < checkLogs.length; i++) {
        const log = checkLogs[i];
        if (log.checkInTime) {
            const dateStr = new Date(log.checkInTime).toLocaleDateString('en-US', { weekday: 'short' });
            if (checkInByDay[dateStr] !== undefined) {
                checkInByDay[dateStr]++;
            }
        }
    }

    res.json({
      totalVisitors: totalVisitors,
      appointments: {
        total: allAppointments.length,
        pending: pendingAppointments,
        approved: approvedAppointments,
        rejected: rejectedAppointments
      },
      mostActiveHosts: mostActiveHosts,
      checkInsWeekly: Object.keys(checkInByDay).map(day => ({ name: day, checkIns: checkInByDay[day] }))
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "An error occurred while fetching dashboard stats" });
  }
};
