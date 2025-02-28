import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const TimeTracking = sequelize.define('TimeTracking', {
  site: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timespent: {
    type: DataTypes.NUMBER,
    allowNull: false
  },
  timestamps: true
});

User.sync({ alter: true })
  .then(() => console.log('User model synchronized with the database'))
  .catch((err) => console.log('Error syncing User model:', err));

export default TimeTracking;
