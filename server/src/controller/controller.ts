import VisitModel from "../model/model.js";
import sequelize from "../config/database.js";
import { Op } from 'sequelize';
import { Request, Response } from 'express';
import { Visit } from '../../../types.js';

// todo done: refactored due to new background.js' implementation (pt.4)
const logVisits = async (req: Request, res: Response) => {

  if (isBodyIncomplete(req.body)) return res.status(400).json('One or more fields missing.');

  const visits: Visit[] = req.body.usage;
  // Create a new entry for each session
  try {
    await Promise.all(
      visits.map(async visit => await VisitModel.create(visit))
    );
    res.status(201).json({ msg: "Visits logged." });
  }
  catch (err) {
    console.log('Error retrieving tab info:', err);
  }

  function isBodyIncomplete(body: any): boolean {
    return !body || Object.keys(body).length == 0 || !Object.hasOwn(body, 'usage') || !Array.isArray(body.usage)
      || body.usage.length == 0 || body.usage.some((visit: any) => !visit.site || !visit.timeSpent);
  }

};

const getStats = async (req: Request, res: Response) => {
  const { period } = req.params;
  const dayInMs = 24 * 60 * 60 * 1000; // todo done: DRYed multiplication on l.10, 13 & 16
  let timeFrame: Date;

  // todo done: replaced new Date() with Date.now()
  if (period === 'last24h') {
    timeFrame = new Date(Date.now() - dayInMs);
  } else if (period === 'week') {
    timeFrame = new Date(Date.now() - 7 * dayInMs);
  } else if (period === 'month') {
    timeFrame = new Date(Date.now() - 30 * dayInMs);
  } else {
    return res.status(400).json({ error: "Invalid period." });
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
    group: ['site'], // todo: what does this do?
    order: [[sequelize.fn('SUM', sequelize.col('timeSpent')), 'DESC']],
    raw: true
  });
  // todo done: sequelize SUM function stringifies numbers, e.g. timeSpent here...
  // todo done: so we need to parseInt() timeSpent to get a proper Vist[] again
  const visits: Visit[] = stringVisits.map( function (visit: any) {
    return { site: visit.site, timeSpent: parseInt(visit.timeSpent) };
  })
  res.status(200).json(visits);
};

// Delete all entries
const clearAll = async (req: Request, res: Response) => {
  await VisitModel.destroy({
    where: {}
  })
  res.json({ msg: "All data deleted." })
}

export default { getStats, logVisits, clearAll }