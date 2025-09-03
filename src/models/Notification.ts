import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db';

export const Notification = sequelize.define('Notification', {
    title: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.STRING }, // URL pública en Cloudinary
    userId: { type: DataTypes.INTEGER },
    sellId:{ type: DataTypes.INTEGER },
    type: { type: DataTypes.STRING },
    orderBuy: { type: DataTypes.STRING },
    createAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    read: { type: DataTypes.BOOLEAN, defaultValue:false }
}, {
    tableName: 'notifications',
    timestamps: false
});