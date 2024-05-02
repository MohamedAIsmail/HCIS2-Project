import React, { useEffect, useState } from "react";
import Navbar from "../../layout/Navbar/Navbar";
import Sidebar from "../../layout/Sidebar/Sidebar";
import AddAppointment from "./AddAppointment";
import Popup from "reactjs-popup";
import { useParams } from "react-router-dom";
import { fetchHL7AppointmentsDataThunk } from "./appointment-slice";
import { useDispatch, useSelector } from "react-redux";
import { TAppDispatch } from "../../redux/store";
import { RootState } from '../../redux/store';
import axios from 'axios';
interface PatientNames {
    [key: string]: string;
}
interface PatientDataMap {
    [key: string]: PatientData;
}

interface PatientData {
    username: string;
    email: string;
    password: string;
    role: string;
    name: string;
    ssnNumberPatient: string;
    phoneNumber: string;
    weight: number;
    height: number;
    age: number;
    gender: string;
    emergencyContacts: Array<any>;  
    medicalHistory: any;  
}

interface Appointment {
    appointmentReason: string;
    appointmentDuration: string;
    requestedStartDateTimeRange: string;
    priorityARQ: string;
    repeatingInterval: string;
    repeatingIntervalDuration: string;
    placerContactPerson: string;
    PlacerContactPhoneNumber: string;
    booked: boolean;
    _id: string;
    createdAt: string;
    updatedAt: string;
    patientID?: string;
}

const Doctor = () => {
const [expandedRow, setExpandedRow] = useState<string | null>(null);
const [hoveredRow, setHoveredRow] = useState<string | null>(null);

    const [patientData, setPatientData] = useState<PatientDataMap>({});
    const [patientNames, setPatientNames] = useState<PatientNames>({});
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };
    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };
    const { doctorId } = useParams();
    const dispatch = useDispatch<TAppDispatch>();
    const appointments = useSelector((state: RootState) => state.appointments as Appointment[] || []);
    useEffect(() => {
        if (doctorId) {
            dispatch(fetchHL7AppointmentsDataThunk(String(doctorId)));
        }
    }, [dispatch, doctorId ,appointments]);

    useEffect(() => {
        appointments.forEach(appointment => {
            console.log(`Appointment ID: ${appointment._id}, Booked: ${appointment.booked}, Patient ID: ${appointment.patientID}`); // This will confirm what data you are working with.
            if (appointment.booked && appointment.patientID) {
                console.log('alo00')
                const patientId = appointment.patientID;
                if (!patientNames[patientId]) {

                    axios.get(`http://localhost:8000/api/v1/patient/${patientId}`)
                        .then(response => {
                            const patientInfo = response.data.patient;
                            setPatientData(prev => ({
                                ...prev,
                                [patientId]: patientInfo
                            }));
                            
                        const name = response.data.patient.name;
                            setPatientNames(prev => ({ ...prev, [patientId]: name }));
                        })
                        .catch(error => console.error("Failed to fetch patient name:", error));
                }
            }
        });
    }, [appointments]);

    return (
        <div className="h-screen">
            <div className="h-[calc(7%)]">
                <Navbar />
            </div>
            <div className="flex h-[calc(93%)]">
                <div>
                    <Sidebar />
                </div>
                <div className="w-5/6 p-4">
                    <header className="text-center py-4">
                        <h1 className="text-2xl font-bold">Doctor Appointments</h1>
                    </header>
                    <div className="overflow-x-auto mt-6">
                        <table className="min-w-full leading-normal">
                        <thead>
    <tr>
        <th className="px-5 py-3 border-b-2 border-gray-300 bg-blue-600 text-left text-xs font-semibold text-white uppercase tracking-wider">
            Patient Name
        </th>
        <th className="px-5 py-3 border-b-2 border-gray-300 bg-blue-600 text-left text-xs font-semibold text-white uppercase tracking-wider">
            Appointment Date & Time
        </th>
        <th className="px-5 py-3 border-b-2 border-gray-300 bg-blue-600 text-left text-xs font-semibold text-white uppercase tracking-wider">
            Duration
        </th>
        <th className="px-5 py-3 border-b-2 border-gray-300 bg-blue-600 text-left text-xs font-semibold text-white uppercase tracking-wider">
            Priority
        </th>
        <th className="px-5 py-3 border-b-2 border-gray-300 bg-blue-600 text-left text-xs font-semibold text-white uppercase tracking-wider">
            Reason
        </th>
        <th className="px-5 py-3 border-b-2 border-gray-300 bg-blue-600 text-left text-xs font-semibold text-white uppercase tracking-wider">
            Booking status
        </th>
    </tr>
</thead>
<tbody>
    {appointments.map((appointment, index) => (
        <React.Fragment key={index}>
            <tr
                onClick={() => {
                    if (appointment.patientID === expandedRow) {
                        setExpandedRow(null);
                    } else {
                        setExpandedRow(appointment.patientID ?? null);
                    }
                }}
                onMouseEnter={() => setHoveredRow(appointment.patientID?? null)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                    cursor: 'pointer',
                    backgroundColor: hoveredRow === appointment.patientID ? '#f5f5f5' : 'transparent'
                }}
            >
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {appointment.booked ? patientNames[appointment.patientID ?? ''] || 'Loading...' : ''}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {appointment.requestedStartDateTimeRange}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {appointment.appointmentDuration}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {appointment.priorityARQ}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {appointment.appointmentReason}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {appointment.booked ? 'Booked' : 'Available'}
                </td>
            </tr>
            {expandedRow === appointment.patientID && (
                <tr style={{ backgroundColor: '#f0f0f0' }}> 
                    <td colSpan={6} className="p-4">
                        <div className="text-sm leading-5 text-gray-900">
                            <strong>Email:</strong> {patientData[appointment.patientID]?.email}
                            <br />
                            <strong>Phone:</strong> {patientData[appointment.patientID]?.phoneNumber}
                            <br />
                            <strong>Age:</strong> {patientData[appointment.patientID]?.age}
                            <br />
                            <ul>
                            {Object.entries(patientData[appointment.patientID]?.medicalHistory).map(([key, value]: [string, any]) => (
                                <li key={key}>
                                <strong>{key}:</strong> {value}
                                </li>
                            ))}
                            </ul>

                            <br />
                        </div>
                    </td>
                </tr>
            )}
        </React.Fragment>
    ))}
</tbody>


                        </table>
                    </div>

                    <div className="flex justify-center mt-4">
                        <Popup
                            contentStyle={{
                                width: "100%",
                                maxWidth: "28rem", // Adjusted for potentially more space
                                padding: 0,
                                borderRadius: "12px",
                            }}
                            trigger={
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Add Appointment
                                </button>
                            }
                            position="center center"
                            closeOnDocumentClick={false}
                            closeOnEscape={false}
                            repositionOnResize={true}
                            modal
                            overlayStyle={{
                                background: "rgba(0, 0, 0, 0.75)", // Slightly darker overlay for better focus on the popup
                            }}
                            open={isPopupOpen}
                            onOpen={handleOpenPopup}
                            onClose={handleClosePopup}
                        >
                            <AddAppointment onClose={handleClosePopup} />
                        </Popup>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Doctor;
