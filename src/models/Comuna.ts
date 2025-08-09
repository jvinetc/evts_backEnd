import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db';
import { IComuna } from '../interface/Comuna';

export const Comuna = sequelize.define('Comuna', {
  name:      { type: DataTypes.STRING, allowNull: false },
  latitude:  { type: DataTypes.FLOAT, allowNull: false },
  longitude: { type: DataTypes.FLOAT, allowNull: false },
  createAt:  { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updateAt:  { type: DataTypes.DATE }
}, {
  tableName: 'comunas',
  timestamps: false
});