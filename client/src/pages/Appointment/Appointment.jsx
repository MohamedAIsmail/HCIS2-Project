import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../layout/Navbar/Navbar";
import Sidebar from "../../layout/Sidebar/Sidebar";
import "../Patient/styles.css";

const Appointment = () => {
    const patientId = window.location.pathname.split("/")[2];
    const doctorId = window.location.pathname.split("/")[3];

    const [Appointments, setAppointments] = useState([
        {
            requestedStartDateTimeRange: "",
            _id: "",
        },
    ]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/v1/appointment/${patientId}/${doctorId}`
                );
                const appointments = response.data.schedule.filter(
                    (appointment) => !appointment.booked
                );
                setAppointments(appointments);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            }
        };

        fetchAppointments();
    }, []);

    const handleClick = async (appointmentId) => {
        await axios.put(
            `http://localhost:8000/api/v1/patient/${patientId}/${doctorId}/${appointmentId}`,
            {
                booked: true,
                patientID: patientId,
            }
        );

        window.location.reload();
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex flex-1">
                <div className="w-1/6">
                    <Sidebar />
                </div>
                <div className="container">
                    <h1 className="title">Available Appointments</h1>
                    <div id="appointments-list" className="card-container">
                        {Appointments.map((appointment) => (
                            <div className="card">
                                <div class="info">
                                    <span class="key">Appointment Time:</span>
                                    <span class="value">
                                        {
                                            appointment.requestedStartDateTimeRange.split(
                                                "T"
                                            )[1]
                                        }
                                    </span>
                                </div>
                                <div class="info">
                                    <span class="key">Appointment Date:</span>
                                    <span class="value">
                                        {
                                            appointment.requestedStartDateTimeRange.split(
                                                "T"
                                            )[0]
                                        }
                                    </span>
                                </div>
                                <button
                                    class="book-appointment"
                                    onClick={() => handleClick(appointment._id)}
                                >
                                    Book
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Appointment;
