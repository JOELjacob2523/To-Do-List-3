const CONFIG = require('../config.json');
const Knex = require('knex');

exports.knex = Knex({
    client: 'mysql2',
    connection: {
        host: CONFIG.DB_SERVER,
        user: CONFIG.DB_USER,
        password: CONFIG.DB_PASS,
        database: CONFIG.DATABASE,
        port: CONFIG.DB_PORT || 1433
        }
    }
);