import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-dark text-light py-5">
            <div className="container">
                <div className="row mb-4">
                    <div className="col-md-4 text-center text-md-start mb-4 mb-md-0">
                        <h5 className="fw-bold">About HabitatT</h5>
                        <p>
                            HabitatT is about fostering communication with tenants and property owners for seamless property management and communication.
                        </p>
                    </div>
                    <div className="col-md-4 text-center mb-4 mb-md-0">
                        <h5 className="fw-bold">Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><a href="/login" className="text-white text-decoration-none">Login</a></li>
                            <li><a href="/contact" className="text-white text-decoration-none">Contact Us</a></li>
                            <li><a href="/about" className="text-white text-decoration-none">About Us</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4 text-center text-md-end">
                        <h3 className="fw-bold">Follow Us</h3>
                        <div className="d-flex justify-content-center justify-content-md-end gap-3">
                            <a href="mailto:info@habitatT.com">
                                <img src="https://ik.imagekit.io/rmhnagyqw/habitatT/mail.png?updatedAt=1720008711166" alt="Email" className="h-8" style={{ width: 35, height: 35 }} />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <img src="https://ik.imagekit.io/rmhnagyqw/habitatT/facebook.png?updatedAt=1720008710523" alt="Facebook" className="h-8" style={{ width: 35, height: 35 }} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                <img src="https://ik.imagekit.io/rmhnagyqw/habitatT/twitter.png?updatedAt=1720008710560" alt="Twitter" className="h-8" style={{ width: 35, height: 35 }} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                <img src="https://ik.imagekit.io/rmhnagyqw/habitatT/linkedin.png?updatedAt=1720008709820" alt="LinkedIn" className="h-8" style={{ width: 35, height: 35 }} />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-4">
                    <p className="small mb-0">&copy; 2024 HabitatT. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
