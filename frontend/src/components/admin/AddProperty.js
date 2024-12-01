import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AddProperty = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: '',
    address: '',
    unitAvailability: '',
    rentalFees: '',
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
      const response = await axios.post("/api/admin/properties", formData);
      const { msg } = response.data;
      setMessage({
        msg: msg?.toString()
      });
      navigate("/admin_dashboard/view_properties");

    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error entry property";
      setMessage({ error: errorMessage });
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-9">
          <div className="card shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Enter Property</h2>
                { message && (
                    <div>
                       { message.msg && <p className="alert alert-info">{ message.msg }</p> }
                       { message.error && <p className="alert alert-danger">{ message.error }</p> }
                    </div>
                )}
              <form onSubmit={handleSubmit}>
              <div className="border p-3">
	         <div className="mb-3 row">
                   <label className="col-sm-2 col-form-label">Property Type:</label>
                   <div className="col-sm-10">
             	     <input type="text" className="form-control" name="type" value={formData.propertyType} required onChange={handleChange} />
                   </div>
                 </div>
	         <div className="mb-3 row">
                   <label className="col-sm-2 col-form-label">Address:</label>
                   <div className="col-sm-10">
                     <input type="text" className="form-control" name="address" value={formData.address} required onChange={handleChange} />
                   </div>
                 </div>
		 <div className="mb-3 row">
		   <label className="col-sm-4 col-form-label">Unit Availability:</label>
	     	   <select type="text" className="form-select" name="unitAvailability" value={formData.unitAvailability} required onChange={handleChange}>
		     <option value="">Select Availability?</option>
		     <option value="true">Available</option>
		     <option value="false">Not Available</option>
                   </select>
		 </div>
                 <div className="mb-3 row">
                   <label className="col-sm-2 col-form-label">Fees/Amount:</label>
                   <div className="col-sm-10">
                     <input type="number" className="form-control" name="rentalFees" value={formData.rentalFees} required onChange={handleChange} />
                   </div>
                 </div>
              </div>
              <button type="submit" className="btn btn-primary mb-3 mt-3 w-100">Enter Property</button>
      	      </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProperty;
