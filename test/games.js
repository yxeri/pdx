const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiJsonSchema = require('chai-json-schema');

const app = require('../app');
const gameSchema = require('./schemas/Game');
const games = require('./data/games');

chai.should();
chai.use(chaiHttp);
chai.use(chaiJsonSchema);

describe('Create game', () => {
  it('Should create a new game', (done) => {
    chai
      .request(app)
      .post('/api/v1/games')
      .send(games.first)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body['game'].should.be.jsonSchema(gameSchema);

        done();
      });
  });

  it('Should create a second new game', (done) => {
    chai
      .request(app)
      .post('/api/v1/games')
      .send(games.second)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body['game'].should.be.jsonSchema(gameSchema);

        done();
      });
  });

  it('Should NOT create a game with an existing name', (done) => {
    chai
      .request(app)
      .post('/api/v1/games')
      .send(games.first)
      .end((error, response) => {
        response.should.have.status(403);
        response.should.be.json;
        response.body.message.should.exist;

        done();
      });
  });
});

describe('Get game', () => {
  it('Should get all games', (done) => {
    chai
      .request(app)
      .get('/api/v1/games')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.games.forEach((game) => { game.should.be.jsonSchema(gameSchema); });

        done();
      });
  });

  it('Should get game #1', (done) => {
    chai
      .request(app)
      .get(`/api/v1/games?name=${games.first.name}`)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.games.should.be.length(1);
        response.body.games[0].should.be.jsonSchema(gameSchema);
        response.body.games[0].name.should.equal(games.first.name);

        done();
      });
  });

  it('Should get games by tag', (done) => {
    chai
      .request(app)
      .get(`/api/v1/games?tags=${games.first.tags[0]}`)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.games.should.be.length(2);
        response.body.games[0].should.be.jsonSchema(gameSchema);
        response.body.games.forEach((game) => { game.should.be.jsonSchema(gameSchema); });

        done();
      });
  });

  it('Should get games by partial name', (done) => {
    chai
      .request(app)
      .get(`/api/v1/games?name=${games.first.name.charAt(0)}`)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.games.should.be.length(2);
        response.body.games.forEach((game) => { game.should.be.jsonSchema(gameSchema); });

        done();
      });
  });

  it('Should get game by partial name and tag', (done) => {
    chai
      .request(app)
      .get(`/api/v1/games?tags=${games.first.tags[0]}&name=${games.first.name.slice(0, 2)}`)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.games.should.be.length(2);
        response.body.games[0].should.be.jsonSchema(gameSchema);

        done();
      });
  });
});
