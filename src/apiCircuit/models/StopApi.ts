import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../db/db';
import { IStopApi } from '../interface';

export class StopApi extends Model<IStopApi> implements IStopApi {
    public id!: number;
    public id_router_api!: string;
    public plan!: string;
    public planId!: number;
    public routeId!: number;
    public addressStopId!: number;
    public barcode!: string;
    public driverIdentifier!: string;
    public notes?: string;
    public orderInfiId!: number;
    public packageCount!: number;
    public type!: string;
    public activity!: "delivery" | "pickup" | undefined;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

StopApi.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_router_api: {
        type: DataTypes.STRING,
        allowNull: true
    },
    plan: {
        type: DataTypes.STRING,
        allowNull: true
    },
    planId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    routeId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    addressStopId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    barcode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    driverIdentifier: {
        type: DataTypes.STRING,
        allowNull: true
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true
    },
    orderInfiId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    packageCount: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:'stop'
    },
    activity: {
        type: DataTypes.STRING,
        allowNull: true
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
    modelName: 'StopApi',
    tableName: 'stops_api',
    timestamps: true
});