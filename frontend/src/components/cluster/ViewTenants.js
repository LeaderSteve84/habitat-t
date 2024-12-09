import React, { useState } from 'react';
import useFetch from '../customHooks/useFetch';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function ViewTenants() {

  const { companyId, clusterId, clusterName } = useParams();
  const [message, setMessage] = useState(null);

  const endpoint = `/api/cluster/tenants/${clusterId}`;
    
  const { data: tenants, isPending, error } = useFetch(endpoint);
  if (tenants) {
    console.log(tenants);
  }

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
      console.error(error);

      const errorMessage = error.response?.data?.error || "Error deactivating tenant | client, try again";
      setMessage({ error: errorMessage });
    }
    
  }


  return (
    <div>
      <h1 className="h2 text-center">Tenants | Clients List</h1>
      <p className="text-primary text-center">{ clusterName }</p>
        { isPending && <div className="text-center">Loading ... </div> }
        { !isPending && error && <div className="alert alert-danger">{ error.error }</div> }
	{ message && (
            <>
		{ message.msg && <div className="alert alert-info">{message.msg}</div> }
		{ message.error && <div className="alert alert-danger">{message.error}</div> }
                { message.amsg && <div className="alert alert-info">{message.amsg}</div> }
            </>
	)}
      <div className="container mt-4 table-container">
        <div className="row">
          <div className="col-md-12">
            <table className="table table-hover table-bordered table-striped">
               <thead className="table-light shadow">
                  <tr>
                     <th scope="col">#</th>
                     <th scope="col">Date Admitted</th>
                     <th scope="col">Email</th>
                     <th scope="col">Rentage Type</th>
                     <th scope="col">Address</th>
             	     <th scope="col">Fees|Amounts</th>
                     <th scope="col">Details</th>
                     <th scope="col">Finance</th>
                     <th scope="col">Actions</th>
                  </tr>
               </thead>
               <tbody className="table-light shadow">
               { tenants?.map((tenant, index) => (
             	    <tr key={ tenant.tenantId }>
                       <th scope="row">{index + 1}</th>
                       <td>{ tenant.dateCreated }</td>
                       <td>{ tenant.email }</td>
                       { tenant?.clusters?.map((cluster) => (
                           <React.Fragment key={ cluster.cluster_id }>
                               <td>{ cluster.tenancy_info?.type || "NA" }</td>
                               <td>{ cluster.tenancy_info?.address || "NA" }</td>
                               <td>{ cluster.tenancy_info?.fees  || "NA"}</td>
                           </React.Fragment>
                       ))}
                       <td>
			  <Link className="btn btn-info" as={Link} to={`/cluster_dashboard/${companyId}/${clusterId}/${clusterName}/tenant_details/${tenant.tenantId}`}>View Details</Link>
                       </td>
                       <td>
                          <Link className="btn btn-info" as={Link} to={`/cluster_dashboard/${companyId}/${clusterId}/${clusterName}/tenant_payment/${tenant.tenantId}/${tenant.clusters?.[0]?.unit_id}`}>Enter Payments</Link>
                       </td>
                       <td>
			  <Link className="btn btn-warning" as={Link} to={`/cluster_dashboard/${companyId}/${clusterId}/${clusterName}/update_tenant/${tenant.tenantId}`}>Update</Link>
                                {" | "}
			  <button className="btn btn-danger" onClick={(e) => {
                                  if (window.confirm("Are you sure you want to deactivate tenant.")) {
                                  handleDeactivate(e, tenant.tenantId, tenant.clusters?.[0]?.unit_id)
                                  }
                              }}
                          >
                          Deactivate
                          </button>
		       </td>
             	    </tr>
               ))}
               </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewTenants;
