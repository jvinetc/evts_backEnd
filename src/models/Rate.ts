import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db';

export const Rate = sequelize.define('Rate', {
  nameService: { type: DataTypes.STRING, allowNull: false },
  price:     { type: DataTypes.INTEGER, allowNull: false },
  state:      { type: DataTypes.STRING, allowNull: false, defaultValue: 'activo'  },
  createAt:   { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updateAt:   { type: DataTypes.DATE }
}, {
  tableName: 'rates',
  timestamps: false
});