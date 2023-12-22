const cron = require('node-cron');
const Booking = require('./models/Bookings');
const Room = require('./models/Room');

const updateRoomAvailabilityTask = () => {
  cron.schedule('0 9 * * *', async () => {
    try {
      const currentDate = new Date(); // Current date and time
      const expiredBookings = await Booking.find({
        checkOutDate: { $lt: currentDate }
      }).populate('room');
      
      for (const booking of expiredBookings) {
        // Remove the booking from the user's bookings
        await Booking.findByIdAndRemove(booking._id);
      }
      
      for (const booking of expiredBookings) {
        booking.room.availability = true;
        await booking.room.save();
      }
      console.log('Room availability updated for expired bookings.');
      // Log the updated room availability
      const updatedRooms = await Room.find();
      for (const room of updatedRooms) {
        console.log(`Room ${room.roomNumber}: Availability - ${room.availability}`);
      }
    } catch (error) {
      console.error('Error updating room availability:', error);
    }
  });
};
module.exports = updateRoomAvailabilityTask;