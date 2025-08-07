import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db';

export const Driver = sequelize.define('Driver', {
    patente: { type: DataTypes.STRING, allowNull: false },
    permisoCirculacion: { type: DataTypes.STRING },
    revicionTecnica: { type: DataTypes.STRING },
    liceciaConducir: { type: DataTypes.STRING },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    createAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updateAt: { type: DataTypes.DATE }
}, {
    tableName: 'drivers',
    timestamps: false
});