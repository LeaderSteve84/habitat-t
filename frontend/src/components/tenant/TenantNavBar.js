import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Outlet, Link } from "react-router-dom";

function TenantNavBar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="container d-flex justify-content-between align-items-center py-3">
         <div>
         <img
            src="https://ik.imagekit.io/rmhnagyqw/habitatT/logo.png?updatedAt=1720008714144"
            alt="logo"
            className="img-fluid"
            style={{ width: 80, height: 80 }}
         />
         </div>
      <Button variant="primary" onClick={handleShow}>
          Menu
      </Button>
      </div>

      <Offcanvas show={show} onHide={handleClose} scroll="true">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="d-flex align-items-center">
	     <div>
                <img
                src="https://ik.imagekit.io/rmhnagyqw/habitatT/logo.png?updatedAt=1720008714144"
                alt="logo"
                style={{ width: 50, height: 50 }}
		className="me-2"
                />
	        <h2 className="h5 fw-bold text mb-0">Tenant Menu</h2>
             </div>
	  </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
	   <nav className="nav flex-column">
                    <Link className="nav-link" as={Link} to="/tenant_dashboard">Dashboard</Link>
                    <Link className="nav-link" as={Link} to="/tenant_dashboard/chat">Chat Room</Link>
                    <Link className="nav-link" as={Link} to="/tenant_dashboard/log_request">Log Request</Link>
                    <Link className="nav-link" as={Link} to="/tenant_dashboard/view_my_log_requests">My Logged Requests</Link>
                    <Link className="nav-link" as={Link} to="/tenant_dashboard/update_profile">Update Profile</Link>
                    <Link className="nav-link" as={Link} to="/tenant_dashboard/upload_document">Upload Document</Link>
                    <Link className="nav-link" as={Link} to="/tenant_dashboard/change_password">Change Password</Link>
                    <Link className="nav-link" as={Link} to="/tenant_dashboard/logout">Logout</Link>
           </nav>
        </Offcanvas.Body>
      </Offcanvas>
      
      <Outlet />
    </>
  );
}

export default TenantNavBar;
