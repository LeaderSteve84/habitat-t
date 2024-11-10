import React, { useState } from "react";
import login from "../../assets/login.jpg";
import Login from "./Login";
import ForgottenPassword from "./ForgottenPassword";

export default function Authentication() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="w-full h-screen flex  items-start">
      <div className="background w-1/2 h-screen relative flex flex-col">
        <img
          src={login}
          alt="Login Image"
          className="w-full h-full object-cover"
        
        />
      </div>
      {isLogin ? (
        <Login toggleForm={toggleForm} />
      ) : (
        <ForgottenPassword toggleForm={toggleForm} />
      )}
    </div>
  );
}
