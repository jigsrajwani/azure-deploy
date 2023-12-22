import './App.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from './components/Navbar';
import { Login } from './components/Login';
import { Alert } from './components/Alert';
import { Signup } from './components/SignUp';
import { Home } from './components/Home';
import { Hotels } from './components/Hotels';
import { Rooms } from './components/Rooms';
import { AvailableRooms } from './components/AvailableRooms';
import Footer from './components/Footer';
import MyBookings from './components/MyBookings';
import PaymentSuccess from './components/PaymentSuccess';
import { About } from './components/About';

function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (type, message) => {
    setAlert({
      type: type,
      msg: message
    })
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  }
  return (
    <>
      <BrowserRouter>

        <Navbar />
        <Alert alert={alert} />
        <Routes>
          <Route path="/" element={<Home showAlert={showAlert} />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/hotels" element={<Hotels />} />
          <Route exact path="/rooms" element={<AvailableRooms showAlert={showAlert} />} />
          <Route exact path="/api/room/getRooms/:hotelId" element={<Rooms showAlert={showAlert} />} />
          <Route exact path="/mybookings" element={<MyBookings showAlert={showAlert} />} />
          <Route exact path="/paymentsuccess" element={<PaymentSuccess showAlert={showAlert} />} />

          <Route exact path="/login" element={<Login showAlert={showAlert} />} />
          <Route exact path="/signup" element={<Signup showAlert={showAlert} />} />
        </Routes>
        <Footer />
       
      </BrowserRouter>
    </>
  );
}

export default App;
