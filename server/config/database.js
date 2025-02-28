import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('too lazy to add a .env file right now, but pretend this is username password etc', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
});

export default sequelize