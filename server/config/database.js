import { Sequelize } from 'sequelize';
import dotenv from 'dotenv'
dotenv.config()

const sequelize = new Sequelize('TabTrackr', 'postgres', 'OrangeFire393.', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
});

export default sequelize