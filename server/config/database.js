import { Sequelize } from 'sequelize';
import dotenv from 'dotenv'
dotenv.config()

console.log(process.env.DB_PASSWORD, process.env.DB_USERNAME)

const sequelize = new Sequelize('TabTrackr', process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
});

export default sequelize