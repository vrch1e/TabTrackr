import TimeTracking from "../model/model.js";
import sequelize from "../config/database.js";
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
    const visits = req.body.usage;

    if (!Array.isArray(visits)) {
        return res.status(400).json({ error: "Expected an array of visits" });
    }

    // Create a new entry for each session
    await Promise.all(
        visits.map(async ({ site, timespent }) => {
            await TimeTracking.create({
                site,
                timespent
            });
        })
    );

    res.status(201).json({ msg: "Visits logged" });
};


const clearAll = async (req, res) => {
    await TimeTracking.destroy({
        where: {}
    })
    res.json({ msg: "all data deleted" })
}

export default { getStats, logVisit, clearAll }