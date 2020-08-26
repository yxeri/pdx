const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiJsonSchema = require('chai-json-schema');

const app = require('../app');
const dlcSchema = require('./schemas/Dlc');
const gameSchema = require('./schemas/Game');
const dlcs = require('./data/dlcs');
const games = require('./data/games');

chai.should();
chai.use(chaiHttp);
chai.use(chaiJsonSchema);

describe('Create dlc', () => {
  let gameId;

  before('Should create a game', (done) => {
    chai
      .request(app)
      .post('/api/v1/games')
      .send(games.dlc)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body['game'].should.be.jsonSchema(gameSchema);
        gameId = response.body['game']._id;

        done();
      });
  });

  it('Should create a new dlc', (done) => {
    dlcs.first.gameId = gameId;

    chai
      .request(app)
      .post('/api/v1/dlcs')
      .send(dlcs.first)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body['dlc'].should.be.jsonSchema(dlcSchema);

        done();
      });
  });

  it('Should create a second new dlc', (done) => {
    dlcs.second.gameId = gameId;

    chai
      .request(app)
      .post('/api/v1/dlcs')
      .send(dlcs.second)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body['dlc'].should.be.jsonSchema(dlcSchema);

        done();
      });
  });

  it('Should NOT create a dlc with an existing name', (done) => {
    chai
      .request(app)
      .post('/api/v1/dlcs')
      .send(dlcs.first)
      .end((error, response) => {
        response.should.have.status(403);
        response.should.be.json;
        response.body.message.should.exist;

        done();
      });
  });
});

describe('Get DLC', () => {
  it('Should get all DLCs', (done) => {
    chai
      .request(app)
      .get('/api/v1/dlcs')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.dlcs.forEach((dlc) => { dlc.should.be.jsonSchema(dlcSchema); });

        done();
      });
  });

  it('Should get DLC #1', (done) => {
    chai
      .request(app)
      .get(`/api/v1/dlcs?name=${dlcs.first.name}`)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.dlcs.should.be.length(1);
        response.body.dlcs[0].should.be.jsonSchema(dlcSchema);
        response.body.dlcs[0].name.should.equal(games.first.name);

        done();
      });
  });

  it('Should get DLCs by tag', (done) => {
    chai
      .request(app)
      .get(`/api/v1/dlcs?tags=${dlcs.first.tags[0]}`)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.dlcs.should.be.length(2);
        response.body.dlcs[0].should.be.jsonSchema(dlcSchema);
        response.body.dlcs.forEach((dlc) => { dlc.should.be.jsonSchema(dlcSchema); });

        done();
      });
  });

  it('Should get DLCs by partial name', (done) => {
    chai
      .request(app)
      .get(`/api/v1/dlcs?name=${dlcs.first.name.charAt(0)}`)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.dlcs.should.be.length(2);
        response.body.dlcs.forEach((dlc) => { dlc.should.be.jsonSchema(dlcSchema); });

        done();
      });
  });

  it('Should get dlc by partial name and tag', (done) => {
    chai
      .request(app)
      .get(`/api/v1/dlcs?tags=${dlcs.first.tags[0]}&name=${dlcs.first.name.slice(0, 2)}`)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.dlcs.should.be.length(2);
        response.body.dlcs[0].should.be.jsonSchema(dlcSchema);

        done();
      });
  });
});
