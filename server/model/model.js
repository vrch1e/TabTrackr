import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

// Define the User model
const TimeTracking = sequelize.define('TimeTracking', {
  site: {
    type: DataTypes.STRING,
    allowNull: false, // This means the 'name' field cannot be empty
  },
  timespent: {
    type: DataTypes.NUMBER,
    allowNull: false
  },
  timestamps: true
});

// Sync the model with the database (creates table if not exists)
User.sync({ alter: true })
  .then(() => console.log('User model synchronized with the database'))
  .catch((err) => console.log('Error syncing User model:', err));

export default TimeTracking;
