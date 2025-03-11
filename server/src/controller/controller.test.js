import express from 'express';
import router from './router.js';
import sequelize from 'sequelize';
import supertest from 'supertest';
import { describe } from 'node:test';

describe('Unit tests', () => {

  const app = express();
  app.use(express.json());
  app.use(router);
  const request = supertest(app);

  beforeAll(async () => {
    await sequelize.authenticate();
  })
});