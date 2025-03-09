// todo: permanently remove if the other one works

/* import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { Visit } from '../../types.js';

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

export default TimeTracking; */

// --------

import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config/database.js';

class Visit extends Model<InferAttributes<Visit>, InferCreationAttributes<Visit>> {
  public id!: CreationOptional<number>;
  public site!: string;
  public timeSpent!: number;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
}

Visit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
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
    timestamps: true
  }
);

Visit.sync({ alter: true })
  .then(() => console.log('Visit model synchronized with the database'))
  .catch((err) => console.log('Error syncing Visit model:', err));

export default Visit;
