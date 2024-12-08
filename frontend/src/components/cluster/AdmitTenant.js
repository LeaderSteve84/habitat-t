import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

const AdmitTenant = () => {

  const navigate = useNavigate();
  const { companyId, clusterId, unitId, type, address, fees } = useParams();

  const [formData, setFormData] = useState({
    unitId: `${unitId}`,
    companyId: `${companyId}`,
    clusterId: `${clusterId}`,
    email: '',
    tenancyInfo: { type: `${type}`, address: `${address}`, fees: `${fees}`, paid: '', datePaid: '', start: '', expires: '', arrears: '' },
    leaseAgreementDetails: ''
  });

  const autoGeneratePassword = () => {
    // Generate a random password function
    return Math.random().toString(36).slice(-8);
  };

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

  const [message, setMessage] = useState(null);
    
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
        }, 
        password: autoGeneratePassword(), 
        role: "tenant",
      };
      const response = await axios.post("/api/cluster/tenants", data);
      const { msg, tenantId } = response.data;
      setMessage({
        msg: msg?.toString()
      });
      const resp = await axios.put(`/api/cluster/unit/${unitId}/availability`, {unitAvailability: "false", tenantId: `${tenantId}`} );
      setTimeout(() => {
        const { amsg } = resp.data;
        setMessage({
          amsg: amsg?.toString()
        });
      }, 500);
      
      setTimeout(() => {
        navigate(`/cluster_dashboard/${companyId}/${clusterId}/view_tenants`);
      }, 500);

    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error admitting tenant";
      setMessage({ error: errorMessage });
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
      <div className="col-md-9">
      <div className="card shadow-lg">
      <div className="card-body">
      <h2 className="card-title text-center mb-4">Admit Tenant/Client</h2>
      { message && (
        <div>
           { message.msg && <p className="alert alert-info">{ message.msg }</p> }
           { message.error && <p className="alert alert-danger">{ message.error }</p> }
           { message.amsg && <p className="alert alert-info">{ message.amsg }</p> }
        </div>
      )}
      <form onSubmit={handleSubmit}>
          <div className="mb-3 row">
             <label className="col-sm-2 col-form-label">Unit Id:</label>
             <div className="col-sm-10">
                 <input type="text" className="form-control" name="propertyId" value={formData.unitId} required readOnly />
             </div>
          </div>
	  <div className="mb-3 row">
             <label className="col-sm-2 col-form-label">Email:</label>
             <div className="col-sm-10">
             	 <input type="email" className="form-control" name="email" value={formData.email} required onChange={handleChange} />
             </div>
          </div>
          <h4 className="h5 fw-bold">Tenancy Information</h4>
          <div className="border p-3">
	  <div className="mb-3 row">
             <label className="col-sm-2 col-form-label">Type:</label>
             <div className="col-sm-10">
                 <input type="text" className="form-control" name="tenancyInfo.type" value={formData.tenancyInfo.type} required readOnly />
             </div>
          </div>
	  <div className="mb-3 row">
             <label className="col-sm-2 col-form-label">Address:</label>
             <div className="col-sm-10">
                 <input type="text" className="form-control" name="tenancyInfo.address" value={formData.tenancyInfo.address} required readOnly />
             </div>
          </div>
          <div className="mb-3 row">
             <label className="col-sm-2 col-form-label">Fees:</label>
             <div className="col-sm-10">
                 <input type="number" className="form-control" name="tenancyInfo.fees" value={formData.tenancyInfo.fees} required readOnly />
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
          </div>
                
          <div className="mb-3 row">
             <label className="col-sm-5 col-form-label fw-bold h5">Lease Agreement:</label>
	     <select className="form-select" name="leaseAgreementDetails" value={formData.leaseAgreementDetails} required onChange={handleChange}>
		 <option value="">Select Lease Agreement</option>
		 <option value="https://3bedroomduplexurllink.example">Three (3) Bedrooms Duplex</option>
		 <option value="https://2bedroomduplexurllink.example">Two (2) Bedrooms Duplex</option>
		 <option value="https://2bedroomapartmenturllink.example">Two (2) Bedrooms Apartment</option>
		 <option value="https://shopurllink.example">Commercial Fascility</option>
             </select>
	  </div>
          <button type="submit" className="btn btn-primary mb-3 w-100">Admit Tenant/Client</button>
      </form>
      </div>
      </div>
      </div>
      </div>
    </div>
  );
}

export default AdmitTenant;
