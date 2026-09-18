const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Ej: 'event_seq', 'cycle_seq'
  seq: { type: Number, default: 0 },
});

module.exports = mongoose.model('Counter', counterSchema);