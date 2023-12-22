const express = require("express");
const router = express.Router();
const Hotel = require("../models/Hotel");
const { validationResult } = require('express-validator');

// Create a hotel using POST "/api/hotel/createHotel"
router.post('/createHotel', async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array()[0].msg });
  }
  try {
    let hotel = await Hotel.findOne({ email: req.body.email });
    if (hotel) {
      return res.status(400).json({ success, error: "A hotel with this email already exists" });
    }
    hotel = await Hotel.create({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      address: req.body.address,
      contact: req.body.contact
    });
    res.json("Hotel added succesfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// get hotels using GET "/api/hotel/getHotels"
router.get('/getHotels', async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.send(hotels);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// fetch hotels with most bookings
router.get('/popular', async (req, res) => {
  try {
    // Query the database to fetch popular hotels based on the bookingCount in descending order
    const popularHotels = await Hotel.find({ bookingCount: { $gt: 0 } }).sort({ bookingCount: -1 });
    res.json(popularHotels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;