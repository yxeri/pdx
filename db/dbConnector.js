const mongoose = require('mongoose');

const config = require('../config/config');

exports.connect = (callback) => {
  mongoose.connect(`mongodb://${config.dbHost}:${config.dbPort}/${config.dbName}`, (error) => {
    if (error) {
      throw error;
    }

    console.info('Connection established to database');

    callback();
  });
};
