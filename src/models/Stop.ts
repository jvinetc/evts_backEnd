import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db';

export const Stop = sequelize.define('Stop', {
    addresName: { type: DataTypes.STRING, allowNull: false },
    addres: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    notes: { type: DataTypes.STRING },
    buyOrder: { type: DataTypes.STRING },
    sellId: { type: DataTypes.INTEGER, allowNull: false },
    driverId: { type: DataTypes.INTEGER, allowNull: true },
    comunaId: { type: DataTypes.INTEGER, allowNull: false },
    totalStop: { type: DataTypes.INTEGER, allowNull: false },
    rateId: { type: DataTypes.INTEGER, allowNull: true },
    ratesIds: { type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: true },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'to_be_paid' },
    fragile: { type: DataTypes.BOOLEAN, defaultValue: false },
    devolution: { type: DataTypes.BOOLEAN, defaultValue: false },
    exchange: { type: DataTypes.BOOLEAN, defaultValue: false },
    pickupDate:{type: DataTypes.DATEONLY, allowNull:true},
    deliveryDate:{type: DataTypes.DATEONLY, allowNull:true},
    evidence: {type: DataTypes.ARRAY(DataTypes.STRING), allowNull:true},
    lat: { type: DataTypes.DOUBLE },
    lng: { type: DataTypes.DOUBLE },
    createAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updateAt: { type: DataTypes.DATE }
}, {
    tableName: 'stops',
    timestamps: false
});