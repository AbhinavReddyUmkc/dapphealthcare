import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import '../App.css';

const DoctorPage = () => {
  // State for managing appointments, doctor ID, and blockchain interaction
  const [appointments, setAppointments] = useState([]);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [doctorId, setDoctorId] = useState('');

  // Replace with your contract address and ABI
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


  useEffect(() => {
    const connectWallet = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        setProvider(provider);
        setSigner(signer);

        const accountAddress = await signer.getAddress();
        setAccount(accountAddress);

        const contractInstance = new ethers.Contract(contractAddress, abi, signer);
        setContract(contractInstance);
      } catch (error) {
        console.error('Error connecting to wallet: ', error);
      }
    };
    connectWallet();
  }, []);

  // Fetch appointments for the given doctor ID
  const fetchAppointments = async () => {
    if (!contract || !doctorId) return;

    try {
      // Call the smart contract method to get all appointments for the doctor
      const appointmentsData = await contract.getDoctorAppointments(doctorId);
      
      // Map appointments data to a more usable format
      const formattedAppointments = appointmentsData.map(app => ({
        id: app.id.toNumber(),
        patient: app.patientAddress, // You might replace this with actual patient name if available
        ailment: app.ailment,
        description : app.description,
        date : new Date(app.date.toNumber() * 1000).toLocaleDateString(),
        status: app.status === 0 ? 'Pending' : app.status === 1 ? 'Accepted' : 'Rejected'
      }));

      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleAccept = async (id) => {
    if (!contract) return;

    try {
      const tx = await contract.updateAppointmentStatus(id, 1); // 1 for Accepted status
      await tx.wait();
      alert(`Appointment ${id} accepted!`);
      fetchAppointments(); // Refresh appointments after status update
    } catch (error) {
      console.error('Error accepting appointment:', error);
      alert('Failed to accept appointment.');
    }
  };

  const handleReject = async (id) => {
    if (!contract) return;

    try {
      const tx = await contract.updateAppointmentStatus(id, 2); // 2 for Rejected status
      await tx.wait();
      alert(`Appointment ${id} rejected.`);
      fetchAppointments(); // Refresh appointments after status update
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      alert('Failed to reject appointment.');
    }
  };

  const toggleUpcoming = () => {
    setShowUpcoming((prev) => !prev);
  };

  return (
    <div className="doctor-page">
      <h2>Doctor Dashboard</h2>
    <br></br>
      <input
        type="text"
        placeholder="Enter Doctor ID"
        value={doctorId}
        onChange={(e) => setDoctorId(e.target.value)}
        className="doctor-id-input"
      />
      <button className="fetch-appointments-button" onClick={fetchAppointments}>Fetch Appointments</button>
    <br></br>
      <button onClick={toggleUpcoming} className="upcoming-button">
        {showUpcoming ? 'Hide Upcoming Appointments' : 'View Upcoming Appointments'}
      </button>

      {showUpcoming ? (
        <div className="upcoming-appointments">
          <h3>Upcoming Appointments</h3>
          <ul>
            {appointments
              .filter((app) => app.status === 'Accepted')
              .map((app) => (
                <li key={app.id} className="appointment accepted">
                  <p>Patient: {app.patient}</p>
                  <p>Ailment: {app.ailment}</p>
                  <p> Description : {app.description}</p>
                  <p> Date : {app.date}</p>
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <div className="appointment-requests">
          <h3>Appointment Requests</h3>
          <ul className="appointment-list">
            {appointments
              .filter((app) => app.status === 'Pending')
              .map((app) => (
                <li key={app.id} className="appointment pending">
                  <p>Patient: {app.patient}</p>
                  <p>Ailment: {app.ailment}</p>
                  <p>Description : {app.description}</p>
                  <p>Date : {app.date}</p>
                  <div className="actions">
                    <button onClick={() => handleAccept(app.id)}>Accept</button>
                    <button onClick={() => handleReject(app.id)}>Reject</button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DoctorPage;
