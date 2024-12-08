import { useState, useEffect } from 'react';
import useFetch from '../customHooks/useFetch';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function ViewClusters() {

  const { companyId } = useParams();

  const [clusters, setClusters] = useState([]);
  const [message, setMessage] = useState(null);

  const endpoint = `/api/clusters/${companyId}`;
    
  const { data: fetchClusters, isPending, error } = useFetch(endpoint);

  useEffect(() => {
    if (fetchClusters) {
      setClusters(fetchClusters);
    }
  }, [fetchClusters]);

  const handleDeactivate = async (e, clusterId) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`/api/cluster/${clusterId}/delete`);

      const { msg } = response.data;
      setMessage({ msg: msg?.toString() });

      setClusters((prevClusters) =>
        prevClusters.filter(
          (cluster) => cluster.clusterId !== clusterId
        )
      );
       
    } catch (error) {
      console.error(error);

      const errorMessage = error.response?.data?.error || "Error deleting cluster, try again";
      setMessage({ error: errorMessage });
    }
  }

  return (
    <div>
      <h1 className="h2 text-center">Your Properties Clusters</h1>
      { isPending && <div className="text-center">Loading ... </div> }
      { !isPending && error && (
         <div className="alert alert-danger">{ error.error }</div> 
      )}
      { message && (
         <>
	   { message.msg && <div className="alert alert-info">{message.msg}</div> }
	   { message.error && (
             <div className="alert alert-danger">{message.error}</div>
           )}
         </>
      )}
      <div className="container mt-5">
        <div className="row">
          { clusters.map((cluster) => (
            <div key={cluster.clusterId} className="col-md-4-mb-4">
              <div className="card-shadow-sm h-100 my-3 border p-3">
                <div className="card-body">
                  <Link className="text-decoration-none text-dark btn btn-primary" as={Link} to={`/cluster_dashboard/${cluster.companyId}/${cluster.clusterId}/${encodeURIComponent(cluster.clusterName)}`}>
                    <h5 className="card-title">{ cluster.clusterName }</h5>
                  </Link>
                  <p className="card-text">Location: { cluster.clusterLocation}</p>
                  <p className="card-text">Num. of Property: { cluster.numberOfProperties}</p>
                  <p className="card-text">Num. of Units: { cluster.numberOfUnits }</p>
                </div>
                <div className="card-footer d-flex justify-content-between">
                 <Link className="btn btn-warning btn-sm" as={Link} to={`/company_dashboard/${companyId}/update_cluster/${cluster.clusterId}`}>
                   Update
                 </Link>
	         <button className="btn btn-danger btn-sm" onClick={(e) => {
                   if (window.confirm("Are you sure you want to deactivate this property cluster.")) {
                     handleDeactivate(e, cluster.clusterId);
                   }
                 }}
                 >
                   Deactivate
                 </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  </div>
 );
}

export default ViewClusters;
