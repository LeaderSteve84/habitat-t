import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function Signup() {

    const { companyId } = useParams();

    const [formData, setFormData] = useState({
      clusterName: "",
      clusterLocation: "",
      numberOfProperties: "",
      numberOfUnits: ""
    });

    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
      setFormData({
        ...formData, 
        [e.target.name]: e.target.value,
      });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const data = {
            ...formData, companyId: `${companyId}`
          };
          const response = await axios.post('/api/cluster', data);
          const { msg } = response.data;
          setMessage({msg: msg?.toString()});
          navigate(`/company_dashboard/${companyId}`);

        } catch (error) {
            setMessage({ error: error.response?.data?.error || "Signup failed. Please try again." });
        }
    };

    return (
        <div className="container mt-5">
           <div className="row justify-content-center">
              <div className="col-md-6">
                 <div className="card shadow-lg">
                    <div className="card-body">
                    <h3 className="card-title text-center mb-4 fw-bold h4">Create Cluster</h3>
                    { message && (
                            <>
                            { message.msg && <div className="alert alert-info">{message.msg}</div> }
                            { message.error && <div className="alert alert-danger">{message.error}</div> }
                            </>
                    )}
                    <form onSubmit={handleSubmit}>
                       <div className="mb-3">
                          <label htmlFor="clusterName" className="form-label">Cluster Name:</label>
                          <input type="text" className="form-control" id="clusterName" name="clusterName" placeholder="e.g Lagos City Property" value={formData.clusterName} onChange={handleChange} required />
                       </div>
		       <div className="mb-3">
                          <label htmlFor="clusterLocation" className="form-label">Cluster Location:</label>
                          <input type="text" className="form-control" id="clusterLocation" name="clusterLocation" placeholder="Kumasi, Ghana" value={formData.clusterLocation} onChange={handleChange} required />
                       </div>
		       <div className="mb-3">
                          <label htmlFor="numberOfProperties" className="form-label">No of Properties:</label>
                          <input type="number" className="form-control" id="numberOfProperties" name="numberOfProperties" placeholder="e.g 10" value={formData.numberOfProperties} onChange={handleChange} required />
		       </div>
		       <div className="mb-3">
                          <label htmlFor="numberOfUnits" className="form-label">No of Units:</label>
                          <input type="number" className="form-control" id="numberOfUnits" name="numberOfUnits" placeholder="e.g 10" value={formData.numberOfUnits} onChange={handleChange} required />
                       </div>
                       <button type="submit" className="btn btn-primary w-100">Create Cluster</button>
                    </form>
                    </div>
                 </div>
              </div>
           </div>
        </div>
    );
}
