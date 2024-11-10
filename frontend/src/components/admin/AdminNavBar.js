import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Outlet, Link } from "react-router-dom";

function AdminNavBar() {
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
	        <h2 className="h5 fw-bold text">Admin Menu</h2>
             </div>
	  </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
	   <nav className="nav flex-column">
                    <Link className="nav-link" as={Link} to="/AdminDashboard">Dashboard</Link>
                    <Link className="nav-link" as={Link} to="/AdminDashboard/Chat">Chat Room</Link>
                    <Link className="nav-link" as={Link} to="/AdminDashboard/AdmitTenant">Admit Tenant</Link>
                    <Link className="nav-link" as={Link} to="/AdminDashboard/ViewTenants">View Tenants</Link>
                    <Link className="nav-link" as={Link} to="/AdminDashboard/AddProperty">Property Entry</Link>
                    <Link className="nav-link" as={Link} to="/AdminDashboard/ViewProperties">View All Properties</Link>
                    <Link className="nav-link" as={Link} to="/AdminDashboard/ListProperty">List Properties</Link>
                    <Link className="nav-link" as={Link} to="/AdminDashboard/ListedProperties">View Listed Properties</Link>
                    <Link className="nav-link" as={Link} to="/AdminDashboard/CreateAnnouncement">Create Announcement</Link>
                    <Link className="nav-link" as={Link} to="/AdminDashboard/ViewAnnouncements">View All Announcement</Link>
                    <Link className="nav-link" as={Link} to="/AdminDashboard/LogRequest">Log Request</Link>
		    <Link className="nav-link" as={Link} to="/AdminDashboard/ViewMyLogRequests">My Logged Requests</Link>
                    <Link className="nav-link" as={Link} to="/AdminDashboard/ViewAllLogRequests">View All Logged Requests</Link>
                    <Link className="nav-link" as={Link} to="/AdminDashboard/UploadDocument">Upload Document</Link>
                    <Link className="nav-link" as={Link} to="/AdminDashboard/ChangePassword">Change Password</Link>
		    <Link className="nav-link" as={Link} to="/AdminDashboard/logout">Logout</Link>
           </nav>
        </Offcanvas.Body>
      </Offcanvas>
      </div>
      <Outlet />
    </>
  );
}

export default AdminNavBar;
