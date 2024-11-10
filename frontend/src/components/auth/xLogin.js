import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link from react-router-dom
import AuthContext from "../context/AuthProvider";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
/*import axios from "./../../api/axios";*/
import login from "../../assets/login.png";
import logo from "../../assets/logo.png";

/*const LOGIN_URL = '/api/login';*/

export default function Login({ toggleForm }) {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Password validation states
  const [validLength, setValidLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasLetter, setHasLetter] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);

  useEffect(() => {
    setErrMsg('');
    // Password validation checks
    const validatePassword = (value) => {
      if (value.length >= 8) {
        setValidLength(true);
      } else {
        setValidLength(false);
      }
      if (/\d/.test(value)) {
        setHasNumber(true);
      } else {
        setHasNumber(false);
      }
      if (/[a-zA-Z]/.test(value)) {
        setHasLetter(true);
      } else {
        setHasLetter(false);
      }
      if (/[A-Z]/.test(value)) {
        setHasUppercase(true);
      } else {
        setHasUppercase(false);
      }
      if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        setHasSpecialChar(true);
      } else {
        setHasSpecialChar(false);
      }
    };

    validatePassword(password);
  }, [password]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setPasswordFocused(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      const data = {
        email,
        role,
        password,
      };
      fetch("http://localhost:5000/api/login", {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.Stringify(data)
      }).then((response) => {
        const accessToken = response?.data.accessToken;
        const userRole = response?.data.role;
      })

      setAuth({ email, password, role: userRole, accessToken });
      setEmail('');
      setPassword('');
      navigate('/home/messages');
    } catch (err) {
      console.log("LOGIN ERROR", err);
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing email or password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
    }
  };


  return (
    <div className="flex h-screen">
      <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${login})` }}>
      </div>
      <form className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gray-300" onSubmit={handleSubmit}>
        <img src={logo} alt="Logo" className="w-20 h-auto mx-auto mt-10" />
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-600 mt-6">
          <FaUser className="w-6 h-6" />
        </div>
        <p className="text-center text-2xl font-semibold mt-4 mb-6">LOGIN</p>
        <div className="mb-4 relative">
          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4 relative">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Password"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
          </span>
        </div>
        {passwordFocused && (
          <div className="text-sm text-gray-600 mb-2">
            Password must contain:
            <ul className="list-disc ml-4">
              <li className={`flex items-center text-${validLength ? 'green' : 'red'}-500`}>
                {validLength ? <FaCheck className="mr-2" /> : <FaTimes className="mr-2" />}
                At least 8 characters
              </li>
              <li className={`flex items-center text-${hasNumber ? 'green' : 'red'}-500`}>
                {hasNumber ? <FaCheck className="mr-2" /> : <FaTimes className="mr-2" />}
                At least 1 number
              </li>
              <li className={`flex items-center text-${hasLetter ? 'green' : 'red'}-500`}>
                {hasLetter ? <FaCheck className="mr-2" /> : <FaTimes className="mr-2" />}
                At least 1 letter
              </li>
              <li className={`flex items-center text-${hasUppercase ? 'green' : 'red'}-500`}>
                {hasUppercase ? <FaCheck className="mr-2" /> : <FaTimes className="mr-2" />}
                At least 1 uppercase letter
              </li>
              <li className={`flex items-center text-${hasSpecialChar ? 'green' : 'red'}-500`}>
                {hasSpecialChar ? <FaCheck className="mr-2" /> : <FaTimes className="mr-2" />}
                At least 1 special character
              </li>
            </ul>
          </div>
        )}
        <div className="mb-4">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            name="role"
            id="role"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="" disabled>Select role</option>
            <option value="admin">Admin</option>
            <option value="tenant">Tenant</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-32 bg-[#20B2AA] text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600 mb-4"
        >
          Sign In
        </button>
        {errMsg && <p className="text-center text-red-500">{errMsg}</p>}
        <div className="flex items-center justify-center mt-4">
          <input
            id="keepSignedIn"
            name="keepSignedIn"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="keepSignedIn" className="ml-2 text-sm text-gray-900">
            Keep me signed in
          </label>
          <Link to="/forget-password" className="text-sm pl-8 underline text-indigo-600 hover:underline">
            Forgotten password?
          </Link>
        </div>
      </form>
    </div>
  );
}
