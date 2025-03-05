import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TimeTracking = sequelize.define('TimeTracking', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  site: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timespent: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, { timestamps: true });

TimeTracking.sync({ alter: true })
  .then(() => console.log('TimeTracking model synchronized with the database'))
  .catch((err) => console.log('Error syncing TimeTracking model:', err));

const Watchlist = sequelize.define('Watchlist', {
  site: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  timeLimit: {
    type: DataTypes.INTEGER, // Time limit in milliseconds
    allowNull: false
  }
});

export {TimeTracking, Watchlist};

