import { useParams, Link } from 'react-router-dom';
import useFetch from "../customHooks/useFetch";
import { useState } from 'react';
import axios from 'axios';

function ViewTenantProfile() {

  const { id } = useParams();
  const [message, setMessage] = useState(null);

  const endpoint = `/api/tenant/profile/${id}`;

  const { data: profile, isPending, error } = useFetch(endpoint);

  const handleDeactivate = async (e, profileId) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`/api/tenant/profile/deactivate/${profileId}`);
      const { msg } = response.data;
      setMessage({ msg: msg?.toString() });

    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error deactivating tenant, try again";
      setMessage({ error: errorMessage });
    }
  }  

  return (
    <div className="container my-3">
        <h2 className="h2 text-center">Tenant Profile</h2>
          { isPending && <div className="text-center">Loading...</div> }
          { !isPending && error && <div className="alert alert-danger">{error.error}</div> }
          { message && <div className="alert alert-danger">{message.error}</div> }
        <div className="card mb-4">
           <div className="card-body">
              <h5 className="card-title">Personal Information</h5>
              <p><strong>Full Name:</strong> {profile.fname} {profile.lname}</p>
              <p><strong>Date of Birth:</strong> {profile.DoB}</p>
              <p><strong>Sex:</strong> {profile.sex}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong> {profile.phone}</p>
              <p><strong>Address:</strong> {profile.address}</p>
           </div>
        </div>

        <div className="card mb-4">
           <div className="card-body">
              <h5 className="card-title">Emergency Contact</h5>
              <p><strong>Name:</strong> {profile.emergencyContactName}</p>
              <p><strong>Phone:</strong> {profile.emergencyContactPhone}</p>
              <p><strong>Address:</strong> {profile.emergencyContactAddress}</p>
           </div>
        </div> 

        <div className="card mb-4">
           <div className="card-body">
              <h5 className="card-title">Other Profile Informations</h5>
              <p><strong>Date Created:</strong> {profile.dateCreated}</p>
              <p><strong>Last Updated:</strong> {profile.lastUpdated}</p>
              <p><strong>Profile Id:</strong> {profile.profileId}</p>
              <p><strong>Tenant Id:</strong> {profile.tenantId}</p>
              <p><strong>Active:</strong> {profile.active?.toString()}</p>
              <p><strong>Lease Agreement:</strong> {profile.leaseAgreement}</p>
           </div>
         </div>
        
	<div>
             <Link className="btn btn-warning me-3" as={Link} to={`/admin_dashboard/update_tenant_profile/${profile.profileId}`}>Update Profile</Link>
                 {" | "}
             <button className="btn btn-danger ms-3" onClick={(e) => {
               if (window.confirm("Are you sure you want to deactivate tenant profile.")) {
                 handleDeactivate(e, `${profile.profileId}`)
               }
             }}
             >
             Deactivate
             </button>
        </div>
    </div>
  );
}

export default ViewTenantProfile;
