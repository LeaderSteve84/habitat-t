import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import useFetch from "../customHooks/useFetch";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/reset_password/${token}`, { newPassword, confirmPassword });

      const { msg, role, email, tenantId, address } = response.data;
      setMessage({ msg: msg?.toString() });

      if (role === "tenant") {

        try {
          const resp = await axios.get(`/api/tenant/profile/${tenantId}`);
          console.log(resp);
          navigate("/login");

        } catch (error) {
          if (error.response.status === 404 ) {
            const encodedAddress = encodeURIComponent(`${address}`);
            navigate(`/tenant_profile/${email}/${tenantId}/${encodedAddress}`);
          } else {
            console.error(error.response.data);
          }
        }

      } else {
        navigate("/login");
      }

    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error reseting password";
      setMessage({ error: errorMessage });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-body">
             <h3 className="card-title text-center mb-4">Reset Password</h3>
             {/* isPending && <div className="alert alert-info">Verifying if profile exist...</div>*/}
             {/* error && <div className="alert alert-info">error.error</div>*/}
             { message && (
                  <div>
                     {message.msg && <div className="alert alert-info">{message.msg}</div>}
                     {message.error && <div className="alert alert-danger">{message.error}</div>}
                  </div>
             )}
             <form onSubmit={handleResetPassword}>
                <div className="mb-3">
                   <label className="form-label">New Password</label>
                   <div>
                      <input type="password" className="form-control" value={newPassword} onChange={ (e) => setNewPassword(e.target.value) } required placeholder="Enter new password" />
                   </div>
                </div>
                <div className="mb-3">
                   <label className="form-label">Confirm Password</label>
                   <div>
                      <input type="password" className="form-control" value={confirmPassword} onChange={ (e) => setConfirmPassword(e.target.value) } required placeholder="Re-Enter new password" />
                   </div>
                </div>             
                <button type="submit" className="btn btn-primary w-100">Reset Password</button>
             </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
