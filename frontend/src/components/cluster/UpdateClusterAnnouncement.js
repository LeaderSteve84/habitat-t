import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../customHooks/useFetch";

const UpdateClusterAnnouncement = () => {

  const navigate = useNavigate();
  const { companyId, clusterId, clusterName, announcementId } = useParams();

  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    message: ''
  });
  
    
  const endpoint = `/api/cluster/announcement/${announcementId}/update`;
  const { data: announcement, isPending, error } = useFetch(endpoint);

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title,
        message: announcement.message
      });
    }
  }, [announcement]);

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

      const response = await axios.put(`/api/cluster/announcement/${announcementId}/update`, formData);
      const { msg } = response.data;
      setMessage({
        msg: msg?.toString()
      });
      navigate(`/cluster_dashboard/${companyId}/${clusterId}/${clusterName}/view_cluster_announcements`);

    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error updating tenant";
      setMessage({ error: errorMessage });
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-9">
          <div className="card shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Update Announcement</h2>
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
                      <label className="col-sm-2 col-form-label">Title:</label>
                      <div className="col-sm-10">
             	        <input type="text" className="form-control" name="title" value={formData.title} required onChange={handleChange}/>
                      </div>
                   </div>
             
	           <div className="mb-3 row">
                      <label className="col-sm-2 col-form-label">Message:</label>
	              <div className="col-sm-10">
                        <input type="text" className="form-control" name="message" value={formData.message} required onChange={handleChange} />
                      </div>
                   </div>
                   <button type="submit" className="btn btn-primary mb-3 w-100">Update Announcement</button>
                </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateClusterAnnouncement;