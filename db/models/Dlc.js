const mongoose = require('mongoose');

const dlcSchema = new mongoose.Schema({
  name: String,
  description: String,
  gameId: String,
  tags: { type: [String], default: [] },
});

exports.schema = dlcSchema;
exports.model = mongoose.model('Dlc', dlcSchema);
