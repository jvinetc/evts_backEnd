import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../db/db';
import { IDriver } from '../interface';

export class DriverApi extends Model<IDriver> implements IDriver {
    public id!: number;
    public id_router_api!: string;
    public name!: string;
    public email!: string;
    public phone!: string;
    public displayName!: string;
    public active!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

DriverApi.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_router_api: {
        type: DataTypes.STRING,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    displayName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
    },
    createdAt:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue: Date.now()
    },
    updatedAt:{
        type:DataTypes.DATE,
        allowNull:true
    }
}, {    
    sequelize,
    modelName: 'DriverApi',
    tableName: 'drivers_api',
    timestamps: true
});