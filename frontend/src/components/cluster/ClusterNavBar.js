import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Outlet, Link, useParams } from "react-router-dom";

function ClusterNavBar() {

  const { companyId, clusterId, clusterName } = useParams();
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
	        <h2 className="h5 fw-bold text mb-0">Cluster Menu</h2>
             </div>
	  </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
	   <nav className="nav flex-column">
                    <Link className="nav-link" as={Link} to={`/company_dashboard/${companyId}`}>Company Dashboard</Link>
                    <Link className="nav-link" as={Link} to={`/cluster_dashboard/${companyId}/${clusterId}/${clusterName}`}>Cluster Dashboard</Link>
                    <Link className="nav-link" as={Link} to={`/cluster_dashboard/${companyId}/${clusterId}/${clusterName}/chat`}>Chat Room</Link>
                    <Link className="nav-link" as={Link} to={`/cluster_dashboard/${companyId}/${clusterId}/${clusterName}/add_unit`}>Add Unit</Link>
                    <Link className="nav-link" as={Link} to={`/cluster_dashboard/${companyId}/${clusterId}/${clusterName}/view_units`}>View All Units</Link>
                    <Link className="nav-link" as={Link} to={`/cluster_dashboard/${companyId}/${clusterId}/${clusterName}/view_tenants`}>View All Tenants | Clients</Link>
                    <Link className="nav-link" as={Link} to={`/cluster_dashboard/${companyId}/${clusterId}/${clusterName}/listed_units`}>View Listed Units</Link>
                    <Link className="nav-link" as={Link} to={`/cluster_dashboard/${companyId}/${clusterId}/${clusterName}/create_cluster_announcement`}>Create Announcement</Link>
                    <Link className="nav-link" as={Link} to={`/cluster_dashboard/${companyId}/${clusterId}/${clusterName}/view_cluster_announcements`}>View All Announcement</Link>
                    <Link className="nav-link" as={Link} to={`/cluster_dashboard/${companyId}/${clusterId}/${clusterName}/log_request`}>Log Request</Link>
		    <Link className="nav-link" as={Link} to={`/cluster_dashboard/${companyId}/${clusterId}/${clusterName}/view_my_log_requests`}>My Logged Requests</Link>
                    <Link className="nav-link" as={Link} to={`/cluster_dashboard/${companyId}/${clusterId}/${clusterName}/view_all_log_requests`}>View All Logged Requests</Link>
                    <Link className="nav-link" as={Link} to={`/cluster_dashboard/${companyId}/${clusterId}/${clusterName}/upload_document`}>Upload Document</Link>
           </nav>
        </Offcanvas.Body>
      </Offcanvas>

      <Outlet />
    </>
  );
}

export default ClusterNavBar;
