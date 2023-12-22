import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import logo from '../images/logo.png'; // Import the logo image using require()


export const Booking = ({ hotelName, hotelId, roomNumber, roomId, roomPrice, onConfirmBooking, showModal, setShowModal, showAlert }) => {
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [addons, setAddons] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0); // State to store the calculated total price
    const navigate = useNavigate();
    const [minCheckOutDate, setMinCheckOutDate] = useState('');

    useEffect(() => {
        // Initialize the minimum allowed check-out date to be one day after the current date
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        setMinCheckOutDate(currentDate.toISOString().split('T')[0]);
    }, []);

    const handleCheckInDateChange = (e) => {
        setCheckInDate(e.target.value);

        // Calculate the minimum allowed check-out date (one day after the selected check-in date)
        const minDate = new Date(e.target.value);
        minDate.setDate(minDate.getDate() + 1);
        setMinCheckOutDate(minDate.toISOString().split('T')[0]);

        // If the current check-out date is before the minimum allowed check-out date, update it
        if (checkOutDate < minDate.toISOString().split('T')[0]) {
            setCheckOutDate(minDate.toISOString().split('T')[0]);
        }
    };

    const handleCheckOutDateChange = (e) => {
        setCheckOutDate(e.target.value);
    };


    useEffect(() => {
        fetchAddons();
    }, []);

    useEffect(() => {
        // Calculate total price whenever checkInDate, checkOutDate, or addons change
        calculateTotalPrice();
    }, [checkInDate, checkOutDate, addons]);

    const fetchAddons = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_API_ADDRESS + "/api/addon/addons");
            const data = await response.json();
            // Add the isChecked property to each addon object
            const addonsWithChecked = data.map((addon) => ({
                ...addon,
                isChecked: false,
            }));
            setAddons(addonsWithChecked);
        } catch (error) {
            console.error('Error fetching addons:', error);
        }
    };

    // const handleCheckInDateChange = (e) => {
    //     setCheckInDate(e.target.value);
    // };

    // const handleCheckOutDateChange = (e) => {
    //     setCheckOutDate(e.target.value);
    // };

    const handleAddonChange = (e) => {
        const addonName = e.target.name;
        const isChecked = e.target.checked;

        // Update the addons state with the updated isChecked value for the specific addon
        setAddons((prevAddons) =>
            prevAddons.map((addon) =>
                addon.name === addonName ? { ...addon, isChecked } : addon
            )
        );

        const addonPrice = addons.find((addon) => addon.name === addonName)?.price || 0;
        setTotalPrice((prevTotalPrice) => prevTotalPrice + (isChecked ? addonPrice : -addonPrice));
    };

    const calculateTotalPrice = () => {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const nights = (checkOut - checkIn) / (1000 * 60 * 60 * 24); // Convert milliseconds to days

        // Calculate the total price by summing roomPrice and addonTotalPrice
        const selectedAddonPrices = addons
            .filter((addon) => addon.isChecked) // Only consider selected addons
            .map((addon) => addon.price);
        const addonTotalPrice = selectedAddonPrices.reduce((acc, price) => acc + price, 0);
        // console.log(selectedAddonPrices);
        // console.log("Total price ofaddon", addonTotalPrice);

        const totalPrice = roomPrice * nights + addonTotalPrice;
        setTotalPrice(totalPrice);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            // Filter the addons array to include only the selected addons
            const selectedAddons = addons.filter((addon) => addon.isChecked);
            // Extract the names of the selected addons
            const selectedAddonNames = selectedAddons.map((addon) => addon.name);
            const bookingDetails = {
                hotelId: hotelId,
                roomId: roomId,
                roomNumber: roomNumber,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                addons: selectedAddonNames
            };

            const response = await fetch(process.env.REACT_APP_API_ADDRESS + "/api/book/createBooking", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": localStorage.getItem('token')
                },
                body: JSON.stringify(bookingDetails),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
            const newBooking = await response.json();
            // After successful booking, call the onConfirmBooking function passed from the parent component
            // Pass the booking details to the parent component for further processing
            onConfirmBooking(newBooking);
            // showAlert("success", " Room Booked Successfully");
            // Hide the modal after confirming booking
            setShowModal(false);
        } catch (error) {
            console.error('Error creating booking:', error);
            // Handle any error related to the API call here, e.g., show an error message to the user
        }
    };

    const checkoutHandler = async () => {
        const authToken = localStorage.getItem('token');
        console.log(authToken);

        if (!authToken) {
            showAlert("danger", " You need to Log In first"); //i want alert here
            // User is not logged in, show an error message or redirect to the login page
            console.log('User is not logged in');
            navigate('/login');
            return;
        }
        // calculateTotalPrice();
        console.log("chl rha hu");
        const { data: { order } } = await axios.post(process.env.REACT_APP_API_ADDRESS + "/api/checkout", {
            totalPrice
        })
        // console.log(data);
        // console.log(totalPrice);
        console.log(order.amount);

        const options = {
            key: "rzp_test_RYkL6ztNu2mGqo",
            amount: order.amount,
            currency: "INR",
            name: "Celeb Inn",
            description: "Booking",
            image: logo,
            order_id: order.id,
            callback_url: process.env.REACT_APP_API_ADDRESS + "/api/paymentverification",
            prefill: {
                name: "Logged in user name",
                email: "user@example.com",
                contact: "9999999999"
            },
            notes: {
                "address": "Razorpay Corporate Office"
            },
            theme: {
                "color": "#ffc107"
            }
        };

        const razor = new window.Razorpay(options);
        razor.open()
    };




    return (
        <div className="container mt-5">
            {showModal && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Booking for {hotelName} room number {roomNumber} at Rs.{roomPrice}/Night</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="checkInDate" className="form-label">
                                            Check-in Date
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="checkInDate"
                                            min={new Date().toISOString().split('T')[0]}
                                            value={checkInDate}
                                            onChange={handleCheckInDateChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="checkOutDate" className="form-label">
                                            Check-out Date
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="checkOutDate"
                                            min={minCheckOutDate} // Set the minimum allowed check-out date
                                            value={checkOutDate}
                                            onChange={handleCheckOutDateChange}
                                            required
                                        />
                                    </div>
                                    {/* Assuming addons is an array of available addons */}
                                    {addons.length > 0 && (
                                        <div className="mb-3">
                                            <p>Select Addons:</p>
                                            {addons.map((addon, index) => (
                                                <div key={index} className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={addon.name} // Use the addon name as the id
                                                        name={addon.name} // Use the addon name as the name
                                                        // checked={addon.isChecked} // Use isChecked property to check/uncheck the checkboxes
                                                        onChange={handleAddonChange}
                                                    />
                                                    <label className="form-check-label" htmlFor={addon._id}>
                                                        {addon.name}
                                                    </label>
                                                    <p>{addon.description} for Rs. {addon.price}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <p>Total Price: Rs. = {totalPrice.toFixed(2)}</p> {/* Display the total price */}

                                    <button type="submit" className="btn btn-warning" onClick={checkoutHandler}>
                                        Confirm Booking
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Booking;
