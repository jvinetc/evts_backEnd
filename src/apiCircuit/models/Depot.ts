import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../db/db';
import { IDepot } from '../interface';

export class Depot extends Model<IDepot> implements IDepot{
    public id!: number;
    public id_router_api!: string;
    public name!: string;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}

Depot.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    id_router_api:{
        type:DataTypes.STRING,
        allowNull:true
    },
    name:{
        type:DataTypes.STRING,
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
    modelName:'Depot',
    tableName: 'depots',
    timestamps: true
});