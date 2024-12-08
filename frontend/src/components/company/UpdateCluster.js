import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../customHooks/useFetch";

const UpdateCluster = () => {

  const navigate = useNavigate();
  const { companyId, clusterId } = useParams();

  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    clusterName: '',
    clusterLocation: '',
    numberOfProperties: '',
    numberOfUnits: ''
  });
  
    
  const endpoint = `/api/cluster/${companyId}/${clusterId}`;
  const { data: cluster, isPending, error } = useFetch(endpoint);

  useEffect(() => {
    if (cluster) {
      setFormData({
        clusterName: cluster.clusterName,
        clusterLocation: cluster.clusterLocation,
        numberOfProperties: cluster.numberOfProperties,
        numberOfUnits: cluster.numberOfUnits
      });
    }
  }, [cluster]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    if (keys.length > 1) {
      setFormData((prevData) => ({
        ...prevData,
        [keys[0]]: {
          ...prevData[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try { 

      const response = await axios.put(`/api/cluster/${companyId}/${clusterId}`, formData);
      const { msg } = response.data;
      setMessage({
        msg: msg?.toString()
      });
      navigate(`/company_dashboard/${companyId}/view_clusters`);

    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error updating company cluster";
      setMessage({ error: errorMessage });
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-9">
          <div className="card shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Update Cluster</h2>
                { error && <div className="alert alert-danger">{ error.error }</div> }
                { isPending && <div className="text-center">Loading...</div> }
                { message && (
                    <div>
                       { message.msg && <p className="alert alert-info">{ message.msg }</p> }
                       { message.error && <p className="alert alert-danger">{ message.error }</p> }
                    </div>
                )}
                <form onSubmit={handleSubmit}>
	           <div className="mb-3 row">
                      <label className="col-sm-2 col-form-label">Cluster Name:</label>
                      <div className="col-sm-10">
             	        <input type="text" className="form-control" name="clusterName" value={formData.clusterName} required onChange={handleChange}/>
                      </div>
                   </div>
	           <div className="mb-3 row">
                      <label className="col-sm-2 col-form-label">Cluster Location:</label>
	              <div className="col-sm-10">
                        <input type="text" className="form-control" name="clusterLocation" value={formData.clusterLocation} required onChange={handleChange} />
                      </div>
                   </div>
		   <div className="mb-3 row">
                      <label className="col-sm-2 col-form-label">Number of Properties:</label>
                      <div className="col-sm-10">
                        <input type="number" className="form-control" name="numberOfProperties" value={formData.numberOfProperties} required onChange={handleChange} />
                      </div>
                   </div>
		   <div className="mb-3 row">
                      <label className="col-sm-2 col-form-label">Number of Units:</label>
                      <div className="col-sm-10">
                        <input type="number" className="form-control" name="numberOfUnits" value={formData.numberOfUnits} required onChange={handleChange} />
                      </div>
                   </div>
                   <button type="submit" className="btn btn-primary mb-3 w-100">Update Cluster</button>
                </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateCluster;
