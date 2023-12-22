const mongoose = require('mongoose');

const AddonSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
  });

  const Addon = mongoose.model('addon', AddonSchema);

  module.exports = Addon;
  