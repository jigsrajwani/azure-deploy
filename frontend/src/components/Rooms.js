import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Booking from './Booking';

export function Rooms(props) {
    const { hotelId } = useParams();
    // console.log(hotelId);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchRooms();
    }, [hotelId]);

    const fetchRooms = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_API_ADDRESS + `/api/room/getRooms/${hotelId}`);
            const data = await response.json();
            setRooms(data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const handleBookClick = (room) => {
        console.log(room); // Check if the room data is printed in the console
        setSelectedRoom(room);
        setShowModal(true);
    };


    const handleConfirmBooking = async (bookingDetails) => {
        console.log('Booking Details:', bookingDetails);
        setShowModal(false);
    };

    return (
        <div>
            {rooms.length > 0 && (
                <h1 className="text-center text-warning mt-3">All Rooms at {rooms[0].hotel.name}</h1>
            )}
            <div className="container mt-5">
                {rooms.map((room) => (
                    <div key={room._id} className="row justify-content-start">
                        <div className="col-lg-3" style={{ boxShadow: "1px 1px 5px #ffc107" }}>
                            <img src="https://imgcld.yatra.com/ytimages/image/upload/t_seo_Hotel_w_930_h_550_c_fill_g_auto_q_40_f_jpg/v1390494345/Domestic%20Hotels/Hotels_Mysore/Hotel%20The%20President/Facade~904.jpg" alt="" className="img-fluid" />
                        </div>
                        <div className="col-lg-5">
                            <h3>{room.roomType.toUpperCase()} ROOM</h3>
                            <h5>Room Number: {room.roomNumber}</h5>
                            <p>{room.description}</p>
                            <p>Availability: {room.availability.toString()}</p>
                            <p>Price: Rs. {room.pricing}/Night</p>
                            {/* Render any other room details you want */}
                        </div>
                        <div className="col-lg-3 justify-content-center align-items-center d-flex mb-5">
                            {/* Disable the "Book" button if the room is not available */}
                            <button
                                onClick={() => {
                                    console.log('Button clicked');
                                    handleBookClick(room);
                                }}
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

export default Rooms;