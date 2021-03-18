const knex = require('knex');
const knexfile = require('./knexfile'); // knexfile is the db configuration file !!!

// For PROD environment, we need to use `env vars` to config instead of directly calling knexfile.prod ...
const db = knex(knexfile.development);

module.exports = db;
