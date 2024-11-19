import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      
      <div className="content">
        <h2>Welcome to the Decentralized Healthcare Platform</h2>
        <p>Select an option to get started</p>
        
        <div className="login-options">
          <div className="login-box doctor-box" onClick={() => navigate("/doctor-login")}>
            <h3>Doctor Login</h3>
            <button>Login as Doctor</button>
          </div>
          
          <div className="login-box patient-box" onClick={() => navigate("/patient-login")}>
            <h3>Patient Login</h3>
            <button>Login as Patient</button>
          </div>

          <div className="login-box patient-box" onClick={() => navigate("/add-doctor")}>
            <h3>Add a doctor</h3>
            <button>Register a doctor</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
