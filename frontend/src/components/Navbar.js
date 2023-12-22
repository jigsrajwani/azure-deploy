import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
    const handleLogout = () => {
        localStorage.clear();
    }
    let location = useLocation();

    // useEffect(() => {
    //     console.log(location.pathname);
    // }, [location]);
    return (
        <nav className="navbar navbar-expand-lg bg-warning-subtle">
            <div className="container-fluid">

                <Link className="navbar-brand" to="/">
                    {/* <img src={logo} alt="Logo" width="100" height="100" class="d-inline-block align-text-top" /> */}

                    <span className='text-warning fs-3'>C</span>elebInn</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/hotels" ? "active" : ""}`} aria-current="page" to="/hotels">Hotels</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/rooms" ? "active" : ""}`} aria-current="page" to="/rooms">Rooms</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} aria-current="page" to="/about">About Us</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/mybookings" ? "active" : ""}`} aria-current="page" to="/mybookings">My Bookings</Link>
                        </li>
                    </ul>

                    {!localStorage.getItem('token') ? <form className="d-flex mx-5">
                        <Link className="btn btn-outline-warning text-dark" to='/login'>Log In</Link>
                        <Link className="btn btn-warning mx-2" to='/signup'>Sign Up</Link>
                    </form> :
                        <Link className="btn btn-outline-warning" to='/login' onClick={handleLogout}>Log Out</Link>
                    }
                </div>
            </div>
        </nav>
    )
}

