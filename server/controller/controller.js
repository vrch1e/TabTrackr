import TimeTracking from "../model/model.js";
import sequelize from "../config/database.js";
import { saveVisits } from './service.js';
import { Op } from 'sequelize'

const getStats = async (req, res) => {
    const { period } = req.params;
    let timeFrame;

    if (period === 'today') {
        timeFrame = new Date(new Date() - 24 * 60 * 60 * 1000);
    } else if (period === 'week') {
        timeFrame = new Date(new Date() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === 'month') {
        timeFrame = new Date(new Date() - 30 * 24 * 60 * 60 * 1000);
    } else {
        return res.status(400).json({ error: "Invalid period" });
    }

    // Sum up timespent for each site within the timeframe
    const visits = await TimeTracking.findAll({
        where: {
            createdAt: { [Op.gte]: timeFrame }
        },
        attributes: [
            'site', 
            [sequelize.fn('SUM', sequelize.col('timespent')), 'totalTimeSpent']
        ],
        group: ['site'],
        order: [[sequelize.fn('SUM', sequelize.col('timespent')), 'DESC']],
        raw: true
    });
    

    res.status(200).json(visits);
};


const logVisit = async (req, res) => {
  try {
    await saveVisits(req.body.usage);
    console.log('successful log query');
    res.status(201).json({ msg: "Visits logged" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

const clearAll = async (req, res) => {
    await TimeTracking.destroy({
        where: {}
    })
    res.json({ msg: "all data deleted" })
}

const testEc2 = async (req, res) => {
    res.json({"success": "success"})
}

export default { getStats, logVisit, clearAll, testEc2 }