import React from "react";
import SimpleSlider from "./Slider";
import { Buildings, /*SolutionFeatures,*/ Team } from "../../ImageData";
import Footer from "./Footer";
import { FiUser, FiMessageSquare, FiClipboard, FiBell, FiHome, FiUpload, FiMail, FiGrid } from "react-icons/fi";

// Import the property manager image and account management image
import propertyManagerImage from "../../assets/propertymanager.png";
import accountManagementImage from "../../assets/accountmgr.webp";
import centralCommunicationImage from "../../assets/centralize.jpeg";
import { Link } from "react-router-dom";
// import { Nav } from 'react-bootstrap';

const features = [
    {
        icon: <FiUser size={40} />,
        title: 'Account Management',
        tagline: 'Manage user accounts easily'
    },
    {
        icon: <FiMessageSquare size={40} />,
        title: 'Centralized Communication',
        tagline: 'Efficient communication hub'
    },
    {
        icon: <FiClipboard size={40} />,
        title: 'Log Request',
        tagline: 'Track and manage service requests'
    },
    {
        icon: <FiBell size={40} />,
        title: 'Announcement',
        tagline: 'Broadcast important messages'
    },
    {
        icon: <FiHome size={40} />,
        title: 'Property Management and Listing',
        tagline: 'Manage properties and listings'
    },
    {
        icon: <FiUpload size={40} />,
        title: 'Document Upload and Receipt',
        tagline: 'Upload and manage documents'
    },
    {
        icon: <FiMail size={40} />,
        title: 'Email Notification',
        tagline: 'Automated email notifications'
    }
];

const Landing = () => {
    return (
        <div>
            <section>
               <SimpleSlider />
            </section>
            <section className="bg-dark text-white py-5">
              <div className="container">
                <div className="row">
                  <div className="col-md-4">
                     <img src={propertyManagerImage} alt="Property Manager" className="img-fluid rounded"/>
                  </div>
                  <div className="col-md-8">
                    <h1 className="fw-bold mb-4">Why You Need Habitat?</h1>
                    <div className="row">
                        {features.map((feature, index) => (
                            <div key={index} className="col-lg-4 col-md-6 mb-4">
                               <div className="card border-0 shadow-sm h-100 text-center">
                                  <div className="card-body">
                                     <div className="mb-3 text-primary">{feature.icon}</div>
                                     <h5 className="card-title fw-semibold text-dark">{feature.title}</h5>
                                     <p className="card-text text-dark">{feature.tagline}</p>
                                  </div>
                               </div>
                            </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-light py-5">
                <div className="container d-flex flex-column flex-md-row align-items-center">
                   <div className="col-md-6">
                      <div className="text-center mb-4">
                        <FiUser size={40} className="text-primary" />
                        <h2 className="fw-bold mt-2">Streamline your Real Estate Communication Management with our Account Management Features</h2>
                      </div>
                      <p className="lead text-muted">
                         Our Account Management feature simplifies communication for both admins and tenants, ensuring efficient collaboration and seamless interaction.
                      </p>
                   </div>
                   <div className="col-md-6 mt-4 mt-md-0">
                      <img src={accountManagementImage} alt="Account Management" className="img-fluid rounded"/>
                   </div>
                </div>
            </section>

            <section className="bainer d-flex flex-column flex-md-row align-items-center">
                <div className="col-md-6">
                    <h2 className="fw-bold mb-3">Streamline Communication with Our Central Board</h2>
                    <p className="mb-4">
                        Our Central Communication Board is designed to facilitate seamless chatting and discussion among users. Stay connected and collaborate effortlessly.
                    </p>
                    <ul className="list-unstyled">
                        <li className="d-flex align-items-center mb-2"><FiGrid className="me-2 text-primary" /> Real-time Chatting and Discussion</li>
                        <li className="d-flex align-items-center mb-2"><FiGrid className="me-2 text-primary" /> Efficient Collaboration and Information Sharing</li>
                        <li className="d-flex align-items-center mb-2"><FiGrid className="me-2 text-primary" /> Enhance Communication and Teamwork</li>
                    </ul>
                    <Link as={Link} to="/login" className="btn btn-primary mt-4">Login</Link>
                </div>
                <div className="col-md-6 mt-4 mt-md-0">
                    <img src={centralCommunicationImage} alt="Central Communication" className="img-fluid rounded" />
                </div>
            </section>

	    <section className="properties bg-light p-4 text-center">
    	      <h2 className="text-primary display-6 mb-4">Rent Properties</h2>
    	       <div className="container">
        	<div className="row row-cols-1 row-cols-md-3 g-4">
            	    {Buildings.map((building, index) => (
                        <div className="col" key={index}>
                             <div className="card h-100 border-0 shadow-sm">
                                 <img src={building.src} alt="Building" className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                                 <div className="card-body">
                                 <h5 className="card-title">{building.title}</h5>
                                 <p className="card-text">{building.message}</p>
                                 </div>
                             </div>
                        </div>
                    ))}
                </div>
                <button className="btn btn-primary mt-4">View All</button>
               </div>
            </section>

            <section className="team bg-dark p-4 text-center text-light">
              <h2 className="display-6 mb-4">Meet the Team</h2>
               <div className="container">
                <div className="row row-cols-1 row-cols-md-4 g-4">
                    {Team.map((member, index) => (
                        <div className="col" key={index}>
                             <div className="card h-100 border-0 shadow-sm bg-secondary">
                                 <img src={member.src} alt="Team Member" className="card-img-top mt-5" style={{ height: '200px', objectFit: 'cover' }} />
                                 <div className="card-body">
                                 <h5 className="card-title">{member.title}</h5>
                                 <p className="card-text">{member.message}</p>
                                 </div>
                             </div>
                        </div>
                    ))}
                </div>
               </div>
            </section>

            <Footer />
        </div>
    );
};

export default Landing;
