import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config/database.js';

class VisitModel extends Model<InferAttributes<VisitModel>, InferCreationAttributes<VisitModel>> {
  public id!: CreationOptional<number>;
  public site!: string;
  public timeSpent!: number;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
}

VisitModel.init(
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
    timestamps: true,
    tableName: 'visits'
  }
);

VisitModel.sync({ alter: true })
  .then(() => console.log('Synchronized with database.'))
  .catch((err) => console.log('Error syncing Visit model:', err));

export default VisitModel;
