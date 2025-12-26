const { default: userModel } = require("../models/user.model");
const DailyWellness = require("../models/dailyWellness.model");
const Insight = require("../models/insight.model");
const { default: subscriptionModel } = require("../models/subscription.model");

/**
 * @desc    
 * @route   GET /api/user/profile
 * @access  Private (Cần token)
 */
exports.getUserProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};

/**
 * @desc   
 * @route   PUT /api/user/profile
 * @access  Private 
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);


    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.avatar = req.body.avatar || user.avatar;

      if (req.file) {
        user.avatar = `/uploads/avatars/${req.file.filename}`;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


/**
 * @desc   
 * @route   DELETE /api/user
 * @access  Private 
 */
exports.deleteUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (user) {
      await DailyWellness.deleteMany({ user: req.user.id });
      await Insight.deleteMany({ user_id: req.user.id });
      await subscriptionModel.deleteMany({ userId: req.user.id });
      await userModel.findByIdAndDelete(req.user.id);

      res.status(200).json({
        success: true,
      });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc   
 * @route   PUT /api/user/quantum-session
 * @access  Private 
 */
exports.logQuantumSession = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    const queryDateStr = req.query.date && /^\d{4}-\d{2}-\d{2}$/.test(req.query.date)
      ? req.query.date
      : new Date().toISOString().split('T')[0];

    const parseYMD = s => {
      const parts = String(s).split('-').map(Number);
      return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    };

    if (user) {
      const dateObj = parseYMD(queryDateStr);

      let lastDateObj = null;
      if (user.lastQuantumSessionDate) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(user.lastQuantumSessionDate)) {
          lastDateObj = parseYMD(user.lastQuantumSessionDate);
        } else {
          lastDateObj = new Date(user.lastQuantumSessionDate);
        }
      }

      if (!lastDateObj) {
        user.quantumSessionsCount += 1;
        user.lastQuantumSessionDate = queryDateStr;
        await user.save();
      } else {
        const lastTime = lastDateObj.getTime();
        const newTime = dateObj.getTime();
        if (lastTime > newTime) {
          // Provided date is older than stored last date: ignore
        } else if (lastTime === newTime) {
          // same day: do nothing
        } else {
          // new date is after last date: increment
          user.quantumSessionsCount += 1;
          user.lastQuantumSessionDate = queryDateStr;
          await user.save();
        }
      }

      res.status(200).json({
        success: true,
        data: {
          quantumSessionsCount: user.quantumSessionsCount,
          lastQuantumSessionDate: user.lastQuantumSessionDate,
        },
      });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



/**
 * @desc   
 * @route   GET /api/user/statistics
 * @access  Private 
 */
exports.getUserStatistics = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    let dailyWellness = await DailyWellness.find({ user: req.user.id }).sort({ date: -1 });

    const totalLogs = dailyWellness.length;

    if (totalLogs === 0) {
      return res.status(200).json({
        success: true, data: {
          totalLogs: 0, streakDays: 0,
          quantumSessionsCount: user.quantumSessionsCount,
          lastQuantumSessionDate: user.lastQuantumSessionDate,
        }
      });
    }

    const dateSet = new Set(dailyWellness.map(entry => new Date(entry.date).toISOString().split('T')[0]));

    const parseYMD = s => {
      const parts = String(s).split('-').map(Number);
      return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    };

    const queryDateStr = req.query.date && /^\d{4}-\d{2}-\d{2}$/.test(req.query.date)
      ? req.query.date
      : new Date().toISOString().split('T')[0];

    const queryDateObj = parseYMD(queryDateStr);
    const todayStr = queryDateStr;
    const yObj = new Date(queryDateObj);
    yObj.setUTCDate(yObj.getUTCDate() - 1);
    const yesterdayStr = yObj.toISOString().split('T')[0];

    const latestDateStr = new Date(dailyWellness[0].date).toISOString().split('T')[0];

    if (latestDateStr !== todayStr && latestDateStr !== yesterdayStr) {
      return res.status(200).json({
        success: true, data: {
          totalLogs,
          streakDays: 0,
          quantumSessionsCount: user.quantumSessionsCount,
          lastQuantumSessionDate: user.lastQuantumSessionDate,
        }
      });
    }

    let streakDays = 0;
    let cursor = parseYMD(latestDateStr);
    while (true) {
      const cursorStr = cursor.toISOString().split('T')[0];
      if (dateSet.has(cursorStr)) {
        streakDays += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }

    return res.status(200).json({
      success: true, data: {
        totalLogs: totalLogs,
        streakDays: streakDays,
        quantumSessionsCount: user.quantumSessionsCount,
        lastQuantumSessionDate: user.lastQuantumSessionDate,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};