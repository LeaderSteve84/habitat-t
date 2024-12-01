import { useState, useEffect } from 'react';
import useFetch from '../customHooks/useFetch';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ViewProperties() {

  const [properties, setProperties] = useState([]);
  const [message, setMessage] = useState(null);

  const endpoint = "/api/admin/properties";
    
  const { data: fetchProperties, isPending, error } = useFetch(endpoint);
  
  useEffect(() => {
    if (fetchProperties){
      setProperties(fetchProperties);
    }
  }, [fetchProperties]);

  const handleDelete = async (e, propertyId) => {
    console.log(e);
    try {
      const response = await axios.delete(`/api/admin/properties/${propertyId}`);
      console.log(response.data);

      const { msg } = response.data;
      setMessage({ msg: msg?.toString() });

      setProperties((prevProperties) =>
        prevProperties.filter((property) => property.propertyId !== propertyId)
      );

    } catch (error) {
      console.error(error);

      const errorMessage = error.response?.data?.error || "Error deleting property, try again";
      setMessage({ error: errorMessage });
    }
  }


  return (
    <div>
      <h1 className="h2 text-center">Properties List</h1>
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
                     <th scope="col">Date Entered</th>
                     <th scope="col">Type</th>
                     <th scope="col">Address</th>
                     <th scope="col">Availability</th>
             	     <th scope="col">Amount</th>
                     <th scope="col">Admit</th>
                     <th scope="col">List</th>
                     <th scope="col">Actions</th>
                  </tr>
               </thead>
               <tbody className="table-light shadow">
               { properties.map((property, index) => (
             	    <tr key={ property.propertyId }>
                       <th scope="row">{index + 1}</th>
                       <td>{ property.dateCreated }</td>
                       <td>{ property.type }</td>
		       <td>{ property.address }</td>
                       <td>{ property.unitAvailability }</td>
		       <td>{ property.rentalFees }</td>
                       <td>
                          { property.unitAvailability === "true" && <Link className="btn btn-info" as={Link} to={`/admin_dashboard/admit_tenant/${property.propertyId}/${property.type}/${property.address}/${property.rentalFees}`}>Admit Client</Link> }
                          { property.unitAvailability === "false" && <Link className="btn btn-success" as={Link} to={`/admin_dashboard/tenant_details/${property.tenantId}`} >Client Details</Link> }
                       </td>
                       <td>
                             { property.unitAvailability === "true" && <Link className="btn btn-info" as={Link} to={`/admin_dashboard/list_property/${property.propertyId}`}>List</Link> }
                       </td>
                       <td>
                             <Link className="btn btn-warning" as={Link} to={`/admin_dashboard/update_property/${property.propertyId}`}>Update</Link>
                                {" | "}
                             { property.unitAvailability === "true" && <button className="btn btn-danger" onClick={(e) => {
                                  if (window.confirm("Are you sure you want to delete property.")) {
                                  handleDelete(e, property.propertyId)
                                  }
                              }}
                          >
                          Delete
                          </button> }
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

export default ViewProperties;
