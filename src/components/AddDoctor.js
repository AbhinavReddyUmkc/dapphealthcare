import React, { useState } from "react";
import "../App.css";

const AddDoctor = () => {
  const [doctorData, setDoctorData] = useState({
    name: "",
    experience: "",
    description: "",
    achievements: "",
    picture: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setDoctorData((prevState) => ({
      ...prevState,
      picture: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, you can handle form submission, e.g., sending data to a backend
    console.log("Doctor Data Submitted:", doctorData);
    alert("Doctor added successfully!");
  };

  return (
    <div className="login-container">
      <h2>Add Doctor</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter doctor's name"
          value={doctorData.name}
          onChange={handleChange}
          required
        />

        <label>Experience</label>
        <input
          type="text"
          name="experience"
          placeholder="Enter years of experience"
          value={doctorData.experience}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          placeholder="Enter a short description"
          value={doctorData.description}
          onChange={handleChange}
          required
        ></textarea>

        <label>Achievements</label>
        <textarea
          name="achievements"
          placeholder="Enter achievements"
          value={doctorData.achievements}
          onChange={handleChange}
          required
        ></textarea>

        <label>Upload Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
        />

        <button type="submit">Add Doctor</button>
      </form>
    </div>
  );
};

export default AddDoctor;
