import TimeTracking from "../model/model";
import { Op } from 'sequelize'

const getStats = async (req, res) => {
    const { period } = req.params;
    let timeFrame;

    if (period === 'today') {
        timeFrame = new Date(new Date() - 24 * 60 * 60 * 1000)
    } else if (period === 'week') {
        timeFrame = new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
    } else if (period === 'month') {
        timeFrame = new Date(new Date() - 30 * 7 * 24 * 60 * 60 * 1000)
    }

    const visits = await TimeTracking.findAll({
        where: {
            timestamp: {
                [Op.gte]: timeFrame
            }
        }
    })

    res.status(200).json(visits)
}

const logVisit = async (req, res) => {
    const { site, timespent } = req.body;

    const visit = await TimeTracking.create({
        site,
        timespent
    })
    res.status(201).json(visit)
}

const clearAll = async (req, res) => {
    await TimeTracking.destroy({
        where: {}
    })
    res.json({ msg: "all data deleted" })
}

export default { getStats, logVisit, clearAll }