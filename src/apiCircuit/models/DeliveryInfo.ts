import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../db/db';
import { IDeliveryInfo } from '../interface';

export class DeliveryInfo extends Model<IDeliveryInfo> implements IDeliveryInfo {
    public id!: number;
    public state!: string;
    public attempted!: boolean;
    public photoUrls!: string[];
    public succeeded!: boolean;
    public stopId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

DeliveryInfo.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true
    },
    attempted: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    photoUrls: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
    },
    succeeded: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    stopId:{
        type: DataTypes.INTEGER,
        allowNull:true
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
    modelName: 'DeliveryInfo',
    tableName: 'delivery_info',
    timestamps: true
});