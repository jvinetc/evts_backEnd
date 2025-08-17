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

// 👇 Puedes agregar la tabla Rate luego si la migras

export { sequelize, User, Role, Comuna, Sell, Driver, Stop, Rate, Images, Payment };