import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db';

export const User = sequelize.define('User', {
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  age: { type: DataTypes.INTEGER, allowNull: false },
  roleId: { type: DataTypes.INTEGER, allowNull: false },
  state: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  phone_contact: { type: DataTypes.STRING }, // puede ser null
  password: { type: DataTypes.STRING, allowNull: false },
  verification_token: { type: DataTypes.STRING },
  expoPushToken: { type: DataTypes.STRING },
  birthDate: { type: DataTypes.DATE },
  createAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updateAt: { type: DataTypes.DATE }
}, {
  tableName: 'users',
  timestamps: false
});