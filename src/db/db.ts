import { Dialect, Sequelize, Options } from 'sequelize';
import pg from "pg";

// Detectar si es conexión local
const isLocalhost = process.env.DB_HOST === "localhost";

export const sequelize = new Sequelize(process.env.DB_NAME || '', process.env.DB_USER || '', process.env.DB_PASS || '', {
    host: process.env.DB_HOST || '',
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: !isLocalhost ? {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    } : undefined,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    logging: false // o true si quieres ver los queries
});