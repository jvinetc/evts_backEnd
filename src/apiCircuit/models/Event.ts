import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../db/db';
import { IEvent } from '../interface';

export class Event extends Model<IEvent> implements IEvent {
    public id!: number;
    public stop_api_id!: number;
    public action!: string;
    public processed!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Event.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    stop_api_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    action: {
        type: DataTypes.STRING,
        allowNull: true
    },
    processed:{
        type:DataTypes.BOOLEAN,
        allowNull:true,
        defaultValue:false
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
    modelName: 'Event',
    tableName: 'events',
    timestamps: true
});