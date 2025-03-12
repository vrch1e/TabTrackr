import express from 'express';
import router from '../router.js';
import supertest from 'supertest';
import { describe, beforeAll, afterEach, it, expect } from 'vitest'
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

  it('should send a Visit to the database', () => new Promise( done => {
    const testVisit = { site: 'test.com', timeSpent: 10000 };
    request.post('/visits').send({ usage: [testVisit] })
    .then( () => VisitModel.findOne({where: {site: 'test.com'}}))
    .then( instance => {
      expect(instance.site).toBe('test.com');
      expect(instance.timeSpent).toBe(10000);
      done();
    })
    .catch(err => console.log('Error sending tab info to DB:', err));
  }));

  it('should receive a Visit[] from the database', async (done) => {
    try {
      const resEmpty = await request.get('/stats/last24h');
      expect(JSON.parse(resEmpty)).toBe([]);
      const testVisitA = { site: 'a-test.com', timeSpent: '10000' };
      const testVisitB = { site: 'b-test.com', timeSpent: '20000' };
      await request.post('/visits').send(testVisitA);
      await request.post('/visits').send(testVisitB);
      const resFull = await request.get('/stats/last24h');
      expect(JSON.parse(resFull)).toBe([testVisitA, testVisitB]);
      done();
    }
    catch (err) {
      console.log('Error retrieving tab info from DB:', err);
    }
  });

});