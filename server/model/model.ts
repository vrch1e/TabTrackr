import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { Visit } from '../../types.js';

/* interface TimeTracking extends Model<InferAttributes<TimeTracking>, InferCreationAttributes<TimeTracking>> {
  id: CreationOptional<number>;
  site: string;
  timeSpent: number
}

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
  timeSpent: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, { timestamps: true }); */


class TimeTracking extends Model<Visit> implements Visit {
  public site!: string;
  public timeSpent!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TimeTracking.init(
  {
    site: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timeSpent: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'TimeTracking'
  }
);

TimeTracking.sync({ alter: true })
  .then(() => console.log('TimeTracking model synchronized with the database'))
  .catch((err) => console.log('Error syncing TimeTracking model:', err));

export default TimeTracking;
