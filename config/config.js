const config = {};

config.dbHost = process.env.DB_HOST || '127.0.0.1';
config.dbPort = process.env.DB_PORT || 27017;
config.dbTestName = process.env.DB_TEST_NAME || 'pdx-test';
config.dbName = process.env.DB_NAME || 'pdx';

module.exports = config;
