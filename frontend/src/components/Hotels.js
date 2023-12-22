import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Hotels() {
    const [hotels, setHotels] = useState([]);
    useEffect(() => {
        fetchHotels();
    }, []);
    const fetchHotels = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_API_ADDRESS + "/api/hotel/getHotels");
            const data = await response.json();
            setHotels(data);
        } catch (error) {
            console.error('Error fetching hotels:', error);
        }
    };
    return (
        <div>
            <h1 className="text-center text-warning mt-3">All Hotels</h1>
            <div className="container mt-5">
                {hotels.map((hotel) => (
                    <div key={hotel._id} className="row justify-content-start">
                        <div className="col-lg-3" style={{ boxShadow: "1px 1px 5px #ffc107" }}>
                            <img src="https://imgcld.yatra.com/ytimages/image/upload/t_seo_Hotel_w_930_h_550_c_fill_g_auto_q_40_f_jpg/v1390494345/Domestic%20Hotels/Hotels_Mysore/Hotel%20The%20President/Facade~904.jpg" alt="" className="img-fluid" />
                        </div>
                        <div className="col-lg-5">
                            <h3 className="mt-1">{hotel.name}</h3>
                            <p className="mt-1">{hotel.description}</p>
                            <p>Location: {hotel.address}</p>
                            <p>Contact: {hotel.contact}</p>
                            {/* Render any other hotel details you want */}
                        </div>
                        <div className="col-lg-3 justify-content-center align-items-center d-flex mb-5">
                            <Link to={`/api/room/getRooms/${hotel._id}`} className="btn btn-warning">Explore</Link>
                        </div>
                        <hr className='mt-2' />
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Hotels;
