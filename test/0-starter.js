const chai = require('chai');
const mongoose = require('mongoose');

const config = require('../config/config');

chai.should();

before('Connect to database', function connectDb(done) {
  mongoose.connect(`mongodb://${config.dbHost}:${config.dbPort}/${config.dbTestName}`, (error) => {
    if (error) {
      throw error;
    }

    console.info('Connection established to test database');

    done();
  });
});

after('Clear database', function clearDatabase(done) {
  mongoose.connection.dropDatabase((error) => {
    if (error) {
      throw error;
    }

    console.log('Test database has been dropped');

    done();
  });
});
