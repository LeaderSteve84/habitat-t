import { useParams, Link, Outlet } from 'react-router-dom';
import useFetch from "../customHooks/useFetch";
import { useState } from 'react';
import axios from 'axios';

function TenantDetails() {

  const { companyId, clusterId, clusterName, tenantId } = useParams();
  const [message, setMessage] = useState(null);

  const endpoint = `/api/cluster/tenant/${clusterId}/${tenantId}`;

  const { data: tenant, isPending, error } = useFetch(endpoint);

  const handleDeactivate = async (e, tenantId, unitId) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`/api/cluster/tenants/${tenantId}`);
      const { msg } = response.data;
      setMessage({ msg: msg?.toString() });

      const resp = await axios.put(`/api/cluster/unit/${unitId}/availability`, {unitAvailability: "true", tenantId: ""});
      const { amsg } = resp.data;
      setTimeout(() => {
        setMessage({ amsg: amsg?.toString() });
      }, 500);

    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error deactivating tenant, try again";
      setMessage({ error: errorMessage });
    }
  }  

  return (
    <div className="container my-3">
        <h2 className="h2 text-center">Tenant | Client Details</h2>
        <p className="text-primary text-center mb-4">{ clusterName }</p>
          { isPending && <div className="text-center">Loading...</div> }
          { isPending && error && <div className="alert alert-danger">{error.error}</div> }
          { message && (
                <>
                  { message.msg && <div className="alert alert-info">{message.msg}</div> }
                  { message.error && <div className="alert alert-danger">{message.error}</div> }
                  { message.amsg && <div className="alert alert-danger">{message.amsg}</div> }
                </>
          )}
	<div className="card mb-4">
           <div className="card-body">
              <h5 className="card-title">Rental Agreement</h5>
              <p><strong>Rentage Type:</strong> {tenant.rentageType} {tenant.lname}</p>
              <p><strong>Rentage Address:</strong> {tenant.address}</p>
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
              <p><strong>Tenant | Client ID:</strong> {tenant.tenantId}</p>
              <p><strong>Property ID:</strong> {tenant.propertyId}</p>
	   </div>
	</div>
        <Link className="btn btn-primary mb-3" as={Link} to={`/cluster_dashboard/${companyId}/${clusterId}/${clusterName}/tenant_details/${tenantId}/view_tenant_profile/${tenantId}`}>View Profile</Link>
        <Outlet />
	<div>
             <Link className="btn btn-warning me-3" as={Link} to={`/cluster_dashboard/${companyId}/${clusterId}/${clusterName}/update_tenant/${tenantId}`}>Update Tenant/Client</Link>
                 {" | "}
             <button className="btn btn-danger ms-3" onClick={(e) => {
               if (window.confirm("Are you sure you want to deactivate tenant.")) {
                 handleDeactivate(e, `${tenantId}`, tenant.unitId)
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
