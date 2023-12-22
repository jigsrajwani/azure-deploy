import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import Booking from './Booking';

export function AvailableRooms(props) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_ADDRESS + "/api/room/getAllRooms");
      const data = await response.json();
      console.log(data);
      setRooms(data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const handleBookClick = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
    // console.log("Modal should be displayed now.");
  };

  const handleConfirmBooking = async (bookingDetails) => {
    console.log('Booking Details:', bookingDetails);
    setShowModal(false);
    fetchRooms();
  };

  return (
    <div>
      <h1 className="text-center text-warning mt-3">All Available Rooms</h1>
      <div className="container mt-5">
        {rooms.map((room) => (
          <div key={room._id} className="row justify-content-start">
            <div className="col-lg-3" style={{ boxShadow: "1px 1px 5px #ffc107" }}>
              <img src="https://imgcld.yatra.com/ytimages/image/upload/t_seo_Hotel_w_930_h_550_c_fill_g_auto_q_40_f_jpg/v1390494345/Domestic%20Hotels/Hotels_Mysore/Hotel%20The%20President/Facade~904.jpg" alt="" className="img-fluid" />
            </div>
            <div className="col-lg-5">
              <h3>{room.roomType.toUpperCase()} ROOM</h3>
              <h5>Hotel Name: {room.hotel.name}</h5>
              <h6>{room.description}</h6>
              <h6>Room Number: {room.roomNumber}</h6>
              <h6>Location: {room.hotel.address}</h6>
              <h6>Availability: {room.availability.toString()}</h6>
              <h6>Price: Rs. {room.pricing}/Night</h6>
            </div>
            <div className="col-lg-3 justify-content-center align-items-center d-flex mb-5">
              <button
                onClick={() => handleBookClick(room)}
                className={`btn btn-warning ${!room.availability && 'disabled'}`}
              >
                Book
              </button>
            </div>
            <hr className='mt-2' />
          </div>
        ))}
      </div>

      {/* Render the booking form if showModal is true */}
      {showModal && selectedRoom && (
        <Booking
          hotelId={selectedRoom.hotel._id}
          hotelName={selectedRoom.hotel.name}
          roomNumber={selectedRoom.roomNumber}
          roomPrice={selectedRoom.pricing || 0} // Use a default value (0) if pricing is undefined
          roomId={selectedRoom._id}
          onConfirmBooking={handleConfirmBooking}
          showModal={showModal}
          setShowModal={setShowModal}
          showAlert={props.showAlert}
        />

      )}
    </div>
  );
};

export default AvailableRooms;
