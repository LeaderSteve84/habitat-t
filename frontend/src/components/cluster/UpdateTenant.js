import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../customHooks/useFetch";

const UpdateTenant = () => {

  const navigate = useNavigate();
  const { companyId, clusterId, clusterName, tenantId } = useParams();

  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    tenancyInfo: { type: '', address: '', fees: '', paid: '', datePaid: '', start: '', expires: '', arrears: '' },
    leaseAgreementDetails: ''
  });
  
    
  const endpoint = `/api/cluster/tenant/${tenantId}/update`;
  const { data: tenant, isPending, error } = useFetch(endpoint);

  useEffect(() => {
    if (tenant) {
      setFormData({
        email: tenant.email,
        tenancyInfo: tenant.tenancyInfo || { type: '', address: '', fees: '', paid: '', datePaid: '', start: '', expires: '', arrears: '' },
        leaseAgreementDetails: tenant.leaseAgreementDetails || ''
      });
    }
  }, [tenant]);

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

  const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };
    
  const handleSubmit = async (e) => {
    e.preventDefault();

    try { 
      const data = {
        ...formData,
        tenancyInfo: {
	  ...formData.tenancyInfo,
	  datePaid: formatDate(formData.tenancyInfo.datePaid),
	  start: formatDate(formData.tenancyInfo.start),
	  expires: formatDate(formData.tenancyInfo.expires)
        } 
      };
      const response = await axios.put(`/api/cluster/tenant/${tenantId}/update`, data);
      const { msg } = response.data;
      setMessage({
        msg: msg?.toString()
      });
      navigate(`/cluster_dashboard/${companyId}/${clusterId}/${clusterName}/tenant_details/${tenantId}`);

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
      <h2 className="card-title text-center mb-4">Update Tenant</h2>
      { error && <div className="alert alert-danger">{ error.error }</div> }
      { isPending && <div className="text-center">Loading...</div> }
      { message && (
        <div>
           { message.msg && <p className="alert alert-info">{ message.msg }</p> }
           { message.error && <p className="alert alert-danger">{ message.error }</p> }
        </div>
      )}
      <form onSubmit={handleSubmit}>
          <h4>Contact Details</h4>          
	  <div className="mb-3 row">
             <label className="col-sm-2 col-form-label">Email:</label>
             <div className="col-sm-10">
             	 <input type="email" className="form-control" name="email" value={formData.email} required readOnly/>
             </div>
          </div>
             
          <h4>Tenancy Information</h4>
	  <div className="mb-3 row">
             <label className="col-sm-2 col-form-label">Type:</label>
	     <div className="col-sm-10">
                 <input type="text" className="form-control" name="tenancyInfo.type" value={formData.tenancyInfo.type} required onChange={handleChange} />
             </div>
          </div>
          <div className="mb-3 row">
             <label className="col-sm-2 col-form-label">Address:</label>
             <div className="col-sm-10">
                 <input type="text" className="form-control" name="tenancyInfo.address" value={formData.tenancyInfo.address} required onChange={handleChange} />
            </div>
          </div> 
          <div className="mb-3 row">
             <label className="col-sm-2 col-form-label">Fees:</label>
             <div className="col-sm-10">
                 <input type="number" className="form-control" name="tenancyInfo.fees" value={formData.tenancyInfo.fees} required onChange={handleChange} />
             </div>
          </div>
          <div className="mb-3 row">
             <label className="col-sm-2 col-form-label">Amount Paid:</label>
             <div className="col-sm-10">
                 <input type="number" className="form-control" name="tenancyInfo.paid" value={formData.tenancyInfo.paid} required onChange={handleChange} />
             </div>
          </div>
          <div className="mb-3 row">
             <label className="col-sm-2 col-form-label">Date Paid:</label>
             <div className="col-sm-10">
                 <input type="date" className="form-control" name="tenancyInfo.datePaid" value={formData.tenancyInfo.datePaid} required onChange={handleChange} />
             </div>
          </div>
	  <div className="mb-3 row">
             <label className="col-sm-2 col-form-label">Start:</label>
             <div className="col-sm-10">
                 <input type="date" className="form-control" name="tenancyInfo.start" value={formData.tenancyInfo.start} required onChange={handleChange} />
             </div>
          </div>
	  <div className="mb-3 row">
             <label className="col-sm-2 col-form-label">Expires:</label>
             <div className="col-sm-10">
                 <input type="date" className="form-control" name="tenancyInfo.expires" value={formData.tenancyInfo.expires} required onChange={handleChange} />
             </div>
          </div>
	  <div className="mb-3 row">
             <label className="col-sm-2 col-form-label">Arrears:</label>
             <div className="col-sm-10">
                 <input type="number" className="form-control" name="tenancyInfo.arrears" value={formData.tenancyInfo.arrears} required onChange={handleChange} />
             </div>
          </div>
                
          <div className="mb-3 row">
             <label className="col-sm-5 col-form-label">Lease Agreement:</label>
	     <select className="form-select" name="leaseAgreementDetails" value={formData.leaseAgreementDetails} required onChange={handleChange}>
		 <option value="">Select Lease Agreement</option>
		 <option value="https://3bedroomduplexurllink.example">Three (3) Bedrooms Duplex</option>
		 <option value="https://2bedroomduplexurllink.example">Two (2) Bedrooms Duplex</option>
		 <option value="https://2bedroomapartmenturllink.example">Two (2) Bedrooms Apartment</option>
		 <option value="https://shopurllink.example">Commercial Fascility</option>
             </select>
	  </div>
          <button type="submit" className="btn btn-primary mb-3 w-100">Update Tenant</button>
      </form>
      </div>
      </div>
      </div>
      </div>
    </div>
  );
}

export default UpdateTenant;
