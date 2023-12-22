import React from 'react';
import { Link } from 'react-router-dom';
import front1 from '../images/1.png';
import front2 from '../images/2.png';
import front3 from '../images/3.png';
import PopularHotels from './PopularHotels'; // Import the new component

export const Home = () => {
    return (
        <div>
            <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel" data-interval="2000"> 
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img
                            src={front1}
                            className="d-block w-100 b-image"
                            alt="..."
                        />
                        <div className="carousel-caption d-md-block">
                            <p className=''>Warm Welcome To CelebInn  <br></br>
                            Book your comfort stay today</p>
                            <Link className="btn btn-warning text-dark explore" to='/rooms'>Explore Rooms</Link>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img
                            src={front2}
                            className="d-block w-100 b-image"
                            alt="..."
                        />
                        <div className="carousel-caption d-md-block caption-container">
                            <p className=''>Jaipur Has The Most <br />Beautiful Hotels</p>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img
                            src={front3}
                            className="d-block w-100 b-image"
                            alt="..."
                        />
                        <div className="carousel-caption d-md-block caption-container">
                            <p className=''>We provide comfort <br />to our clients!</p>
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            {/* Include the PopularHotels component below the carousel */}
            <PopularHotels />

        </div>
    );
};
