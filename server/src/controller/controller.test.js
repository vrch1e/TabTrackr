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
    .then( () => VisitModel.findOne({where: {site: 'test.com'}, raw: true}))
    .then( visit => {
      expect(visit.site).toBe('test.com');
      expect(visit.timeSpent).toBe(10000);
      done();
    })
    .catch(err => console.log('Error sending tab info to DB:', err));
  }));

  it('should receive a Visit[] from the database', () => new Promise( done => {
    request.get('/stats/last24h')
    .then( result => expect(JSON.parse(result)).toBe([]))
    .catch(err => console.log('Error sending tab info to DB:', err));
    const testVisitA = { site: 'a-test.com', timeSpent: '10000' };
    const testVisitB = { site: 'b-test.com', timeSpent: '20000' };
    request.post('/visits').send(testVisitA)
    .then( () => request.post('/visits').send(testVisitB))
    .then( () => request.get('/stats/last24h'))
    .then( visit => {
      expect(visit.site).toBe('test.com');
      expect(visit.timeSpent).toBe(10000);
      done();
    })
    .catch(err => console.log('Error sending tab info to DB:', err));
  }));

});