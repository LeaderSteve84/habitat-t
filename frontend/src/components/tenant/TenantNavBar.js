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
      <div>
      <Button variant="primary" onClick={handleShow}>
          Menu
      </Button>

      <Offcanvas show={show} onHide={handleClose} scroll="true">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
	     <div>
                <img
                src="https://ik.imagekit.io/rmhnagyqw/habitatT/logo.png?updatedAt=1720008714144"
                alt="logo"
                style={{ width: 60, height: 60 }}
                />
	        <h2 className="h5 fw-bold text">Tenant Menu</h2>
             </div>
	  </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
	   <nav className="nav flex-column">
                    <Link className="nav-link" as={Link} to="/TenantDashboard">Dashboard</Link>
                    <Link className="nav-link" as={Link} to="/TenantDashboard/Chat">Chat Room</Link>
                    <Link className="nav-link" as={Link} to="/TenantDashboard/LogRequest">Log Request</Link>
                    <Link className="nav-link" as={Link} to="/TenantDashboard/ViewMyLogRequests">My Logged Requests</Link>
                    <Link className="nav-link" as={Link} to="/TenantDashboard/UpdateProfile">Update Profile</Link>
                    <Link className="nav-link" as={Link} to="/TenantDashboard/UploadDocument">Upload Document</Link>
                    <Link className="nav-link" as={Link} to="/TenantDashboard/ChangePassword">Change Password</Link>
                    <Link className="nav-link" as={Link} to="/TenantDashboard/Logout">Logout</Link>
           </nav>
        </Offcanvas.Body>
      </Offcanvas>
      </div>
      <Outlet />
    </>
  );
}

export default TenantNavBar;
