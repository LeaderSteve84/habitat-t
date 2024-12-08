import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../customHooks/useFetch";

const UpdateUnit = () => {

  const navigate = useNavigate();
  const { companyId, clusterId, clusterName, unitId } = useParams();

  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    type: '',
    address: '',
    rentalFees: ''
  });
  
    
  const endpoint = `/api/cluster/unit/${clusterId}/${unitId}`;
  const { data: unit, isPending, error } = useFetch(endpoint);

  useEffect(() => {
    if (unit) {
      setFormData({
        type: unit.type,
        address: unit.address,
        rentalFees: unit.rentalFees
      });
    }
  }, [unit]);

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

      const response = await axios.put(`/api/cluster/unit/${clusterId}/${unitId}`, formData);
      const { msg } = response.data;
      setMessage({
        msg: msg?.toString()
      });
      navigate(`/cluster_dashboard/${companyId}/${clusterId}/${clusterName}/view_units`);

    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error updating cluster unit";
      setMessage({ error: errorMessage });
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-9">
          <div className="card shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-center h4">Update Unit</h2>
              <p className="text-primary text-center mb-4">{ clusterName }</p>
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
                      <label className="col-sm-2 col-form-label">Unit Type:</label>
                      <div className="col-sm-10">
             	        <input type="text" className="form-control" name="type" value={formData.type} required onChange={handleChange}/>
                      </div>
                   </div>
	           <div className="mb-3 row">
                      <label className="col-sm-2 col-form-label">Unit Address:</label>
	              <div className="col-sm-10">
                        <input type="text" className="form-control" name="address" value={formData.address} required onChange={handleChange} />
                      </div>
                   </div>
		   <div className="mb-3 row">
                      <label className="col-sm-2 col-form-label">Fees | Amounts:</label>
                      <div className="col-sm-10">
                        <input type="number" className="form-control" name="rentalFees" value={formData.rentalFees} required onChange={handleChange} />
                      </div>
                   </div>
                   <button type="submit" className="btn btn-primary mb-3 w-100">Update Unit</button>
                </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateUnit;
