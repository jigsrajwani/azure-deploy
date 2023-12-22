const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const { validationResult } = require('express-validator');

// Create a room with hotel id using POST "/api/room/createRoom/:hotelId"
router.post('/createRoom/:hotelId', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()[0].msg });
  }

  try {
    const hotelId = req.params.hotelId; // Access the hotelId from req.params
    // console.log(hotelId);
    const { roomNumber, roomType, description, pricing, availability } = req.body;

    let room = await Room.findOne({ roomNumber, hotel: hotelId }); // Check for roomNumber and hotelId combination
    if (room) {
      return res.status(400).json({ error: 'A room with this number already exists in this hotel' });
    }

    room = await Room.create({
      hotel: hotelId,
      roomNumber,
      roomType,
      description,
      pricing,
      availability
    });

    res.json({ message: 'Room added successfully', room });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});


// get all rooms based on hotel id either available or not
router.get('/getRooms/:hotelId', async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    // Logic to fetch available rooms from the database based on hotelId
    const rooms = await Room.find({ hotel: hotelId }).populate('hotel');
    res.json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available rooms using GET "/api/room/getAllRooms"
router.get('/getAllRooms', async (req, res) => {
  try {
    // Logic to fetch available rooms from the database
    const rooms = await Room.find({ availability: true }).populate('hotel');
    res.json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Detailed Information about a Specific Room:
router.get('/rooms/:id', async (req, res) => {
  try {
    const roomId = req.params.id;
    // Logic to fetch the specific room by its ID
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /search: Search for available rooms based on specific criteria like price range.
router.get('/search', async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;
    // console.log(req.query);

    // Construct the query criteria for room search
    const searchCriteria = {
      availability: true,
    };
    // console.log(searchCriteria);

    // if (minPrice) {
    //   searchCriteria.pricing = { $gte: parseInt(minPrice) };
    // }

    if (maxPrice) {
      if (!searchCriteria.pricing) {
        searchCriteria.pricing = {};
      }
      searchCriteria.pricing.$lte = parseInt(maxPrice);
    }

    // Find available rooms based on search criteria
    const rooms = await Room.find(searchCriteria);

    res.json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;