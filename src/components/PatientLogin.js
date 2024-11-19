import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const PatientLogin = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate successful login
    navigate("/patient-page");
  };

  return (
    <div className="login-container">
      <h2>Patient Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <label>Username</label>
        <input type="text" placeholder="Enter your username" required />
        
        <label>Password</label>
        <input type="password" placeholder="Enter your password" required />
        
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default PatientLogin;