import TimeTracking from "../model/model.js";
import sequelize from "../config/database.js";
import { Op } from 'sequelize';
import { Request, Response } from 'express';
import { Visit } from '../../types.js';

const getStats = async (req: Request, res: Response) => {
  const { period } = req.params;
  const dayInMs = 24 * 60 * 60 * 1000; // todo done: day basis
  let timeFrame: Date;

  // todo done: replaced new Date() with Date.now()
  if (period === 'today') {
    timeFrame = new Date(Date.now() - dayInMs);
  } else if (period === 'week') {
    timeFrame = new Date(Date.now() - 7 * dayInMs);
  } else if (period === 'month') {
    timeFrame = new Date(Date.now() - 30 * dayInMs);
  } else {
    return res.status(400).json({ error: "Invalid period" });
  }

  // Sum up timeSpent for each site within the timeframe
  const visits: Visit[] = await TimeTracking.findAll({
    where: {
      createdAt: { [Op.gte]: timeFrame }
    },
    attributes: [
      'site',
      [sequelize.fn('SUM', sequelize.col('timeSpent')), 'timeSpent']
    ],
    group: ['site'], // todo: test and see if necessary? (ask archie)
    order: [[sequelize.fn('SUM', sequelize.col('timeSpent')), 'DESC']],
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
    visits.map(async ({ site, timeSpent }: Visit) => {
      await TimeTracking.create({
        site,
        timeSpent
      });
    })
  );

  res.status(201).json({ msg: "Visits logged" });
};

// Delete all entries
const clearAll = async (req: Request, res: Response) => {
  await TimeTracking.destroy({
    where: {}
  })
  res.json({ msg: "all data deleted" })
}

export default { getStats, logVisit, clearAll }