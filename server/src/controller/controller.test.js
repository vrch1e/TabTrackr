import express from 'express';
import router from './router.js';
import supertest from 'supertest';
import { afterEach, describe } from 'node:test';
import sequelize from '../config/database.js';
import VisitModel from '../model/model.js';
const url = 'http://localhost:3000';

describe('Unit tests', () => {

  const app = express();
  app.use(express.json());
  app.use(router);
  const request = supertest(app);

  beforeAll(async () => {
    await sequelize.authenticate();
  })

  afterEach(async () => {
    await VisitModel.destroy({where: {}});
  })

  it('should send a Visit to the database', async (done) => {
    const testVisit = { site: 'test.com', timeSpent: '10000' };
    const res = await request.post('http://localhost:3000/').send(testVisit);
    const visit = await VisitModel.findAll({where: {site: 'test.com'}});
    expect(visit).toBe({ site: 'test.com', timeSpent: '10000' });
    done();
  });

  it('should receive a Visit[] from the database', async (done) => {
    const testVisitA = { site: 'a-test.com', timeSpent: '10000' };
    const testVisitB = { site: 'b-test.com', timeSpent: '20000' };
    const res = await request.get('http://localhost:3000/stats/last24h');
    expect(res).toBe([testVisitA, testVisitB]);
    done();
  });
  
});