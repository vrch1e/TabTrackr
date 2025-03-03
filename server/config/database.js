import { Sequelize } from 'sequelize';
import dotenv from 'dotenv'
dotenv.config()

const sequelize = new Sequelize('TabTrackr', process.env.username, process.env.password, {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
});

export default sequelize