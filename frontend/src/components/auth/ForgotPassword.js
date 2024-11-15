import { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/forgot_password", {email});
      const {msg} = response.data;
      setMessage({msg: msg?.toString() });
      navigate("/");

    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error sending reset link. Try again";
      setMessage({error: errorMessage});
    }
  };

  return (
    <div className="container mt-5">
       <div className="row justify-content-center">
         <div  className="col-md-6">
           <div className="card shadow-lg">
             <div className="card-body">
             <h3 className="card-title text-center mb-4">Forgot Password</h3>
             {message && (
               <div>
                 {message.msg && <div className="alert alert-info">{message.msg}</div>}
                 {message.error && <div className="alert alert-danger">{message.error}</div>}
               </div>
             )}
             <form onSubmit={handleSubmit}>
               <label className="form-label">Email</label>
               <div>
                 <input type="email" className="form-control" value={email} required onChange={e => setEmail(e.target.value)} placeholder="enter your registered email" />
               </div>
               <button type="submit" className="btn btn-primary mt-3 w-100">Submit</button>
             </form>
             </div>
           </div>
         </div>
       </div>
    </div>
  );
}

export default ForgotPassword;
