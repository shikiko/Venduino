const knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: "./db/VendingDB.db"
    }
});

module.exports = knex;
