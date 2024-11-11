import { useState } from 'react';
import axios from "axios";

function ForgotPassword() {

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/forgot_password", {email});
      if (response.status === 200) {
        const {msg} = response.data;
        setMessage({msg: msg?.toString() });
      } else if (response.status === 404) {
        const {msg} = response.data;
        setMessage({msg: msg?.toString() });
      } else {
        const {error} = response.data;
        setMessage({error: error?.toString() });
      }
    } catch (error) {
      const errorMessage = error.response?.error?.message || "Error sending reset link. Try again";
      setMessage({error: errorMessage});
    }
  };

  return (
    <div className="container mt-5">
         <h2 className="text-center mb-4">Forgot Password</h2>
         {message && (
              <div>
                 {message.msg && <div>{message.msg}</div>}
                 {message.error && <div>{message.error}</div>}
              </div>
         )}
         <div className="row justify-content-center">
            <div  className="col-md-6">
               <form onSubmit={handleSubmit} className="p-4 border">
                  <label className="form-label">Email</label>
                  <div>
                     <input type="email" className="form-control" value={email} required onChange={e => setEmail(e.target.value)} placeholder="enter your registered email" />
                  </div>
                  <button type="submit" className="btn btn-primary mt-3 w-100">Submit</button>
               </form>
            </div>
         </div>
    </div>
  );
}

export default ForgotPassword;
