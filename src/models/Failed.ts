import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db';

export const Failed = sequelize.define('Failed', {
    sellId: { type: DataTypes.INTEGER, allowNull: true },
    driverId: { type: DataTypes.INTEGER, allowNull: true },
    stopId: { type: DataTypes.INTEGER, allowNull: true },
    addressName: { type: DataTypes.STRING, allowNull: true },
    addressStop: { type: DataTypes.STRING, allowNull: true },
    comunaId: { type: DataTypes.INTEGER, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    notes: { type: DataTypes.STRING, allowNull: true },
    action: { type: DataTypes.STRING, allowNull: true },
    failedDate: { type: DataTypes.DATEONLY, allowNull: true },
    createAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updateAt: { type: DataTypes.DATE },
    evidence: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
}, {
    tableName: 'faileds',
    timestamps: false
});