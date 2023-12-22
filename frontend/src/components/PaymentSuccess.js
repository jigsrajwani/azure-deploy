import React from 'react'
import { Link } from 'react-router-dom'

const PaymentSuccess = () => {
  return (

    <div class="container d-flex justify-content-center align-items-center mt-5 mb-5">
      <div class="card text-center p-4 mt-5">
        <div class="card-body">
          <h2 class="card-title mt-1">Thank You for Booking with CelebInn!</h2>
          <p class="card-text">Your Booking is Confirmed! You can check booking details and download receipt by clicking on My Bookings.</p>
          <Link to='/rooms' class="btn btn-warning mt-5">Explore More  Rooms</Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
