const mongoose = require('mongoose');

const DlcSchema = require('./Dlc').schema;

const GameSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  description: String,
  tags: { type: [String], default: [] },
  dlcs: [DlcSchema],
});

exports.model = mongoose.model('Game', GameSchema);
