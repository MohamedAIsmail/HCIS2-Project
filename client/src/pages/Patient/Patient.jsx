import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import './styles.css'; 

const Patient = () => {
    const navigate = useNavigate()
    const patientId = window.location.pathname.split("/")[2]
    const [Doctors, setDoctors] = useState([
        {
            name: '',
            specialization: '',
            _id: ''

        }
    ]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/healthcareProvider");
                setDoctors(response.data.healthcareProviders);
            }
            catch (error) {
                console.error("Error fetching doctors:", error);
            }
        }
        fetchDoctors();
    }, []);

    const handleClick = (doctorId) => {
        navigate(`/appointments/${patientId}/${doctorId}`);
    }

    return (
        <div className="container">
            <h1 className="title">Available Doctors</h1>
            <div id="doctors-list" className="card-container">
                {Doctors.map((doctor) => (
                    <div className="card">
                        <div className="info">
                            <span className="key">Name:</span>
                            <span className="value">{doctor.name}</span>
                        </div>
                        <div className="info">
                            <span className="key">Specialization:</span>
                            <span className="value">{doctor.specialization}</span>
                        </div>
                        <button className="book-appointment" onClick={() => handleClick(doctor._id)}>Book Appointment</button>
                    </div>
                ))}
        </div>
    </div>

    )
};

export default Patient;
