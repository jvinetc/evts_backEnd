import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../db/db';
import { IAddressStop } from '../interface';

export class  AddressStop extends Model<IAddressStop> implements IAddressStop{
    public id!: number;
    public addressName!: string; //display de direccion
    public addressLineOne!: string; //direccion
    public addressLineTwo!: string; //comuna
    public city!: string;
    public state!: string;
    public zip!: string;
    public country!: string;
    public latitude!: number;
    public longitude!: number;
    public externalId!: string;
    public email!: string;
    public phone!: string;
    public name!: string;
    public stopApiId!: number;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}

AddressStop.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    addressName:{
        type:DataTypes.STRING,
        allowNull:true
    },
    addressLineOne:{
        type:DataTypes.STRING,
        allowNull:true
    },
    addressLineTwo:{
        type:DataTypes.STRING,
        allowNull:true
    },
    city:{
        type:DataTypes.STRING,
        allowNull:true
    },
    state:{
        type:DataTypes.STRING,
        allowNull:true
    },
    zip:{
        type:DataTypes.STRING,
        allowNull:true
    },
    country:{
        type:DataTypes.STRING,
        allowNull:true
    },
    latitude:{
        type:DataTypes.FLOAT,
        allowNull:true
    },
    longitude:{
        type:DataTypes.FLOAT,
        allowNull:true
    },
    externalId:{
        type:DataTypes.STRING,
        allowNull:true
    },
    email:{
        type:DataTypes.STRING,
        allowNull:true
    },
    phone:{
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
    },
    stopApiId:{
        type:DataTypes.INTEGER,
        allowNull:true
    }
}, {
    sequelize,
    modelName:'AddressStop',
    tableName: 'address_stops',
    timestamps: true
});