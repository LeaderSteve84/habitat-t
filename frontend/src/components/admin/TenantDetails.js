import { useParams, Link } from 'react-router-dom';
import useFetch from "../customHooks/useFetch";
import { useState } from 'react';
import axios from 'axios';

function TenantDetails() {

  const { id } = useParams();
  const [message, setMessage] = useState(null);

  const URL = `http://localhost:5000/api/admin/tenants/${id}`;

  const { data: tenant, isPending, error } = useFetch(URL);

  const handleDeactivate = async (e, tenantId) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`/api/admin/tenants/${tenantId}`);
      const { msg } = response.data;
      setMessage({ msg: msg?.toString() });

    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error deactivating tenant, try again";
      setMessage({ error: errorMessage });
    }
  }  

  return (
    <div className="container my-3">
        <h2 className="h2 text-center">Tenant Details</h2>
          { isPending && <div className="text-center">Loading...</div> }
          { isPending && error && <div className="alert alert-danger">{error.message}</div> }
          { message && <div className="alert alert-danger">{message.error}</div> }
        <div className="card mb-4">
           <div className="card-body">
              <h5 className="card-title">Personal Information</h5>
              <p><strong>Full Name:</strong> {tenant.fname} {tenant.lname}</p>
              <p><strong>Date of Birth:</strong> {tenant.DoB}</p>
              <p><strong>Sex:</strong> {tenant.sex}</p>
              <p><strong>Email:</strong> {tenant.email}</p>
              <p><strong>Phone:</strong> {tenant.phone}</p>
              <p><strong>Address:</strong> {tenant.address}</p>
           </div>
        </div>

        <div className="card mb-4">
           <div className="card-body">
              <h5 className="card-title">Emergency Contact</h5>
              <p><strong>Name:</strong> {tenant.emergencyContactName}</p>
              <p><strong>Phone:</strong> {tenant.emergencyContactPhone}</p>
              <p><strong>Address:</strong> {tenant.emergencyContactAddress}</p>
           </div>
        </div> 
        
	<div className="card mb-4">
           <div className="card-body">
              <h5 className="card-title">Rental Agreement</h5>
              <p><strong>Rentage Type:</strong> {tenant.rentageType} {tenant.lname}</p>
              <p><strong>Rentage Fee:</strong> {tenant.rentageFee}</p>
              <p><strong>Rentage Paid:</strong> {tenant.rentagePaid}</p>
              <p><strong>Rentage Arrears:</strong> {tenant.rentageArrears}</p>
              <p><strong>Rentage Started:</strong> {tenant.rentageStarted}</p>
              <p><strong>Rentage Expires:</strong> {tenant.rentageExpires}</p>
	      <p>
		<strong>Lease Agreement Details: </strong>
		<a href={tenant.lease_agreement_details} target="_target" rel="noopener noreferrer">View Document</a>
	      </p>
           </div>
        </div>

	<div className="card mb-4">
	   <div className="card-body">
	      <h5 className="card-title">Other Information</h5>
	      <p><strong>Role:</strong> {tenant.role}</p>
              <p><strong>Active:</strong> {tenant.active?.toString()}</p>
              <p><strong>Date Created:</strong> {tenant.dateCreated}</p>
              <p><strong>Last Updated:</strong> {tenant.lastUpdated}</p>
              <p><strong>Tenant ID:</strong> {tenant.tenantId}</p>
	   </div>
	</div>
	<div>
             <Link className="btn btn-warning" as={Link} to={`/AdminDashboard/UpdateTenant/${id}`}>Update</Link>
                 {" | "}
             <button className="btn btn-danger" onClick={(e) => {
               if (window.confirm("Are you sure you want to deactivate tenant.")) {
                 handleDeactivate(e, `${id}`)
               }
             }}
             >
             Deactivate
             </button>
        </div>
    </div>
  );
}

export default TenantDetails;
