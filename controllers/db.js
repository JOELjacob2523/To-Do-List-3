const CONFIG = require('../config.json');
const Knex = require('knex');



module.exports = {
    knex: Knex({
        client: 'mssql',
        connection: {
            server: CONFIG.DB_SERVER,
            user: CONFIG.DB_USER,
            password: CONFIG.DB_PASS,
            database: CONFIG.DATABASE,
            options: {
                port: CONFIG.DB_PORT || 1433
            }
        }
    })
}