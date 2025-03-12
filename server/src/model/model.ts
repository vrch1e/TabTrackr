import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config/database.js';

class VisitModel extends Model<InferAttributes<VisitModel>, InferCreationAttributes<VisitModel>> {
  declare id: CreationOptional<number>;
  declare site: string;
  declare timeSpent: number;
  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;
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
