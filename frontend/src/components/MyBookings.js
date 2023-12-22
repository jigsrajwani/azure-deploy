import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyBookings = (props) => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().substr(-2);
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    // Fetch bookings data from the backend API
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // Check if the user is logged in before fetching bookings
      const token = localStorage.getItem('token');
      if (!token) {
        props.showAlert("danger", " You need to Login First");

        // Redirect the user to the login page if not logged in
        navigate('/login');
        return;
      }

      const response = await fetch(process.env.REACT_APP_API_ADDRESS + "/api/book/getallbookings", {
        method: 'GET',
        headers: {
          "auth-token": token
        }
      });
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Redirect the user to the login page if there's an error fetching bookings
      navigate('/login');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_ADDRESS + `/api/book/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          "auth-token": localStorage.getItem('token')
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      props.showAlert("success", "Booking Cancelled Successfully");
      // Update the bookings state after successful cancellation
      setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== bookingId));
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const handleReceipt = async (bookingId) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_ADDRESS + `/api/book/receipt/${bookingId}`, {
        method: 'GET',
        headers: {
          "auth-token": localStorage.getItem('token')
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const blob = await response.blob(); // Get the response as a Blob
      const url = URL.createObjectURL(blob); // Create a URL for the Blob
      const a = document.createElement('a'); // Create an anchor element to trigger the download
      a.href = url;
      a.download = 'receipt.pdf'; // Set the desired filename for the downloaded file
      // document.body.appendChild(a); // Append the anchor element to the document
      a.click(); // Click the anchor element to trigger the download
      // document.body.removeChild(a); // Remove the anchor element from the document

      props.showAlert("success", "Receipt Downloaded Successfully");
    } catch (error) {
      console.error('Error downloading receipt', error);
    }
  };

  return (
    <main>
      <div className='container'>
        <h1 className='text-center text-warning'>My Bookings</h1>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="row">
            {bookings.map((booking, index) => (
              <div key={booking._id} className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Booking ID: {booking._id}</h5>
                    <p className="card-text">Hotel Name: {booking.hotel.name}</p>
                    <p className="card-text">Location: {booking.hotel.address}</p>
                    <p className="card-text">Room Number: {booking.room.roomNumber}</p>
                    <p className="card-text">Addons: {booking.addons.join(', ')}</p>
                    <p className="card-text">Check-in: {formatDate(booking.checkInDate)}</p>
                    <p className="card-text">Check-out: {formatDate(booking.checkOutDate)}</p>
                    <button className="btn btn-warning mx-2" onClick={() => handleCancelBooking(booking._id)}>Cancel Booking</button>
                    <button className="btn btn-warning mx-2 mt-1" onClick={() => handleReceipt(booking._id)}>Download Receipt</button>

                    <span className="position-absolute top-0 start-100 translate-middle badge bg-warning">{index + 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyBookings;