import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db';

export const User = sequelize.define('User', {
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName:  { type: DataTypes.STRING, allowNull: false },
  email:     { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true }},
  username:  { type: DataTypes.STRING, allowNull: false, unique: true },
  age:       { type: DataTypes.INTEGER, allowNull: false },
  state:     { type: DataTypes.STRING, allowNull: false },
  phone_mobile: { type: DataTypes.STRING, allowNull: false },
  phone_contact: { type: DataTypes.STRING }, // puede ser null
  password:  { type: DataTypes.STRING, allowNull: false },
  photo:     { type: DataTypes.STRING },
  verification_token: { type: DataTypes.STRING },
  createAt:  { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updateAt:  { type: DataTypes.DATE }
}, {
  tableName: 'users',
  timestamps: false
});