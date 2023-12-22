import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png'; // Import the logo image using require()

const Footer = () => {
    return (
        <footer className="bg-warning-subtle text-center text-lg-start">
            <div className="container p-4">
                <div className="row">
                    <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
                        <div className="d-flex">
                            <img src={logo} alt="CelebInn Logo" height="50" />
                            <h5 className="ms-2 my-auto">CelebInn</h5>
                        </div>
                        <p>
                            India's most favourite brand to book rooms from all over the jaipur hotels.
                        </p>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                        <h5 className="text-uppercase">Quick Links</h5>
                        <ul className="list-unstyled">
                            <li>
                                <Link className="text-dark text-decoration-none" to="/">Home</Link>
                            </li>
                            <li>
                                <Link className="text-dark text-decoration-none" to="/rooms">Rooms</Link>
                            </li>
                            <li>
                                <Link className="text-dark text-decoration-none" to="/hotels">Hotels</Link>
                            </li>
                            <li>
                                <Link className="text-dark text-decoration-none" to="/about">About Us</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                        <h5 className="text-uppercase">Contact</h5>
                        <ul className="list-unstyled">
                            <li>
                                <i className="fas fa-envelope"></i>
                                <Link className="text-dark" to="mailto:info@celebinn.com">info@celebinn.in</Link>
                            </li>
                            <li>
                                <i className="fas fa-phone-alt"></i>
                                <Link className="text-dark" to="tel:+1234567890">+1 (234) 567-890</Link>
                            </li>
                            <li>
                                <i className="fas fa-map-marker-alt"></i>
                                <address>1234, Jaipur, India</address>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
              &copy; {new Date().getFullYear()} CelebInn. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
