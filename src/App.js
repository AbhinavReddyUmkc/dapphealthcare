import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import DoctorLogin from "./components/DoctorLogin";
import PatientLogin from "./components/PatientLogin";
import DoctorPage from "./components/DoctorPage";
import PatientPage from "./components/PatientPage";
import AddDoctor from "./components/AddDoctor";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Route for the landing page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Route for doctor login */}
        <Route path="/doctor-login" element={<DoctorLogin />} />
        
        {/* Route for patient login */}
        <Route path="/patient-login" element={<PatientLogin />} />
        
        {/* Route for the doctor's dashboard page */}
        <Route path="/doctor-page" element={<DoctorPage />} />
        
        {/* Route for the patient's dashboard page */}
        <Route path="/patient-page" element={<PatientPage />} />

        {/* Route for the patient's dashboard page */}
        <Route path="/add-doctor" element={<AddDoctor />} />
      </Routes>
    </div>
  );
}

export default App;
