import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db';

export const Driver = sequelize.define('Driver', {
    patente: { type: DataTypes.STRING, allowNull: false },
    permisoCirculacion: { type: DataTypes.STRING },
    vencimientoPermisoCirculacion: { type: DataTypes.DATEONLY },
    revicionTecnica: { type: DataTypes.STRING },
    vencimientoRevicionTecnica: { type: DataTypes.DATEONLY },
    liceciaConducir: { type: DataTypes.STRING },
    urlPermisoCirculacion: { type: DataTypes.STRING },
    urlRevicionTecnica: { type: DataTypes.STRING },
    urlLiceciaConducir: { type: DataTypes.STRING },
    vencimientoLiceciaConducir: { type: DataTypes.DATEONLY },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    createAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updateAt: { type: DataTypes.DATE }
}, {
    tableName: 'drivers',
    timestamps: false
});