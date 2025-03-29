import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const DB_NAME = process.env.VITE_ENV === 'test'
  ? process.env.DB_TEST
  : process.env.DB_REAL;

const sequelize = new Sequelize(DB_NAME || 'TabTrackr', process.env.DB_USERNAME || 'user', process.env.DB_PASSWORD || '1234', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});


export default sequelize;
