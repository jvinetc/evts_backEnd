import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db';

export const Images = sequelize.define('Images', {
    name: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.INTEGER },
    stopId: { type: DataTypes.INTEGER },
    createAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updateAt: { type: DataTypes.DATE }
}, {
    tableName: 'images',
    timestamps: false
});