import React from 'react';
import logo from '../images/logo.png'; // Import the logo image using require()

export const About = () => {
    return (
        <div class="clearfix container mt-5">
            <img src={logo} class="col-md-4 float-md-end img-fluid" alt="Sample image" width={120} />

            <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4">Welcome to CelebInn!</p>

            <p>
                At CelebInn, we believe that your personal space should reflect your unique style, passions, and dreams. Our mission is to transform your room into a captivating sanctuary inspired by the glamour and elegance of your favorite celebrities. With an exceptional selection of high-quality products and innovative design ideas, we invite you to embark on a journey of self-expression and creativity.
            </p>

            <p>Who We Are ? <br />

                At the heart of CelebInn is a team of passionate individuals who share a common love for interior design and all things celebrity. We are dedicated to curating a diverse collection of products that embody the essence of your favorite stars, whether you're into classic Hollywood icons or contemporary A-listers.
            </p>
        </div>
    )
}

