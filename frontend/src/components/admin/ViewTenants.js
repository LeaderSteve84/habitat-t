import { useState } from 'react';
import useFetch from '../customHooks/useFetch';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ViewTenants() {

  //const [tenants, setTenants] = useState([]);

  const [message, setMessage] = useState(null);

  //const [isPending, setIsPending] = useState(false);

  const URL = "http://localhost:5000/api/admin/tenants";
    
  const { data: tenants, isPending, error } = useFetch(URL);

  const handleDeactivate = async (e, tenantId) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`/api/admin/tenants/${tenantId}`);
      console.log(response.data);

      const { msg } = response.data;
      setMessage({ msg: msg?.toString() });

    } catch (error) {
      console.error(error);

      const errorMessage = error.response?.data?.error || "Error deactivating tenant, try again";
      setMessage({ error: errorMessage });
    }
  }


  return (
    <div>
      <h1 className="h2 text-center">Tenants List</h1>
        { isPending && <div className="text-center">Loading ... </div> }
        { !isPending && error && <div className="alert alert-danger">{ error.error }</div> }
	{ message && (
              <>
		{ message.msg && <div className="alert alert-info">{message.msg}</div> }
		{ message.msg && <div className="alert alert-danger">{message.error}</div> }
              </>
	)}
      <div className="container mt-5 table-container">
        <div className="row">
          <div className="col-md-12">
            <table className="table table-hover table-bordered table-striped">
               <thead className="table-light shadow">
                  <tr>
                     <th scope="col">#</th>
                     <th scope="col">Date Admitted</th>
                     <th scope="col">First Name</th>
                     <th scope="col">Last Name</th>
                     <th scope="col">Sex</th>
                     <th scope="col">Rentage Type</th>
             	     <th scope="col">Arrears</th>
                     <th scope="col">Details</th>
                     <th scope="col">Actions</th>
                  </tr>
               </thead>
               <tbody className="table-light shadow">
               { tenants.map((tenant, index) => (
             	    <tr key={ tenant.tenantId }>
                       <th scope="row">{index + 1}</th>
                       <td>{ tenant.dateCreated }</td>
                       <td>{ tenant.fname }</td>
                       <td>{ tenant.lname }</td>
                       <td>{ tenant.sex }</td>
		       <td>{ tenant.rentageType }</td>
		       <td>{ tenant.rentageArrears }</td>
                       <td>
			  <Link className="btn btn-info" as={Link} to={`/AdminDashboard/TenantDetails/${tenant.tenantId}`}>View Details</Link>
                       </td>
                       <td>
			  <Link className="btn btn-warning" as={Link} to={`/AdminDashboard/UpdateTenant/${tenant.tenantId}`}>Update</Link>
                                {" | "}
			  <button className="btn btn-danger" onClick={(e) => {
                                  if (window.confirm("Are you sure you want to deactivate tenant.")) {
                                  handleDeactivate(e, tenant.tenantId)
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
