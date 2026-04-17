const Visitor = require('../models/Visitor');
const Appointment = require('../models/Appointment');

const getDashboardStats = async (req, res) => {
  try {
    const totalVisitors = await Visitor.countDocuments();
    const allAppointments = await Appointment.find().populate('hostId', 'name');

    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;

    const hostActivity = {};

    allAppointments.forEach((appointment) => {
      if (appointment.status === 'Pending') pendingCount++;
      else if (appointment.status === 'Approved') approvedCount++;
      else if (appointment.status === 'Rejected') rejectedCount++;

      if (appointment.hostId && appointment.hostId.name) {
        const hostName = appointment.hostId.name;
        hostActivity[hostName] = (hostActivity[hostName] || 0) + 1;
      }
    });

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const checkLogs = await Appointment.find({
      checkInTime: { $gte: sevenDaysAgo }
    });

    const checkInByDay = {
      Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0
    };

    checkLogs.forEach((res) => {
      if (res.checkInTime) {
        const day = new Date(res.checkInTime).toLocaleDateString('en-US', {
          weekday: 'short'
        });

        if (checkInByDay[day] !== undefined) {
          checkInByDay[day]++;
        }
      }
    });

    const checkInsWeeklyArr = Object.keys(checkInByDay).map((day) => ({
      name: day,
      checkIns: checkInByDay[day]
    }));

    res.json({
      totalVisitors,
      appointments: {
        total: allAppointments.length,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount
      },
      checkInsWeekly: checkInsWeeklyArr
    });

  } catch (error) {
    console.error('Error in getDashboardStats:', error.message);
    res.status(500).json({ message: 'Failed to load dashboard stats' });
  }
};

module.exports = {getDashboardStats}