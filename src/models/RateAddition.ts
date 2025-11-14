import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db';

export const RateAddition = sequelize.define('RateAddition', {
    price: { type: DataTypes.INTEGER, allowNull: false },
    rateId: {
        type: DataTypes.INTEGER
    },
    comunaId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    createAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updateAt: { type: DataTypes.DATE }
}, {
    tableName: 'rate_additions',
    timestamps: false
});