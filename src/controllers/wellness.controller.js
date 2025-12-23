const DailyWellness = require('../models/dailyWellness.model.js');
const Album = require('../models/album.model.js');

// Helper: format Date object to YYYY-MM-DD string
function formatDateToYMD(d) {
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * @desc   
 * @route   POST /api/wellness/
 * @access  Private
 */
exports.createWellnessLog = async (req, res) => {
  const { mood, energy, stress, sleep, date } = req.body;

  if (mood === undefined || energy === undefined || stress === undefined || sleep === undefined || !date) {
    return res.status(400).json({ success: false, error: 'Please provide date and all wellness metrics' });
  }

  // expect date in YYYY-MM-DD
  const parts = String(date).split('-');
  if (parts.length !== 3) {
    return res.status(400).json({ success: false, error: 'Invalid date format. Use YYYY-MM-DD' });
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return res.status(400).json({ success: false, error: 'Invalid date parts' });
  }

  const targetDateObj = new Date(year, month, day);
  targetDateObj.setHours(0, 0, 0, 0);
  const targetDate = formatDateToYMD(targetDateObj);

  try {
    const userId = req.user.id;

    // If a record for this user+date exists, update it (replace logs with provided values)
    let dailyLog = await DailyWellness.findOne({ user: userId, date: targetDate });

    // helper to sample one album (optionally exclude id)
    const sampleAlbum = async (excludeId) => {
      try {
        const match = excludeId ? { _id: { $nin: [excludeId] } } : {};
        const sampled = await Album.aggregate([
          { $match: match },
          { $sample: { size: 1 } }
        ]);
        return (sampled && sampled.length) ? sampled[0] : null;
      } catch (e) {
        return null;
      }
    };

    let returnedAlbum = null;

    if (dailyLog) {
      // compare with previous entry (last log) to see if metrics differ
      const prev = (dailyLog.logs && dailyLog.logs.length) ? dailyLog.logs[dailyLog.logs.length - 1] : null;
      const isDifferent = prev
        ? (prev.mood !== mood || prev.energy !== energy || prev.stress !== stress || prev.sleep !== sleep || dailyLog.album == null)
        : true;

      if (isDifferent) {
        // choose a different album than stored (if any)
        const sampled = await sampleAlbum(dailyLog.album);
        if (sampled) {
          dailyLog.album = sampled._id;
          returnedAlbum = sampled;
        }
      } else {
        // same metrics, keep existing album
        if (dailyLog.album) returnedAlbum = await Album.findById(dailyLog.album).lean();
      }

      // Replace logs with the single provided entry and recalc averages
      dailyLog.logs = [{ mood, energy, stress, sleep }];
      dailyLog.logCount = 1;
    } else {
      // create new dailyLog and randomize an album
      const sampled = await sampleAlbum();
      if (sampled) returnedAlbum = sampled;

      dailyLog = new DailyWellness({
        user: userId,
        date: targetDate,
        logs: [{ mood, energy, stress, sleep }],
        logCount: 1,
        album: sampled ? sampled._id : null
      });
    }

    // Recalculate averages
    const totalMood = dailyLog.logs.reduce((s, l) => s + l.mood, 0);
    const totalEnergy = dailyLog.logs.reduce((s, l) => s + l.energy, 0);
    const totalStress = dailyLog.logs.reduce((s, l) => s + l.stress, 0);
    const totalSleep = dailyLog.logs.reduce((s, l) => s + l.sleep, 0);

    const count = dailyLog.logCount || dailyLog.logs.length || 1;
    dailyLog.averages.mood = totalMood / count;
    dailyLog.averages.energy = totalEnergy / count;
    dailyLog.averages.stress = totalStress / count;
    dailyLog.averages.sleep = totalSleep / count;

    await dailyLog.save();

    // If we don't yet have returnedAlbum (e.g., selected by id earlier), fetch it
    if (!returnedAlbum && dailyLog.album) {
      returnedAlbum = await Album.findById(dailyLog.album).lean();
    }

    return res.status(200).json({ success: true, data: returnedAlbum || null });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc    Edit a specific wellness log
 * @route   PUT /api/wellness/:wellnessId
 * @access  Private
 */
exports.editWellnessLog = async (req, res) => {
  const { mood, energy, stress, sleep } = req.body;
  const { id } = req.params;

  if (mood === undefined || energy === undefined || stress === undefined || sleep === undefined) {
    return res.status(400).json({ success: false, error: 'Please provide all wellness metrics' });
  }

  try {
    const userId = req.user.id;
    const todayObj = new Date();
    todayObj.setHours(0, 0, 0, 0);
    const today = formatDateToYMD(todayObj);

    const dailyLog = await DailyWellness.findOne({ user: userId, date: today });
    if (!dailyLog) {
      return res.status(404).json({ success: false, error: 'No wellness logs found for today' });
    }

    const log = dailyLog.logs.id(id);
    if (!log) {
      return res.status(404).json({ success: false, error: 'Log not found' });
    }

    // Update the log values
    log.mood = mood;
    log.energy = energy;
    log.stress = stress;
    log.sleep = sleep;

    // Recalculate averages
    const totalLogs = dailyLog.logs.length;
    let totalMood = 0, totalEnergy = 0, totalStress = 0, totalSleep = 0;
    for (const l of dailyLog.logs) {
      totalMood += l.mood;
      totalEnergy += l.energy;
      totalStress += l.stress;
      totalSleep += l.sleep;
    }

    dailyLog.averages.mood = totalMood / totalLogs;
    dailyLog.averages.energy = totalEnergy / totalLogs;
    dailyLog.averages.stress = totalStress / totalLogs;
    dailyLog.averages.sleep = totalSleep / totalLogs;

    await dailyLog.save();

    res.status(200).json({
      success: true,
      data: dailyLog
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc    Lấy dữ liệu wellness theo khoảng thời gian cho biểu đồ
 * @route   GET /api/wellness/trends?period=[today|week|month]
 * @route   GET /api/wellness/trends?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * @access  Private
 */
exports.getWellness = async (req, res) => {
  const { period, startDate: manualStartDate, endDate: manualEndDate } = req.query;

  let startDate, endDate;
  const now = new Date();

  if (period) {
    // --- Logic tính toán khoảng thời gian tự động ---
    switch (period) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;

      case 'week':
        // Giả định tuần bắt đầu từ Thứ Hai (Monday)
        const currentDay = now.getDay(); // Sunday: 0, Monday: 1, ..., Saturday: 6
        const dayOffset = currentDay === 0 ? 6 : currentDay - 1; // Tính số ngày cần lùi lại để về Thứ Hai

        startDate = new Date(now);
        startDate.setDate(now.getDate() - dayOffset);
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6); // Thứ Hai + 6 ngày = Chủ Nhật
        endDate.setHours(23, 59, 59, 999);
        break;

      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);

        // Lấy ngày cuối cùng của tháng hiện tại
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;

      default:
        return res.status(400).json({ success: false, error: 'Invalid period specified. Use "today", "week", or "month".' });
    }
  } else if (manualStartDate && manualEndDate) {
    // --- Sử dụng khoảng thời gian thủ công nếu có ---
    startDate = new Date(manualStartDate);
    endDate = new Date(manualEndDate);
    endDate.setHours(23, 59, 59, 999); // Đảm bảo bao trọn ngày cuối
  } else {
    return res.status(400).json({ success: false, error: 'Please provide a period (today, week, month) or a startDate and endDate.' });
  }

  try {
    // convert startDate/endDate to YYYY-MM-DD strings for string comparison
    const startDateStr = formatDateToYMD(startDate);
    const endDateStr = formatDateToYMD(endDate);

    const isSameDate = startDateStr == endDateStr;

    // Build query; if single date requested, populate the album object
    let query = DailyWellness.find({
      user: req.user.id,
      date: {
        $gte: startDateStr,
        $lte: endDateStr
      }
    })
      .sort({ date: 'asc' });

    if (isSameDate) {
      query = query.select('date logs album').populate({ path: 'album', select: '_id name cover_image description tracks subcategories' });
    } else {
      query = query.select('date logs');
    }

    const trends = await query.exec();

    res.status(200).json({
      success: true,
      query: {
        period: period || 'custom',
        startDate: startDateStr,
        endDate: endDateStr
      },
      count: trends.length,
      data: trends
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};