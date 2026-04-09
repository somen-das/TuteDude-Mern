const Visitor = require('../models/Visitor');
const Appointment = require('../models/Appointment');
const CheckLog = require('../models/CheckLog');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    let orgQuery = {};
    if (req.user && req.user.organization) {
      orgQuery.organization = req.user.organization;
    }

    const totalVisitors = await Visitor.countDocuments(orgQuery);
    
    const allAppointments = await Appointment.find(orgQuery).populate('hostId', 'name');
    
    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;
    
    let hostActivity = {};

    for (let i = 0; i < allAppointments.length; i++) {
      let appointment = allAppointments[i];
      
      if (appointment.status === 'Pending') {
        pendingCount++;
      } else if (appointment.status === 'Approved') {
        approvedCount++;
      } else if (appointment.status === 'Rejected') {
        rejectedCount++;
      }
      
      if (appointment.hostId && appointment.hostId.name) {
        let hostName = appointment.hostId.name;
        if (!hostActivity[hostName]) {
          hostActivity[hostName] = 0;
        }
        hostActivity[hostName]++;
      }
    }

    let hostsArray = [];
    for (let host in hostActivity) {
      hostsArray.push({
        name: host,
        count: hostActivity[host]
      });
    }
    
    for (let i = 0; i < hostsArray.length; i++) {
      for (let j = i + 1; j < hostsArray.length; j++) {
        if (hostsArray[j].count > hostsArray[i].count) {
          let temp = hostsArray[i];
          hostsArray[i] = hostsArray[j];
          hostsArray[j] = temp;
        }
      }
    }
    
    let mostActiveHosts = [];
    for(let i = 0; i < hostsArray.length && i < 5; i++) {
        mostActiveHosts.push(hostsArray[i]);
    }

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    orgQuery.checkInTime = { $gte: sevenDaysAgo };
    const checkLogs = await CheckLog.find(orgQuery);
    
    let checkInByDay = {
      Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0
    };

    for (let i = 0; i < checkLogs.length; i++) {
        let log = checkLogs[i];
        if (log.checkInTime) {
            let dateStr = new Date(log.checkInTime).toLocaleDateString('en-US', { weekday: 'short' });
            if (checkInByDay[dateStr] !== undefined) {
                checkInByDay[dateStr]++;
            }
        }
    }

    let checkInsWeeklyArray = [];
    for (let day in checkInByDay) {
        checkInsWeeklyArray.push({ name: day, checkIns: checkInByDay[day] });
    }

    res.json({
      totalVisitors: totalVisitors,
      appointments: {
        total: allAppointments.length,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount
      },
      mostActiveHosts: mostActiveHosts,
      checkInsWeekly: checkInsWeeklyArray
    });
    
  } catch (error) {
    console.log("There was an error in getDashboardStats:", error);
    res.status(500).json({ message: "Server error getting analytics" });
  }
};
