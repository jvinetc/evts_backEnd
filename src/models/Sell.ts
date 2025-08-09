import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db';

export const Sell = sequelize.define('Sell', {
  name: { type: DataTypes.STRING, allowNull: false },
  addres: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  addresPickup: { type: DataTypes.STRING, allowNull: false },
  comunaId: { type: DataTypes.INTEGER, allowNull: false },
  state: { type: DataTypes.STRING, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  lat: { type: DataTypes.DOUBLE },
  lng: { type: DataTypes.DOUBLE },
  createAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updateAt: { type: DataTypes.DATE }
}, {
  tableName: 'sells',
  timestamps: false
});