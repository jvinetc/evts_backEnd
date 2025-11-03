import { sequelize } from "../db/db";
import { Driver } from "./Driver";
import { Comuna } from "./Comuna";
import { Rate } from "./Rate";
import { Role } from "./Role";
import { Sell } from "./Sell";
import { Stop } from "./Stop";
import { User } from "./User";
import { Images } from "./Images";
import { Payment } from "./Payment";
import { Notification } from "./Notification";
import { PickUp } from "./PickUp";
import { Failed } from "./Failed";

// User ↔ Role
Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

// Sell ↔ User & Comuna
User.hasMany(Sell, { foreignKey: 'userId' });
Sell.belongsTo(User, { foreignKey: 'userId' });
Comuna.hasMany(Sell, { foreignKey: 'comunaId' });
Sell.belongsTo(Comuna, { foreignKey: 'comunaId' });

// Driver ↔ User
User.hasOne(Driver, { foreignKey: 'userId' });
Driver.belongsTo(User, { foreignKey: 'userId' });

// Driver ↔ Comuna (N:M)
Driver.belongsToMany(Comuna, { through: 'DriverComunas', foreignKey: 'driverId' });
Comuna.belongsToMany(Driver, { through: 'DriverComunas', foreignKey: 'comunaId' });

//Images ↔ User
User.hasMany(Images, { foreignKey: 'userId' });
Images.belongsTo(User, { foreignKey: 'userId' });

//Payment ↔ Sell
Sell.hasMany(Payment, { foreignKey: 'sellId' });
Payment.belongsTo(Sell, { foreignKey: 'sellId' });

//Images ↔ Stop
Stop.hasMany(Images, { foreignKey: 'stopId' });
Images.belongsTo(Stop, { foreignKey: 'stopId' });

// Stop ↔ Sell, User, Comuna, Driver (relaciones directas)
Sell.hasMany(Stop, { foreignKey: 'sellId' });
Stop.belongsTo(Sell, { foreignKey: 'sellId' });

Driver.hasMany(Stop, { foreignKey: { name: 'driverId', allowNull: true } });
Stop.belongsTo(Driver, { foreignKey: { name: 'driverId', allowNull: true } });

Comuna.hasMany(Stop, { foreignKey: 'comunaId' });
Stop.belongsTo(Comuna, { foreignKey: 'comunaId' });

Rate.hasMany(Stop, { foreignKey: 'rateId' });
Stop.belongsTo(Rate, { foreignKey: 'rateId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

PickUp.belongsTo(Sell, { foreignKey: 'sellId' });
PickUp.belongsTo(Driver, { foreignKey: 'driverId' });
PickUp.belongsTo(Stop, { foreignKey: 'stopId' });
Sell.hasMany(PickUp, { foreignKey: 'sellId' });
Driver.hasMany(PickUp, { foreignKey: 'driverId' });
Stop.hasMany(PickUp, { foreignKey: 'stopId' });

// Failed ↔ Sell, Driver, Stop
Failed.belongsTo(Sell, { foreignKey: 'sellId' });
Failed.belongsTo(Driver, { foreignKey: 'driverId' });
Failed.belongsTo(Stop, { foreignKey: 'stopId' });
Failed.belongsTo(Comuna, { foreignKey: 'comunaId' });

Sell.hasMany(Failed, { foreignKey: 'sellId' });
Driver.hasMany(Failed, { foreignKey: 'driverId' });
Stop.hasMany(Failed, { foreignKey: 'stopId' });
Comuna.hasMany(Failed, { foreignKey: 'comunaId' });

// 👇 agregar las tablas

export { sequelize, User, Role, Comuna, Sell, Driver, Stop, Rate, Images, Payment, PickUp, Notification, Failed };