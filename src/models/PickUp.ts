import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db';

export const PickUp = sequelize.define('PickUp', {
    sellId: { type: DataTypes.INTEGER, allowNull: true },
    driverId: { type: DataTypes.INTEGER, allowNull: true },
    stopId: { type: DataTypes.INTEGER, allowNull: true },
    createAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updateAt: { type: DataTypes.DATE }
}, {
    tableName: 'pickups',
    timestamps: false
});