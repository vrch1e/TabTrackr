import TimeTracking from "../model/model.js";
import sequelize from "../config/database.js";
import service from './service.js';
import { Op } from 'sequelize'
import crypto from 'node:crypto'
import { Redis } from '@upstash/redis'
import dotenv from 'dotenv'
dotenv.config()

const getStats = async (req, res) => {
    const { period, userId, timezone } = req.params;
    console.log('made it to backend, params: ', period, userId)
    let timeFrame;

    let date = new Date()
    let ms = (
        (date.getHours() * 3600) +
        (date.getMinutes() * 60) +
        date.getSeconds()
    ) * 1000;

    if (period === 'today') {
        timeFrame = date - ms;
    } else if (period === 'week') {
        timeFrame = date - 7 * 24 * 60 * 60 * 1000;
    } else if (period === 'month') {
        timeFrame = date - 30 * 24 * 60 * 60 * 1000;
    } else if (period === 'all') {
        timeFrame = 0;
    } else {
        return res.status(400).json({ error: "Invalid period" });
    }

    // Sum up timespent for each site within the timeframe
    const visits = await TimeTracking.findAll({
        where: {
            createdAt: { [Op.gte]: new Date(timeFrame) },
            userId
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

const getFirstEntry = async (req, res) => {

    const { userId } = req.params;
    
    const firstEntry = await TimeTracking.findOne({
        where: { userId },
        order: [['createdAt', 'ASC']],
        attributes: ['createdAt'],
        raw: true
    });

    if (!firstEntry) {
        res.status(400).json({ message: 'No usage data found for this user' });
    }

    const totalDaysUsing = Math.floor(
        (Date.now() - new Date(firstEntry.createdAt)) / (1000 * 60 * 60 * 24)
    )

    res.status(200).json({ totalDaysUsing });
}

const createSession = async (req, res) => {
    const { userId } = req.body;
    const token = crypto.randomBytes(32).toString("hex");
    try {
        const redis = new Redis({
            url: process.env.REDIS_URL,
            token: process.env.REDIS_TOKEN,
        })
        await redis.set(token, userId, {ex: 2592000})
        console.log('set token successfully: ', token)
        res.status(200).json({ token })
    } catch (err) {
        console.log('fatass error with url or redis token, ', err)
    }

    // await redis.set(token, userId, {ex: 600})
    // res.status(200).json({ token })
}

const getUserId = async (req, res) => {
    const { token } = req.body;
    console.log('token for getting userId: ', token)
    const redis = new Redis({
        url: process.env.REDIS_URL,
        token: process.env.REDIS_TOKEN,
    })
    let userId = await redis.get(token);
    res.status(200).json({ userId })
}

const logVisit = async (req, res) => {
  try {
    await service.saveVisits(req.body.usage);
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

export default { getStats, getFirstEntry, logVisit, clearAll, testEc2, createSession, getUserId }