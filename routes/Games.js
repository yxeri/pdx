const express = require('express');

const router = new express.Router();

const Game = require('../db/models/Game').model;

router.post('/', async (request, response) => {
  const { name } = request.body;

  if (typeof name !== 'string') {
    response.status(400).json({ message: 'Name is missing' });

    return;
  }

  try {
    await Game.create({ ...request.body });

    response.json({ game: await Game.findOne({ name }) });
  } catch (error) {
    // code 11000 is a duplicate key error in mongo
    if (error.code && error.code === 11000) {
      response.status(403).json({ message: `${name} already exists` });

      return;
    }

    response.status(500).json({ message: 'Something went wrong' });
  }
});

router.get('/', async (request, response) => {
  const {
    name,
    tags,
  } = request.query;
  const query = {};
  const or = [];

  if (name) { or.push({ name: new RegExp(name, 'i') }); }
  if (tags) { or.push({ tags: { $in: tags.split(',') } }); }
  if (Object.keys(or).length > 0) { query.$or = or; }

  response.json({ games: await Game.find(query) });
});

module.exports = router;
