import React, { useState } from "react";
import logo from "../../assets/logo.png";
import forgot from "../../assets/forgot-password.avif";
import { FaUnlock, FaUser } from 'react-icons/fa';

const FORGET_PASSWORD_URL = '/api/forgot_password';

export default function ForgetPassword({ toggleForm }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  
    const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    console.log('Sending request to:', FORGET_PASSWORD_URL); 
    console.log('Request body:', JSON.stringify({ email }));
    try {
      const response = await fetch(FORGET_PASSWORD_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('Response status:', response.status);

      setLoading(false);

      if (response.ok) {
        const data = await response.json();
        setMessage(data.msg);
      } else {
        let errorData = { msg: 'Failed to recover password' };
        try {
          const errorText = await response.text();
          if (errorText) {
            errorData = JSON.parse(errorText);
          }
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        setMessage(errorData.msg || 'Failed to recover password');
      }

      // Handle success, e.g., show a success message or redirect
      console.log('Password recovery request successful', email);
    } catch (error) {
      setLoading(false);
      setMessage(`Error: ${error.message}`);
      console.error('Error recovering password:', error); // Log the error
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="w-1/2">
        <img src={forgot} alt="Forgot Password" className="w-full h-full object-cover" />
      </div>
      <div className="flex-grow w-1/2 flex items-center justify-center bg-gray-300">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <img src={logo} alt="Logo" className="w-20 h-auto mx-auto mt-4" />
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-200 text-gray-600 mx-auto mt-2">
            <FaUnlock className="w-10 h-10 text-xl font-bold stroke-width-4 stroke-red" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mt-4">Forgot Password</h2>
          <div className="mb-4 mt-10">
            <label htmlFor="email" className="block text-sm font-bold text-gray-700">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm mt-1">
              <div className="p-2 bg-gray-200 rounded-l-md">
                <FaUser className="text-gray-600" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-64 mx-auto block bg-[#20B2AA] text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600 mb-4"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Recover Password'}
          </button>
          {message && (
            <div className={`mt-4 text-center ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
