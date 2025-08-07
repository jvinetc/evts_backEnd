import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db';

export const Stop = sequelize.define('Stop', {
    addresName: { type: DataTypes.STRING, allowNull: false },
    addres: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    notes: { type: DataTypes.STRING },
    sellId: { type: DataTypes.INTEGER, allowNull: false },
    driverId: { type: DataTypes.INTEGER, allowNull:true},
    comunaId: { type: DataTypes.INTEGER, allowNull: false },
    rateId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pickUp' },
    createAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updateAt: { type: DataTypes.DATE }
}, {
    tableName: 'stops',
    timestamps: false
});