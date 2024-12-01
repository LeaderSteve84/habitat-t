import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

const TenantProfile = () => {

  const navigate = useNavigate();
  const { email, tenantId, address } = useParams();

  const [formData, setFormData] = useState({
    tenantId: `${tenantId}`,
    name: {fname: '', lname: ''},
    DoB: '',
    sex: 'Male',
    contactDetails: { email: `${email}`, phone: '', address: `${address}` },
    emergencyContact: { name: '', phone: '', address: '' },
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
        DoB: formatDate(formData.DoB)
      };
      const response = await axios.post("/api/tenant/profile", data);
      const { msg, profileId } = response.data;
      setMessage({
        msg: msg?.toString()
      });
      navigate(`/lease_agreement/${profileId}`);

    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error creating profile, try again";
      setMessage({ error: errorMessage });
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
      <div className="col-md-9">
      <div className="card shadow-lg">
      <div className="card-body">
      <h2 className="card-title text-center mb-4">Profile</h2>
      { message && (
        <div>
           { message.msg && <p className="alert alert-info">{ message.msg }</p> }
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
             	 <input type="email" className="form-control" name="contactDetails.email" value={formData.contactDetails.email} required readOnly/>
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
                 <input type="text" className="form-control" name="contactDetails.address" value={formData.contactDetails.address} required readOnly />
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
             
          <button type="submit" className="btn btn-primary mb-3 w-100">Submit Profile</button>
      </form>
      </div>
      </div>
      </div>
      </div>
    </div>
  );
}

export default TenantProfile;
