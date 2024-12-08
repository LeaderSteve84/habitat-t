import { useState, useEffect } from 'react';
import useFetch from '../customHooks/useFetch';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function ViewUnits() {

  const { companyId, clusterId, clusterName } = useParams();

  const [units, setUnits] = useState([]);
  const [message, setMessage] = useState(null);

  const endpoint = `/api/cluster/units/${clusterId}`;
    
  const { data: fetchUnits, isPending, error } = useFetch(endpoint);
  
  useEffect(() => {
    if (fetchUnits){
      setUnits(fetchUnits);
    }
  }, [fetchUnits]);

  const handleDelete = async (e, unitId) => {
    console.log(e);
    try {
      const response = await axios.delete(`/api/cluster/units/${unitId}`);
      console.log(response.data);

      const { msg } = response.data;
      setMessage({ msg: msg?.toString() });

      setUnits((prevUnits) =>
        prevUnits.filter((unit) => unit.unitId !== unitId)
      );

    } catch (error) {
      console.error(error);

      const errorMessage = error.response?.data?.error || "Error deleting property unit, try again";
      setMessage({ error: errorMessage });
    }
  }


  return (
    <div>
      <h1 className="h2 text-center">All Cluster Units</h1>
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
               { units.map((unit, index) => (
             	    <tr key={ unit.unitId }>
                       <th scope="row">{index + 1}</th>
                       <td>{ unit.dateCreated }</td>
                       <td>{ unit.type }</td>
		       <td>{ unit.address }</td>
                       <td>{ unit.unitAvailability }</td>
		       <td>{ unit.rentalFees }</td>
                       <td>
                          { unit.unitAvailability === "true" && <Link className="btn btn-info" as={Link} to={`/cluster_dashboard/${companyId}/${clusterId}/${clusterName}/admit_tenant/${unit.unitId}/${unit.type}/${encodeURIComponent(unit.address)}/${unit.rentalFees}`}>Admit Client</Link> }
                          { unit.unitAvailability === "false" && <Link className="btn btn-success" as={Link} to={`/cluster_dashboard/${companyId}/${clusterId}/${clusterName}/tenant_details/${unit.tenantId}`} >Client Details</Link> }
                       </td>
                       <td>
                             { unit.unitAvailability === "true" && <Link className="btn btn-info" as={Link} to={`/cluster_dashboard/${companyId}/${clusterId}/${clusterName}/list_unit/${unit.unitId}`}>List</Link> }
                       </td>
                       <td>
                             <Link className="btn btn-warning" as={Link} to={`/cluster_dashboard/${companyId}/${clusterId}/${clusterName}/update_unit/${unit.unitId}`}>Update</Link>
                                {" | "}
                             { unit.unitAvailability === "true" && <button className="btn btn-danger" onClick={(e) => {
                                  if (window.confirm("Are you sure you want to delete property unit.")) {
                                  handleDelete(e, unit.unitId)
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

export default ViewUnits;
