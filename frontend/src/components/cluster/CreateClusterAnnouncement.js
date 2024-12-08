import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

const CreateClusterAnnouncement = () => {

  const { companyId, clusterId, clusterName } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    message: ''
  });

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

  const [message, setMessage] = useState(null);
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const data = {
        ...formData, 
        companyId: `${companyId}`,
        clusterId: `${clusterId}`,
        clusterName: `${clusterName}`
      };

      const response = await axios.post("/api/cluster/announcement", data);
      const { msg } = response.data;
      setMessage({
        msg: msg?.toString()
      });
      navigate(
        `/cluster_dashboard/${companyId}/${clusterId}/${clusterName}/view_cluster_announcements`
      );

    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error entry property unit";
      setMessage({ error: errorMessage });
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-9">
          <div className="card shadow-lg">
            <div className="card-body">
              <h2 className="h4 card-title text-center">Create Cluster Announcement</h2>
              <p className="text-primary text-center mb-4">{ clusterName }</p>
                { message && (
                    <div>
                       { message.msg && <p className="alert alert-info">{ message.msg }</p> }
                       { message.error && <p className="alert alert-danger">{ message.error }</p> }
                    </div>
                )}
              <form onSubmit={handleSubmit}>
              <div className="border p-3">
	         <div className="mb-3 row">
                   <label className="col-sm-2 col-form-label">Title:</label>
                   <div className="col-sm-10">
             	     <input type="text" className="form-control" name="title" value={formData.title} required onChange={handleChange} />
                   </div>
                 </div>
	         <div className="mb-3 row">
                   <label className="col-sm-2 col-form-label">Message:</label>
                   <div className="col-sm-10">
                     <input type="text" className="form-control" name="message" value={formData.message} required onChange={handleChange} />
                   </div>
                 </div>
              </div>
              <button type="submit" className="btn btn-primary mb-3 mt-3 w-100">Submit Announcement</button>
      	      </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateClusterAnnouncement;
