import { useState } from 'react';
import axios from 'axios';

const AdmitTenant = () => {
  const [formData, setFormData] = useState({
    name: {fname: '', lname: ''},
    DoB: '',
    sex: 'Male',
    contactDetails: { email: '', phone: '', address: '' },
    emergencyContact: { name: '', phone: '', address: '' },
    tenancyInfo: { type: '', fees: '', paid: '', datePaid: '', start: '', expires: '', arrears: '' },
    leaseAgreementDetails: '',
    role: '',
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
        DoB: formatDate(formData.DoB)
      };
      const response = await axios.post("/api/admin/tenants", data);
      if (response.status === 201) {
        const { msg, tenantId } = response.data;
        setMessage({
          msg: msg?.toString(),
          tenantId: tenantId?.toString()
        });
      } else {
        const { error } = response.data;
        setMessage({
          error: error?.toString()
        });
      }

    } catch (error) {
      const errorMessage = error.response?.error?.message || "Error admitting tenant";
      setMessage({ error: errorMessage });
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Admit Tenant</h2>
      { message && (
        <div>
           { message.msg && <p className="alert alert-info">{ message.msg }</p> }
           {/* message.tenantId && <p className="alert alert-info">Tenant id: { message.tenantId }</p> */}
           { message.error && <p className="alert alert-danger">{ message.error }</p> }
        </div>
      )}
      <form onSubmit={handleSubmit}>
          <div className="mb-3 row">
             <label className="col-sm-2 col-form-label">First Name:</label>
             <div className="col-sm-10">
               <input type="text" className="form-control" name="name.fname" value={formData.name.fname} required onChange={handleChange} />
             </div>
          </div>
	  <div className="mb-3 row">
             <label className="col-sm-2 col-form-label">Last Name:</label>
             <div className="col-sm-10">
               <input type="text" className="form-control" name="name.lname" value={formData.name.lname} required onChange={handleChange} />
             </div>
          </div>
	  <div className="mb-3 row">
             <label className="col-sm-2 col-form-label">Date of Birth:</label>
             <div className="col-sm-10">
                <input type="date" className="form-control" name="DoB" value={formData.DoB} required onChange={handleChange} />
             </div>
          </div>
	  <fieldset className="mb-3">
             <legend>Sex</legend>
	     <div className="form-check form-check-inline">
             	 <input type="radio" className="form-check-input" name="sex" value="Male" checked={formData.sex === 'Male'} onChange={handleChange} />
		 <label className="form-check-label">Male</label>
             </div>
 	     <div className="form-check form-check-inline">
                 <input type="radio" className="form-check-input" name="sex" value="Female" checked={formData.sex === 'Female'} onChange={handleChange} />
                 <label>Female</label>
             </div>
          </fieldset>
	     
          <h4>Contact Details</h4>          
	  <div className="mb-3 row">
             <label className="col-sm-2 col-form-label">Email:</label>
             <div className="col-sm-10">
             	 <input type="email" className="form-control" name="contactDetails.email" value={formData.contactDetails.email} required onChange={handleChange} />
             </div>
          </div>
          <div className="mb-3 row">
             <label className="col-sm-2 col-form-label">Phone:</label>
             <div className="col-sm-10">
                 <input type="tel" className="form-control" name="contactDetails.phone" value={formData.contactDetails.phone} required onChange={handleChange} />
             </div>
          </div>
	  <div className="mb-3 row">
             <label className="col-sm-2 col-form-label">Address:</label>
             <div className="col-sm-10">
                 <input type="text" className="form-control" name="contactDetails.address" value={formData.contactDetails.address} required onChange={handleChange} />
             </div>
	  </div>
             
          <h4>Emergency Contact Details</h4>
           <div className="mb-3 row">
             <label className="col-sm-2 col-form-label">Name:</label>
             <div className="col-sm-10">
                 <input type="text" className="form-control" name="emergencyContact.name" value={formData.emergencyContact.name} required onChange={handleChange} />
             </div>
           </div>
           <div className="mb-3 row">
             <label className="col-sm-2 col-form-label">Phone:</label>
             <div className="col-sm-10">
                 <input type="tel" className="form-control" name="emergencyContact.phone" value={formData.emergencyContact.phone} required onChange={handleChange} />
             </div>
           </div>
           <div className="mb-3 row">
             <label className="col-sm-2 col-form-label">Address:</label>
             <div className="col-sm-10">
                 <input type="text" className="form-control" name="emergencyContact.address" value={formData.emergencyContact.address} required onChange={handleChange} />
             </div>   
           </div>                                                                                                                                                       
             
          <h4>Tenancy Information</h4>
	  <div className="mb-3 row">
             <label className="col-sm-2 col-form-label">Type:</label>                                                                                                        <div className="col-sm-10">
                 <input type="text" className="form-control" name="tenancyInfo.type" value={formData.tenancyInfo.type} required onChange={handleChange} />
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
             <label className="col-sm-2 col-form-label">Lease Agreement:</label>
	     <select className="form-select" name="leaseAgreementDetails" value={formData.leaseAgreementDetails} required onChange={handleChange}>
		 <option value="">Select Lease Agreement</option>
		 <option value="https://3bedroomduplexurllink.example">Three (3) Bedrooms Duplex</option>
		 <option value="https://2bedroomduplexurllink.example">Two (2) Bedrooms Duplex</option>
		 <option value="https://2bedroomapartmenturllink.example">Two (2) Bedrooms Apartment</option>
		 <option value="https://shopurllink.example">Commercial Fascility</option>
             </select>
	  </div>
	     
          <button type="submit" className="btn btn-primary mt-3">Admit Tenant</button>
      </form>
    </div>
  );
}

export default AdmitTenant;
