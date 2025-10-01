import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../db/db';
import { IPlan } from '../interface';

export class Plan extends Model<IPlan> implements IPlan{
    public id!: number;
    public id_router_api!: string;
    public title!: string;
    public starts_day!: number;
    public starts_month!: number;
    public starts_year!: number;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}

Plan.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    id_router_api:{
        type:DataTypes.STRING,
        allowNull:true
    },
    title:{
        type:DataTypes.STRING,
        allowNull:true
    },
    starts_day:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    starts_month:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    starts_year:{
        type:DataTypes.INTEGER,
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
    modelName:'Plan',
    tableName: 'plans',
    timestamps: true
});