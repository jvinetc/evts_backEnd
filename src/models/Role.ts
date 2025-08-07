import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db';

export const Role = sequelize.define('Role', {
  name:        { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  createAt:    { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updateAt:    { type: DataTypes.DATE }
}, {
  tableName: 'roles',
  timestamps: false
});