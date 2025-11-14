import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db';

export const Rate = sequelize.define('Rate', {
  nameService: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  state: { type: DataTypes.STRING, allowNull: false, defaultValue: 'activo' },
  createAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  type: { type: DataTypes.STRING, allowNull: true },
  isBase:{ type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  updateAt: { type: DataTypes.DATE }
}, {
  tableName: 'rates',
  timestamps: false
});