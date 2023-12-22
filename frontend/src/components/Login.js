import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png'; // Import the logo image using require()

export const Login = (props) => {
    const port = process.env.REACT_APP_API_ADDRESS;
    console.log(port);

    const [credentials, setCredentials] = useState({ email: "", password: "" });
    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(process.env.REACT_APP_API_ADDRESS + "/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })

        });
        const json = await response.json()
        console.log(json);
        if (json.success) {
            //save the authtoken and redirect
            localStorage.setItem('token', json.authtoken);
            props.showAlert("success", "Successfully Logged In");
            navigate("/");
        }
        else {
            props.showAlert("danger", "Invalid details");

        }
    }
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    return (
        <div className="row d-flex justify-content-center align-items-center mt-5">
            <div className="col-lg-12 col-xl-11">
                <div className="card text-black" >
                    <div className="card-body p-md-5">
                        <div className="row justify-content-center">
                            <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                                <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4">Log In</p>
                                <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>

                                    <div className="d-flex flex-row align-items-center mb-4">
                                        <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                        <div className="form-outline flex-fill mb-0">
                                            <label htmlFor="email" className="form-label">Email address</label>
                                            <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="email" aria-describedby="emailHelp" name='email' />
                                        </div>
                                    </div>

                                    <div className="d-flex flex-row align-items-center mb-4">
                                        <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                                        <div className="form-outline flex-fill mb-0">
                                            <label htmlFor="password" className="form-label">Password</label>
                                            <input type="password" className="form-control" value={credentials.password} onChange={onChange} id="password" name='password' />
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                        <button type="submit" className="btn btn-warning" >Submit</button>
                                    </div>

                                </form>

                            </div>
                            <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                                <h2>Book Your Comfort With CelebInn</h2>
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