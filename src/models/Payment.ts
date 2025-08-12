import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db';
import { VerifyResponse } from '../interface/ApiTransbnak';

export const Payment = sequelize.define('Payment', {
    sellId: { type: DataTypes.INTEGER, allowNull: false },
    vci: { type: DataTypes.STRING },
    amount: { type: DataTypes.DOUBLE },
    status: { type: DataTypes.STRING },
    buy_order: { type: DataTypes.STRING, allowNull: false },
    session_id: { type: DataTypes.STRING, allowNull: false },
    card_detail: { type: DataTypes.STRING, allowNull: false },
    authorization_code: { type: DataTypes.STRING, allowNull: false },
    createAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updateAt: { type: DataTypes.DATE }
}, {
    tableName: 'payments',
    timestamps: false
});