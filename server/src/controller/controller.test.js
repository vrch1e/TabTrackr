import express from 'express';
import router from './router.js';
import sequelize from 'sequelize';
import supertest from 'supertest';
import { describe } from 'node:test';

const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('test_db', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  logging, false
})

describe('Unit tests', () => {

  const app = express();
  app.use(express.json());
  app.use(router);
  const request = supertest(app);

  beforeAll( async () => {
    await sequelize.authenticate();
    
  })
})