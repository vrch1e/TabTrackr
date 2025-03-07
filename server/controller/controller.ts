import TimeTracking from "../model/model.js";
import sequelize from "../config/database.js";
import { Op } from 'sequelize';
import { Request, Response } from 'express';
import { Visit } from '../../types.js';

const getStats = async (req: Request, res: Response) => {
  const { period } = req.params;
  // todo: const dayInMs = 24 * 60 * 60 * 1000;
  let timeFrame: Date;

  if (period === 'today') {
    timeFrame = new Date(Date.now() - 24 * 60 * 60 * 1000);
  } else if (period === 'week') {
    timeFrame = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  } else if (period === 'month') {
    timeFrame = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  } else {
    return res.status(400).json({ error: "Invalid period" });
  }

  // Sum up timespent for each site within the timeframe
  const Visits = await TimeTracking.findAll({
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


const logVisit = async (req: Request, res: Response) => {
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