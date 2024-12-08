import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Outlet, Link, useParams } from "react-router-dom";

function CompanyNavbar() {
  const { companyId } = useParams();
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
                style={{ width: 60, height: 60 }}
                className="me-2"
                />
	        <h2 className="h5 fw-bold text mb-0">Company Menu</h2>
             </div>
	  </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
	   <nav className="nav flex-column">
                    <Link className="nav-link" as={Link} to={`/company_dashboard/${companyId}`}>Dashboard</Link>
                    <Link className="nav-link" as={Link} to={`/company_dashboard/${companyId}/create_cluster`}>Create Cluster</Link>
                    <Link className="nav-link" as={Link} to={`/company_dashboard/${companyId}/view_clusters`}>View All Clusters</Link>
                    <Link className="nav-link" as={Link} to={`/company_dashboard/${companyId}/upload_document`}>Upload Document</Link>
                    <Link className="nav-link" as={Link} to={`/company_dashboard/${companyId}/change_password`}>Change Password</Link>
		    <Link className="nav-link" as={Link} to={`/company_dashboard/${companyId}/logout`}>Logout</Link>
           </nav>
        </Offcanvas.Body>
      </Offcanvas>

      <Outlet />
    </>
  );
}

export default CompanyNavbar;
