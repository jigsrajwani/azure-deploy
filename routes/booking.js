const express = require("express");
const router = express.Router();
const getUser = require("../middleware/getUser");
const Booking = require("../models/Bookings");
const Room = require("../models/Room");
const Addon = require("../models/Addon");
const Hotel = require("../models/Hotel");
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// POST Create a new booking with addons = (api/book/createBooking)
router.post('/createBooking', getUser, async (req, res) => {
  const { roomId, checkInDate, checkOutDate, addons, hotelId } = req.body;
  const userId = req.user; // Assuming the user information is stored in req.user

  // Find the room by ID
  const room = await Room.findById(roomId);
  // Find the hotel by ID
  const hotel = await Hotel.findById(hotelId);
  try {
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (!room.availability) {
      return res.status(400).json({ error: 'Room is not available' });
    }

    // Update the room availability to false
    room.availability = false;
    await room.save();

    // Create a new booking document
    const booking = new Booking({
      user: userId, // Set the user ID here
      room: roomId,
      hotel: hotelId,
      checkInDate,
      checkOutDate,
      addons: addons, // Save addon names
    });

    // Save the booking to the database
    await booking.save();

    // Increment the bookingCount for the hotel
    hotel.bookingCount += 1;
    await hotel.save();

    res.json(booking);
  } catch (error) {
    console.error(error);
    // If there was an error, rollback the room availability to true
    if (room) {
      room.availability = true;
      await room.save();
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});



// GET /getallbookings: Retrieve a list of bookings made by the user. (api/book/getallbookings)
router.get("/getallbookings", getUser, async (req, res) => {
  try {
    const userId = req.user; // the user ID is stored in req.user
    console.log("req.user", req.user);
    // Find bookings by user ID
    const bookings = await Booking.find({ user: userId }).populate('hotel').populate('room');
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// GET info of a specific booking  /api/book/bookings/:id
router.get("/bookings/:id", getUser, async (req, res) => {
  try {
    const bookingId = req.params.id;

    // Find the booking by ID
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /bookings/:id: Update the details of a specific booking using booking iD.
router.put('/bookings/:id', getUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { checkInDate, checkOutDate, addons } = req.body;
    // Find the booking by ID and user ID
    const booking = await Booking.findOneAndUpdate(
      { _id: id, user: req.user },
      { checkInDate, checkOutDate, addons },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a booking /api/book/bookings/:id
router.delete('/bookings/:id', getUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the booking by ID and user ID
    const booking = await Booking.findOneAndDelete({ _id: id, user: req.user });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Mark the associated room as available
    const room = await Room.findById(booking.room);
    if (room) {
      room.availability = true;
      await room.save();
    }

    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET Generate and download receipt = api/book/receipt/:id  = booking id
router.get('/receipt/:id', getUser, async (req, res) => {
  try {
    const bookingIds = req.params.id.split(','); // Assuming booking IDs are passed as comma-separated values

    // Retrieve the bookings details from the database
    const bookings = await Booking.find({ _id: { $in: bookingIds } }).populate('user').populate('room').populate('hotel');

    if (bookings.length === 0) {
      return res.status(404).json({ error: 'Bookings not found' });
    }

    // Calculate the total price based on the individual room prices and addon prices for each booking
    let totalPrice = 0;
    const customerName = bookings[0].user.name;
    const formatName = customerName.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    const customerEmail = bookings[0].user.email; // Assuming the customer email is the same for all bookings

    for (const booking of bookings) {
      totalPrice += booking.room.pricing;
    }

    // Create a new PDF document
    const doc = new PDFDocument();

    // Set the response headers for PDF file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="receipt.pdf"');

    // Pipe the PDF document directly to the response stream
    doc.pipe(res);

    // Define the receipt content
    // Add the company logo
    const logoPath = './logo.png';
    doc.image(logoPath, 50, 50, { width: 100 });
    // Add the company name
    doc.font('Helvetica-Bold').fontSize(24).text('Celeb Inn', { align: 'center' });
    doc.moveDown();
    doc.font('Helvetica-Bold').fontSize(20).text('Booking Receipt', { underline: true, align: 'center' });

    // Adjust the position for content
    doc.moveDown(2); // Move down by 2 lines
    doc.fontSize(15).text("Customer Details: ", { align: 'right' });
    doc.fontSize(15).text(`Name: ${formatName}`, { align: 'right' });
    doc.fontSize(15).text(`Email: ${customerEmail}`, { align: 'right' });

    doc.moveDown();

    for (const booking of bookings) {
      doc.fontSize(12).text(`Hotel Name: ${booking.hotel.name}`);
      doc.fontSize(12).text(`Booking ID: ${booking._id}`);
      doc.text(`Room Number: ${booking.room.roomNumber}`);

      const checkOutDate = booking.checkOutDate;
      const checkInDate = booking.checkInDate;
      const options = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        weekday: 'long',
      };
      const formattedDateOUT = checkOutDate.toLocaleDateString('en-US', options);
      const formattedDateIN = checkInDate.toLocaleDateString('en-US', options);
      doc.text(`Check-in: ${formattedDateIN}`);
      doc.text(`Check-out: ${formattedDateOUT}`);
      doc.text(`Price per Room: Rs. ${booking.room.pricing}`);

      doc.fontSize(12).text('Addons:');
      for (const addonName of booking.addons) {
        // Fetch the addon price based on the addon name
        const addon = await Addon.findOne({ name: addonName });
        if (addon) {
          doc.text(`${addon.name}: Rs. ${addon.price}`);
          totalPrice += addon.price; // Add the addon price to the total price
        }
      }

      doc.moveDown(0.5); // Adjust the line height for booking details
    }
    doc.font('Helvetica-Bold').fontSize(14).text(`Total Price: Rs. ${totalPrice}`, { align: 'right' });

    // Finalize the PDF document
    doc.end();
  } catch (error) {
    console.error('Error fetching booking data:', error);
    res.status(500).send('Error generating receipt');
  }
});

module.exports = router;