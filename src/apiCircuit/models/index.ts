import { sequelize } from '../../db/db';
import { AddressStop } from "./AddressStop";
import { Plan } from "./Plan";
import { DeliveryInfo } from "./DeliveryInfo";
import { Depot } from "./Depot";
import { DriverApi } from "./DriverApi";
import { StopApi } from "./StopApi";
import { Event } from "./Event";

StopApi.hasOne(AddressStop, { foreignKey: 'stopApiId' });
AddressStop.belongsTo(StopApi, { foreignKey: 'stopApiId' });

export {sequelize, AddressStop, Plan, DeliveryInfo, Depot, DriverApi, StopApi, Event };