import { useState, useEffect } from 'react';
import useFetch from '../customHooks/useFetch';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function ViewClusterAnnouncements() {

  const { companyId, clusterId, clusterName } = useParams();

  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState(null);

  const endpoint = `/api/cluster/announcements/${companyId}/${clusterId}`;
    
  const { data: fetchAnnouncements, isPending, error } = useFetch(endpoint);
  
  useEffect(() => {
    if (fetchAnnouncements){
      setAnnouncements(fetchAnnouncements);
    }
  }, [fetchAnnouncements]);

  const handleDelete = async (e, announcementId) => {
    console.log(e);
    try {
      const response = await axios.delete(`/api/cluster/announcement/${announcementId}/delete`);
      console.log(response.data);

      const { msg } = response.data;
      setMessage({ msg: msg?.toString() });

      setAnnouncements((prevAnnouncements) =>
        prevAnnouncements.filter(
          (announcement) => announcement.announcementId !== announcementId
        )
      );

    } catch (error) {
      console.error(error);

      const errorMessage = error.response?.data?.error || "Error deleting cluster announcement, try again";
      setMessage({ error: errorMessage });
    }
  }


  return (
    <div>
      <h1 className="h4 text-center">Property Cluster Announcements</h1>
      <p className="text-primary text-center">{ decodeURIComponent(clusterName) }</p>
        { isPending && <div className="text-center">Loading ... </div> }
        { !isPending && error && <div className="alert alert-danger">{ error.error }</div> }
	{ message && (
              <>
		{ message.msg && <div className="alert alert-info">{message.msg}</div> }
		{ message.msg && <div className="alert alert-danger">{message.error}</div> }
              </>
	)}
      <div className="container mt-4 table-container">
        <div className="row">
          <div className="col-md-12">
            <table className="table table-hover table-bordered table-striped">
               <thead className="table-light shadow">
                  <tr>
                     <th scope="col">#</th>
                     <th scope="col">Date Entered</th>
                     <th scope="col">Title</th>
                     <th scope="col">Message</th>
                     <th scope="col">Actions</th>
                  </tr>
               </thead>
               <tbody className="table-light shadow">
               { announcements.map((announcement, index) => (
             	    <tr key={ announcement.announcementId }>
                       <th scope="row">{index + 1}</th>
                       <td>{ announcement.dateCreated }</td>
                       <td>{ announcement.title }</td>
		       <td>{ announcement.message }</td>
                       <td>
                             <Link className="btn btn-warning" as={Link} to={`/cluster_dashboard/${companyId}/${clusterId}/${encodeURIComponent(clusterName)}/update_cluster_announcement/${announcement.announcementId}`}>Update</Link>
                                {" | "}
                             <button className="btn btn-danger" onClick={(e) => {
                                  if (window.confirm("Are you sure you want to delete announcement?.")) {
                                  handleDelete(e, announcement.announcementId)
                                  }
                              }}
                          >
                          Delete
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

export default ViewClusterAnnouncements;
