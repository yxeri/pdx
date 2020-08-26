const express = require('express');

const router = new express.Router();

const Game = require('../db/models/Game').model;

router.post('/', async (request, response) => {
  const { name, gameId } = request.body;

  if (typeof name !== 'string') {
    response.status(400).json({ message: 'Name is missing' });

    return;
  }

  if (typeof gameId !== 'string') {
    response.status(400).json({ message: 'Game Id is missing' });

    return;
  }

  try {
    const game = await Game.findOne({ _id: gameId });

    if (!game) {
      response.status(404).json({ message: `Game with Id ${gameId} does not exists` });

      return;
    }

    if (game.dlcs.find(dlc => dlc.name === name)) {
      response.status(403).json({ message: `DLC ${name} already exists` });

      return;
    }

    const updatedGame = await Game
      .findOneAndUpdate(
        { _id: gameId },
        { $push: { dlcs: { ...request.body } } },
        { new: true }
      );

    response.json({
      dlc: updatedGame.dlcs[updatedGame.dlcs.length - 1],
    });
  } catch (error) {
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

  if (name) { or.push({ 'dlcs.name': new RegExp(name, 'i') }); }
  if (tags) { or.push({ 'dlcs.tags': { $in: tags.split(',') } }); }
  if (Object.keys(or).length > 0) { query.$or = or; }

  const games = await Game.find(query);
  const dlcs = games.map(game => game.dlcs).flat();

  if (!name && !tags) {
    response.json({ dlcs });

    return;
  }

  response.json({
    dlcs: dlcs
      .filter((dlc) => {
        return (name && dlc.name.match(new RegExp(name, 'i')))
          || (tags && tags.split(',').some(tag => dlc.tags.includes(tag)));
      }),
  });
});

module.exports = router;
