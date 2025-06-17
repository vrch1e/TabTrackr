import { Sequelize } from 'sequelize';
import dotenv from 'dotenv'
dotenv.config()

const sequelize = new Sequelize('tabtrackr_db', process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: 'tabtrackr-db.clyo0saqymvf.eu-west-2.rds.amazonaws.com',
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true, // because pg_hma.conf 
            rejectUnauthorized: false,
        },
    },
});

export default sequelize