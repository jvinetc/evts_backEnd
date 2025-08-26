import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db';

export const Images = sequelize.define('Images', {
    name: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING }, // URL pública en Cloudinary
    userId: { type: DataTypes.INTEGER },
    stopId: { type: DataTypes.INTEGER },
    createAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updateAt: { type: DataTypes.DATE }
}, {
    tableName: 'images',
    timestamps: false
});