import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('TabTrackr', 'postgres', 'OrangeFire393.', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
});

export default sequelize