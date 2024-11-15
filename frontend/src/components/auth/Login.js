import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('tenant');
    const [rememberMe, setRememberMe] = useState(false);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', {
                email,
                password,
                role,
                remember_me: rememberMe,
            });
            const { msg } = response.data;
            setMessage({msg: msg?.toString()});
            navigate('/TenantDashboard');

        } catch (error) {
            setMessage({ error: error.response?.data?.error || "Login failed. Please try again." });
        }
    };

    return (
        <div className="container mt-5">
           <div className="row justify-content-center">
              <div className="col-md-6">
                 <div className="card shadow-lg">
                    <div className="card-body">
                    <h3 className="card-title text-center mb-4">Login</h3>
                    { message && (
                            <>
                            { message.msg && <div className="alert alert-info">{message.msg}</div> }
                            { message.error && <div className="alert alert-danger">{message.error}</div> }
                            </>
                    )}
                    <form onSubmit={handleLogin}>
                       <div className="mb-3">
                          <label htmlFor="email" className="form-label">Email</label>
                          <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                       </div>
                       <div className="mb-3">
                          <label htmlFor="password" className="form-label">Password</label>
                          <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                       </div>
                       <div className="mb-3">
                          <label htmlFor="role" className="form-label">Role</label>
                          <select className="form-select" id="role" value={role} onChange={(e) => setRole(e.target.value)} required >
                             <option value="tenant">Tenant</option>
                             <option value="admin">Admin</option>
                          </select>
                       </div>
                       <div className="form-check mb-3">
                          <input type="checkbox" className="form-check-input" id="rememberMe" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                          <label className="form-check-label" htmlFor="rememberMe">Remember Me</label>
                       </div>
                          <button type="submit" className="btn btn-primary w-100">Login</button>
                    </form>
                    <div className="text-center mt-3">
                       <Link className="nav-link" as={Link} to="/forgot_password">Forgot Password?</Link>
                    </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
    );
}
