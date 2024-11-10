import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  console.log(token);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/reset_password/${token}`, { newPassword, confirmPassword });
      setMessage("Password reset successfully");
      console.log(response.data);
    } catch (error) {
      console.log("Error resetting password:", error);
      setMessage("Error resetting password. Please try again");
    }
  };

  return (
    <div className="container mt-5">
       <h2 className="text-center mb-4">Reset Password</h2>
       {message && <div className="alert alert-info">{message}</div>}
       <div className="row justify-content-center">
          <div className="col-md-6">
          <form onSubmit={handleResetPassword} className="p-4 border rounded">
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
       <p className="text-center">token: { token }</p>
    </div>
  );
}

export default ResetPassword;
