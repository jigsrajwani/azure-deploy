const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true
  },
  // Add the field to store the count of bookings
  bookingCount: {
    type: Number,
    default: 0,
  },
});

const Hotel = mongoose.model('hotel', hotelSchema);
module.exports = Hotel;