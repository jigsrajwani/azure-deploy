const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'room',
    // required: true
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'hotel',
    required: true
  },
  addons: [String], // Array of addon names
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Booking = mongoose.model('booking', BookingSchema);
module.exports = Booking;