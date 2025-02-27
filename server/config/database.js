import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('TabTrackr', 'postgres', 'OrangeFire393.', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false, // Set to true if you want SQL queries to be logged in the console
});

export default sequelize