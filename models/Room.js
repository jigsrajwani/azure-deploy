const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hotel'
    },
    roomNumber: {
        type: String,
        required: true
    },
    roomType: {
        type: String,
        required: true,
    },
    description: String,
    pricing: {
        type: Number,
        required: true,
    },
    availability: {
        type: Boolean,
        default: true,
    }
});

const Room = mongoose.model('room', roomSchema);
module.exports = Room;