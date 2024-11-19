// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthcareApp {

    enum AppointmentStatus { Pending, Accepted, Rejected }

    struct Doctor {
        uint id;
        string name;
        string specialization;
        string experience;
        string description;
        string achievements;
        address doctorAddress;
    }

    struct Patient {
        address patientAddress;
        string name;
        string phone;
    }

    struct Appointment {
        uint id;
        address patientAddress;
        uint doctorId;
        string ailment;
        string description;
        uint date; // Unix timestamp for the appointment date
        AppointmentStatus status;
    }

    // State variables
    uint public appointmentCount = 0;
    mapping(uint => Doctor) public doctors;
    mapping(address => Patient) public patients;
    mapping(uint => Appointment) public appointments;

    // Events
    event PatientRegistered(address patientAddress, string name);
    event AppointmentRequested(uint appointmentId, address patientAddress, uint doctorId, uint date);
    event AppointmentStatusChanged(uint appointmentId, AppointmentStatus status);

    constructor() {
        doctors[1] = Doctor(
            1,
            "Dr. John Doe",
            "Psychology",
            "10 years in Psychology",
            "Specializes in mental health and counseling.",
            "Published 20 research papers on mental health.", 
            msg.sender
        );

        doctors[2] = Doctor(
            2,
            "Dr. Sarah Smith",
            "Orthopedics",
            "8 years in Orthopedics",
            "Expert in orthopedic surgeries and treatments.",
            "Developed innovative techniques in orthopedic surgery.", 
            msg.sender
        );

        doctors[3] = Doctor(
            3,
            "Dr. Kevin Brown",
            "Neurology",
            "12 years in Neurology",
            "Expert in neurological disorders and neurodegenerative diseases.",
            "Published groundbreaking research on Alzheimer's disease.",
            msg.sender
        );
    }

    function registerPatient(string memory _name, string memory _phone) public {
        patients[msg.sender] = Patient(msg.sender, _name, _phone);
        emit PatientRegistered(msg.sender, _name);
    }

    function requestAppointment(
        uint _doctorId,
        string memory _ailment,
        string memory _description,
        uint _date // New parameter for appointment date
    ) public {
        require(doctors[_doctorId].doctorAddress != address(0), "Doctor does not exist");
        appointmentCount++;

        appointments[appointmentCount] = Appointment(
            appointmentCount,
            msg.sender,
            _doctorId,
            _ailment,
            _description,
            _date,
            AppointmentStatus.Pending
        );

        emit AppointmentRequested(appointmentCount, msg.sender, _doctorId, _date);
    }

    function getDoctorAppointments(uint _doctorId) public view returns (Appointment[] memory) {
        uint count = 0;
        for (uint i = 1; i <= appointmentCount; i++) {
            if (appointments[i].doctorId == _doctorId) {
                count++;
            }
        }

        Appointment[] memory result = new Appointment[](count);
        uint index = 0;
        for (uint i = 1; i <= appointmentCount; i++) {
            if (appointments[i].doctorId == _doctorId) {
                result[index] = appointments[i];
                index++;
            }
        }

        return result;
    }

    function updateAppointmentStatus(uint _appointmentId, AppointmentStatus _status) public {
        Appointment storage appointment = appointments[_appointmentId];
        appointment.status = _status;
        emit AppointmentStatusChanged(_appointmentId, _status);
    }

    function getPatientAppointments() public view returns (Appointment[] memory) {
        uint count = 0;
        for (uint i = 1; i <= appointmentCount; i++) {
            if (appointments[i].patientAddress == msg.sender) {
                count++;
            }
        }

        Appointment[] memory result = new Appointment[](count);
        uint index = 0;
        for (uint i = 1; i <= appointmentCount; i++) {
            if (appointments[i].patientAddress == msg.sender) {
                result[index] = appointments[i];
                index++;
            }
        }

        return result;
    }

    function getAppointmentStatus(uint _appointmentId) public view returns (AppointmentStatus) {
        require(_appointmentId > 0 && _appointmentId <= appointmentCount, "Invalid appointment ID");
        return appointments[_appointmentId].status;
    }
}
