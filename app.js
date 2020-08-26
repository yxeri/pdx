const express = require('express');
const bodyParser = require('body-parser');

const dbConnector = require('./db/dbConnector');
const gamesRoute = require('./routes/Games');
const dlcRoute = require('./routes/Dlcs');

const app = express();

app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  next();
});

app.use(bodyParser.json());

app.use('/api/v1/games', gamesRoute);
app.use('/api/v1/dlcs', dlcRoute);

if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'test') {
  dbConnector.connect(async () => {
    await app.listen(8080);

    console.log('App running');
  });
}

module.exports = app;
