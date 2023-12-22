import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const PopularHotels = () => {
    const [popularHotels, setPopularHotels] = useState([]);

    useEffect(() => {
        fetchPopularHotels();
    }, []);

    const fetchPopularHotels = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_API_ADDRESS + '/api/hotel/popular');
            const data = await response.json();
            setPopularHotels(data);
        } catch (error) {
            console.error('Error fetching popular hotels:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center text-warning mt-3">Popular Hotels</h1>
            <div className="row mt-5">
                {popularHotels.map((hotel) => (
                    <div key={hotel.name} className="col-md-4 mb-4">
                        <div className="card">
                            <img src="https://imgcld.yatra.com/ytimages/image/upload/t_seo_Hotel_w_930_h_550_c_fill_g_auto_q_40_f_jpg/v1390494345/Domestic%20Hotels/Hotels_Mysore/Hotel%20The%20President/Facade~904.jpg" className="card-img-top" alt={hotel.name} />
                            <div className="card-body">
                                <h5 className="card-title">{hotel.name}</h5>
                                <p className="card-text">{hotel.description}</p>
                                <p className="card-text">Location: {hotel.address}</p>
                                <p>Total Bookings: {hotel.bookingCount}</p>
                                {/* You can add a "View Details" or "Book Now" button here */}
                                <Link to={`/api/room/getRooms/${hotel._id}`} className="btn btn-warning">Book Room</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default PopularHotels;