import express from 'express';
import router from './router.js';
import VisitModel from '../model/model.js'
import supertest from 'supertest';
import { describe } from 'node:test';
import sequelize from 'sequelize';
const dbName = test_db;

describe('Unit tests', () => {

  const app = express();
  app.use(express.json());
  app.use(router);
  const request = supertest(app);

  beforeAll( async () => {
    
  })
})