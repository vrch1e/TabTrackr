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
