import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {

    const [formData, setFormData] = useState({
      fullname: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      position: "",
      businessLocation: ""
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
            ...formData, role: "company"
          };
          console.log("Form Data Submitted: ", data);
          const response = await axios.post('/api/company', data);
          const { msg } = response.data;
          setMessage({msg: msg?.toString()});
          navigate('/login');

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
                    <h3 className="card-title text-center mb-4 fw-bold h4">Sign Up</h3>
                    { message && (
                            <>
                            { message.msg && <div className="alert alert-info">{message.msg}</div> }
                            { message.error && <div className="alert alert-danger">{message.error}</div> }
                            </>
                    )}
                    <form onSubmit={handleSubmit}>
                       <div className="mb-3">
                          <label htmlFor="fullname" className="form-label">Full Name:</label>
                          <input type="text" className="form-control" id="fullname" name="fullname" placeholder="Enter your fullname" value={formData.fullname} onChange={handleChange} required />
                       </div>
		       <div className="mb-3">
                          <label htmlFor="email" className="form-label">Email:</label>
                          <input type="email" className="form-control" id="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
                       </div>
		       <div className="mb-3">
                          <label htmlFor="phone" className="form-label">Phone:</label>
                          <input type="tel" className="form-control" id="phone" name="phone" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} required />
		       </div>
                       <div className="mb-3">
                          <label htmlFor="password" className="form-label">Password:</label>
                          <input type="password" className="form-control" id="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} required />
                       </div>
		       <div className="mb-3">
                          <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
                          <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} required />
                       </div>
                       <div className="mb-3">
                          <label htmlFor="companyName" className="form-label">Company Name:</label>
                          <input type="text" className="form-control" id="companyName" name="companyName" placeholder="Enter your company name" value={formData.companyName} onChange={handleChange} required />
                       </div>
                       <div className="form-check mb-3">
                          <label className="form-label" htmlFor="position">Position:</label>
                          <select className="form-control" id="position" name="position" value={formData.position} onChange={handleChange} required >
                            <option value="">Select your role/position</option>
                            <option value="owner">Owner</option>
                            <option value="property manager">Property Manager</option>
                            <option value="real estate agent">Real Estate Agent</option>
                            <option value="others">Others</option>
                          </select>
                       </div>
		       <div className="mb-3">
                          <label htmlFor="businessLocation" className="form-label">Company Location:</label>
                          <input type="text" className="form-control" id="businessLocation" name="businessLocation" placeholder="City, Country e.g Abuja, Nigeria" value={formData.businessLocation} onChange={handleChange} required />
                       </div>
                          <button type="submit" className="btn btn-primary w-100">Create Account</button>
                    </form>
                    <div className="text-center mt-3">
                       Already have an account? <Link className="nav-link btn btn-primary" as={Link} to="/login">Log In</Link>
                    </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
    );
}
