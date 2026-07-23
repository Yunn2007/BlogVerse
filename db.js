const { Pool } = require("pg");

const pool = new Pool({
    user: "yunuskhan",
    host: "localhost",
    database: "cms_db",
    password: "12345678",
    port: 5432
});

module.exports = pool;