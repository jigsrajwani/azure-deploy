import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png'; // Import the logo image using require()

export const Signup = (props) => {

  const port = process.env.REACT_APP_API_ADDRESS;
  console.log(port);

  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(process.env.REACT_APP_API_ADDRESS + "/api/auth/createuser", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password })
    });
    const json = await response.json()
    console.log(json);
    if (json.success) {
      //save the authtoken and redirect
      localStorage.setItem('token', json.authtoken);
      navigate("/");
      props.showAlert("success", "Successfully Signed In");
    }
    else {
      props.showAlert("danger", "A user with this email already exists");

    }
  }
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }
  return (
    <div className="row d-flex justify-content-center align-items-center mt-5">
      <div className="col-lg-12 col-xl-11">
        <div className="card text-black">
          <div className="card-body p-md-5">
            <div className="row justify-content-center">
              <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4">Sign up</p>
                <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>
                  <div className="d-flex flex-row align-items-center mb-4">
                    <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                    <div className="form-outline flex-fill mb-0">
                      <label className="form-label" htmlFor="name">Your Name</label>
                      <input type="text" id="name" className="form-control" name='name' onChange={onChange} />
                    </div>
                  </div>

                  <div className="d-flex flex-row align-items-center mb-4">
                    <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                    <div className="form-outline flex-fill mb-0">
                      <label className="form-label" htmlFor="email">Your Email</label>
                      <input type="email" id="email" placeholder='Enter a valid email' className="form-control" name='email' onChange={onChange} />
                      <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>

                    </div>
                  </div>

                  <div className="d-flex flex-row align-items-center mb-4">
                    <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                    <div className="form-outline flex-fill mb-0">
                      <label className="form-label" htmlFor="password">Password</label>
                      <input type="password" id="password" placeholder='Password must have a minimum of 8 characters' className="form-control" name='password' onChange={onChange} minLength={8} required />
                    </div>
                  </div>

                  <div className="form-check d-flex justify-content-center mb-5">
                    <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3c" onChange={onChange} />
                    <label className="form-check-label" htmlFor="form2Example3">
                      I agree all statements in <a href="#!">Terms of service</a>
                    </label>
                  </div>

                  <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                    <button type="submit" className="btn btn-warning btn-lg">Register</button>
                  </div>

                </form>

              </div>
              <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                <h2>Register To Get Started With Us</h2>
                <img src={logo}
                  className="img-fluid" alt="Sample image" width={120} />

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

