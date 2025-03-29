import VisitModel from "../model/model.js";
import sequelize from "../config/database.js";
import { Op } from 'sequelize';
import { Request, Response } from 'express';
import { Visit } from '../../../types.js';

const logVisits = async (req: Request, res: Response) => {

  if (isBodyIncomplete(req.body)) res.status(400).json('One or more fields missing.');

  else {
    const visits: Visit[] = req.body.usage;

    try {
      await Promise.all(
        visits.map(async visit => await VisitModel.create(visit))
      );
      res.status(201).json({ msg: "Visits logged." });
    }
    catch (err) {
      console.log('Error retrieving tab info:', err);
    }
  }

  function isBodyIncomplete(body: any): boolean {
    return !body || Object.keys(body).length == 0 || !Object.hasOwn(body, 'usage') || !Array.isArray(body.usage)
      || body.usage.length == 0 || body.usage.some((visit: any) => !visit.site || !visit.timeSpent);
  }
};

const getStats = async (req: Request, res: Response) => {
  const { period } = req.params;
  const dayInMs = 24 * 60 * 60 * 1000; 
  let timeFrame: Date;

  if (period === 'last24h') {
    timeFrame = new Date(Date.now() - dayInMs);
  } else if (period === 'week') {
    timeFrame = new Date(Date.now() - 7 * dayInMs);
  } else if (period === 'month') {
    timeFrame = new Date(Date.now() - 30 * dayInMs);
  } else {
    res.status(400).json({ error: "Invalid period." });
    return;
  }

  // Sum up timeSpent for each site within the timeframe
  const stringVisits: any = await VisitModel.findAll({
    where: {
      createdAt: { [Op.gte]: timeFrame }
    },
    attributes: [
      'site',
      [sequelize.fn('SUM', sequelize.col('timeSpent')), 'timeSpent']
    ],
    group: ['site'],
    order: [[sequelize.fn('SUM', sequelize.col('timeSpent')), 'DESC']],
    raw: true
  });
  const visits: Visit[] = stringVisits.map(function (visit: any) {
    return { site: visit.site, timeSpent: parseInt(visit.timeSpent) };
  })
  res.status(200).json(visits);
};

const clearAll = async (req: Request, res: Response) => {
  await VisitModel.destroy({
    where: {}
  })
  res.json({ msg: "All data deleted." })
}

export default { getStats, logVisits, clearAll }