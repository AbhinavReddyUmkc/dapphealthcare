import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import doctor1Image from '../assets/Screenshot 2024-11-11 at 9.31.02 PM.png';
import doctor2Image from '../assets/Screenshot 2024-11-11 at 9.31.28 PM.png';
import doctor3Image from '../assets/doctor3.png';
import '../App.css';

// Predefined doctors
const doctors = [
  {
    id: 1,
    name: 'Dr. John Doe',
    experience: '10 years in Psychology',
    description: 'Specializes in mental health and counseling.',
    achievements: ['Published 20 research papers on mental health.', 'Awarded "Best Psychologist" in 2020.'],
    image: doctor1Image,
  },
  {
    id: 2,
    name: 'Dr. Sarah Smith',
    experience: '8 years in Orthopedics',
    description: 'Expert in orthopedic surgeries and treatments.',
    achievements: ['Developed innovative techniques in orthopedic surgery.', 'Recognized as "Top Orthopedic Surgeon" in 2021.'],
    image: doctor2Image,
  },
  {
    id: 3,
    name: 'Dr. Kevin Brown',
    experience: '12 years in Neurology',
    description: 'Expert in neurological disorders and neurodegenerative diseases.',
    achievements: ['Published groundbreaking research on Alzheimer\'s disease.', 'Neurologist of the Year award winner.'],
    image: doctor3Image,
  },
];

const PatientPage = () => {
  const navigate = useNavigate();

  // State variables for form data
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [ailment, setAilment] = useState('');
  const [description, setDescription] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(''); // New state for appointment date

  // State variables for blockchain interaction
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [appointmentId, setAppointmentId] = useState('');
  const [status, setStatus] = useState('');

  const statusText = ["Pending", "Accepted", "Rejected"];

  // Replace these with your contract details
  const contractAddress = '0x0Bd7030c9EA4E8Cd6604E39d4a1601ddDC1630E6';
  const abi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "patientAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            }
        ],
        "name": "PatientRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "appointmentId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "patientAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "doctorId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "date",
                "type": "uint256"
            }
        ],
        "name": "AppointmentRequested",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "appointmentId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "status",
                "type": "uint8"
            }
        ],
        "name": "AppointmentStatusChanged",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "appointmentCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_doctorId",
                "type": "uint256"
            }
        ],
        "name": "getDoctorAppointments",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "patientAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "doctorId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "ailment",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "date",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum HealthcareApp.AppointmentStatus",
                        "name": "status",
                        "type": "uint8"
                    }
                ],
                "internalType": "struct HealthcareApp.Appointment[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getPatientAppointments",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "patientAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "doctorId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "ailment",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "date",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum HealthcareApp.AppointmentStatus",
                        "name": "status",
                        "type": "uint8"
                    }
                ],
                "internalType": "struct HealthcareApp.Appointment[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_appointmentId",
                "type": "uint256"
            },
            {
                "internalType": "enum HealthcareApp.AppointmentStatus",
                "name": "_status",
                "type": "uint8"
            }
        ],
        "name": "updateAppointmentStatus",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_phone",
                "type": "string"
            }
        ],
        "name": "registerPatient",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_doctorId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_ailment",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_date",
                "type": "uint256"
            }
        ],
        "name": "requestAppointment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_appointmentId",
                "type": "uint256"
            }
        ],
        "name": "getAppointmentStatus",
        "outputs": [
            {
                "internalType": "enum HealthcareApp.AppointmentStatus",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];


  // Initialize provider, signer, and contract on component mount
  useEffect(() => {
    const initializeBlockchain = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        setProvider(provider);
        setSigner(signer);

        const contract = new ethers.Contract(contractAddress, abi, signer);
        setContract(contract);
      } catch (error) {
        console.error('Error connecting to blockchain:', error);
      }
    };
    initializeBlockchain();
  }, []);

  const handleRequestAppointment = async (e) => {
    e.preventDefault();
    if (!contract) return;

    try {
      // Convert the selected date to a Unix timestamp
      const dateTimestamp = Math.floor(new Date(appointmentDate).getTime() / 1000);

      // Calling requestAppointment function on the contract
      const tx = await contract.requestAppointment(
        selectedDoctor.id,
        ailment,
        description,
        dateTimestamp // Include the appointment date as a Unix timestamp
      );
      await tx.wait();
      alert('Appointment requested successfully!');

      // Listen for the AppointmentRequested event
      contract.on("AppointmentRequested", (appointmentId, patientAddress, doctorId) => {
        setAppointmentId(appointmentId.toString());
        alert(`Appointment requested successfully! Your Appointment ID is ${appointmentId}`);
        // Clear event listener after receiving event to avoid duplicate listeners
        contract.off("AppointmentRequested");
      });

      // Clear form fields
      setSelectedDoctor(null);
      setAilment('');
      setDescription('');
      setPatientName('');
      setPatientPhone('');
      setAppointmentDate(''); // Clear date field
    } catch (error) {
      console.error('Error requesting appointment:', error);
      alert('Failed to request appointment.');
    }
  };

  // Function to check appointment status
  const handleCheckStatus = async () => {
    if (!contract) return;

    try {
      // Calling getAppointmentStatus function on the contract
      const appointmentStatus = await contract.getAppointmentStatus(appointmentId);
      setStatus(appointmentStatus);
    } catch (error) {
      console.error('Error fetching appointment status:', error);
      alert('Failed to fetch appointment status.');
    }
  };

  return (
    <div className="patient-page">
      <h2>Request an Appointment</h2>
      <button className="back-to-home-button" onClick={() => navigate('/')}>Back to Home</button>

      <form className="appointment-form" onSubmit={handleRequestAppointment}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          required
        />

        <label>Phone Number</label>
        <input
          type="tel"
          name="phone"
          placeholder="Enter your phone number"
          value={patientPhone}
          onChange={(e) => setPatientPhone(e.target.value)}
          required
        />

        <label>Select Doctor</label>
        <select
          value={selectedDoctor ? selectedDoctor.id : ''}
          onChange={(e) => {
            const doctor = doctors.find((doc) => doc.id === parseInt(e.target.value));
            setSelectedDoctor(doctor || null);
          }}
        >
          <option value="">Choose a doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>

        {selectedDoctor && (
          <div className="doctor-details">
            <img src={selectedDoctor.image} alt={selectedDoctor.name} className="doctor-image" />
            <h3>{selectedDoctor.name}</h3>
            <p>{selectedDoctor.experience}</p>
            <p>{selectedDoctor.description}</p>
            <ul>
              {selectedDoctor.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
        )}

        <label>Ailment</label>
        <select value={ailment} onChange={(e) => setAilment(e.target.value)}>
          <option value="">Select an ailment</option>
          <option value="Psychology Issue">Psychology Issue</option>
          <option value="Orthopedic Issue">Orthopedic Issue</option>
          <option value="Nervous System Issue">Nervous System Issue</option>
        </select>

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your ailment"
        ></textarea>

        <label>Appointment Date</label>
        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          required
        />

        <button type="submit">Request Appointment</button>
      </form>

      <div className="check-status-section">
        <h3>Check Appointment Status</h3>
        <label>Appointment ID</label>
        <input
          type="text"
          placeholder="Enter Appointment ID"
          value={appointmentId}
          onChange={(e) => setAppointmentId(e.target.value)}
        />
        <button onClick={handleCheckStatus}>Check Status</button>
        <p>Status: {statusText[status]}</p>
      </div>
    </div>
  );
};

export default PatientPage;
