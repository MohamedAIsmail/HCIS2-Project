import React, { useEffect, useState } from "react";
import Navbar from "../../layout/Navbar/Navbar";
import Sidebar from "../../layout/Sidebar/Sidebar";
import AddAppointment from "./AddAppointment";
import Popup from "reactjs-popup";
import { useParams } from "react-router-dom";
import { fetchHL7AppointmentsDataThunk } from "./appointment-slice";
import { useDispatch, useSelector } from "react-redux";
import { TAppDispatch } from "../../redux/store";
import { RootState } from "../../redux/store";
import axios from "axios";
import DicomImage from "../../components/DicomImage"; // Import the DicomImage component
import DicomViewer from "../../components/DicomViewer";
import dicomParser from 'dicom-parser';

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
    scanId?: string; // Add a field for DICOM image URL
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


const handleUploadDicom = (patientId: string) => async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async function () {
            // Parse DICOM data
            const byteArray = new Uint8Array(reader.result as ArrayBuffer);
            const dataSet = dicomParser.parseDicom(byteArray);

            // Extract patient ID from DICOM data
            const dicomPatientID = dataSet.string('x00100020');
            console.log("DICOM Patient ID:", dicomPatientID);

            try {
                // Fetch the current patient data
                const response = await axios.get(`http://localhost:8000/api/v1/patient/${patientId}`);
                const patientData = response.data.patient;
                console.log("Current patient data:", patientData.scanId);

                // Update or add the scanId field with the new DICOM patient ID
                patientData.scanId = dicomPatientID;

                console.log("Updated patient data:", patientData.scanId);

                // Save the updated patient data back to the database
                await axios.put(`http://localhost:8000/api/v1/patient/${patientId}`, patientData);
                console.log("scanId updated successfully.");

                // Perform upload logic here
                console.log("Uploading DICOM file:", file.name);

                // Send binary data in POST request body
                const uploadResponse = await fetch('http://localhost:80/orthanc/instances', {
                    method: 'POST',
                    body: byteArray
                });

                if (uploadResponse.ok) {
                    console.log('DICOM file uploaded successfully.');
                } else {
                    console.error('Failed to upload DICOM file.');
                }
            } catch (error) {
                console.error('Error handling DICOM upload:', error);
            }
        };
        reader.readAsArrayBuffer(file);
    }
};



const Doctor = () => {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);

    const [patientData, setPatientData] = useState<PatientDataMap>({});
    const [patientNames, setPatientNames] = useState<PatientNames>({});
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isDicomPopupOpen, setIsDicomPopupOpen] = useState(false);
    const [dicomImageUrl, setDicomImageUrl] = useState<string | null>(null);

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleOpenDicomPopup = (url: string) => {
        setDicomImageUrl(url);
        setIsDicomPopupOpen(true);
    };

    const handleCloseDicomPopup = () => {
        setIsDicomPopupOpen(false);
        setDicomImageUrl(null);
    };

    const { doctorId } = useParams();
    const dispatch = useDispatch<TAppDispatch>();
    const appointments = useSelector(
        (state: RootState) => (state.appointments as Appointment[]) || []
    );

    useEffect(() => {
        if (doctorId) {
            dispatch(fetchHL7AppointmentsDataThunk(String(doctorId)));
        }
    }, [dispatch, doctorId, appointments]);

    useEffect(() => {
        appointments.forEach((appointment) => {
            if (appointment.booked && appointment.patientID) {
                const patientId = appointment.patientID;
                if (patientId && !patientNames[patientId]) {
                    axios
                        .get(`http://localhost:8000/api/v1/patient/${patientId}`)
                        .then((response) => {
                            const patientInfo = response.data.patient;
                            setPatientData((prev) => ({
                                ...prev,
                                [patientId]: patientInfo,
                            }));

                            const name = response.data.patient.name;
                            setPatientNames((prev) => ({
                                ...prev,
                                [patientId]: name,
                            }));
                        })
                        .catch((error) =>
                            console.error(
                                "Failed to fetch patient name:",
                                error
                            )
                        );
                }
            }
        });
    }, [appointments]);

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex h-[calc(6%)]">
                <Navbar />
            </div>
            <div className="flex flex-1">
                <div className="w-1/6">
                    <Sidebar />
                </div>
                <div className="w-5/6 p-4">
                    <header className="text-center py-4">
                        <h1 className="text-2xl font-bold">
                            Doctor Appointments
                        </h1>
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
                                                if (
                                                    appointment.patientID ===
                                                    expandedRow
                                                ) {
                                                    setExpandedRow(null);
                                                } else {
                                                    setExpandedRow(
                                                        appointment.patientID ??
                                                            null
                                                    );
                                                }
                                            }}
                                            onMouseEnter={() =>
                                                setHoveredRow(
                                                    appointment.patientID ??
                                                        null
                                                )
                                            }
                                            onMouseLeave={() =>
                                                setHoveredRow(null)
                                            }
                                            style={{
                                                cursor: "pointer",
                                                backgroundColor:
                                                    hoveredRow ===
                                                    appointment.patientID
                                                        ? "#f5f5f5"
                                                        : "transparent",
                                            }}
                                        >
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {appointment.booked
                                                    ? patientNames[
                                                          appointment.patientID ??
                                                              ""
                                                      ] || "Loading..."
                                                    : ""}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {
                                                    appointment.requestedStartDateTimeRange
                                                }
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {
                                                    appointment.appointmentDuration
                                                }
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {appointment.priorityARQ}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {appointment.appointmentReason}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {appointment.booked
                                                    ? "Booked"
                                                    : "Available"}
                                            </td>
                                        </tr>
                                        {expandedRow ===
                                            appointment.patientID && (
                                            <tr
                                                style={{
                                                    backgroundColor: "#f0f0f0",
                                                }}
                                            >
                                                <td colSpan={6} className="p-4">
                                                    <div className="text-sm leading-5 text-gray-900">
                                                        <strong>Email:</strong>{" "}
                                                        {
                                                            patientData[
                                                                appointment
                                                                    .patientID!
                                                            ]?.email
                                                        }
                                                        <br />
                                                        <strong>
                                                            Phone:
                                                        </strong>{" "}
                                                        {
                                                            patientData[
                                                                appointment
                                                                    .patientID!
                                                            ]?.phoneNumber
                                                        }
                                                        <br />
                                                        <strong>
                                                            Age:
                                                        </strong>{" "}
                                                        {
                                                            patientData[
                                                                appointment
                                                                    .patientID!
                                                            ]?.age
                                                        }
                                                        <br />
                                                        <ul>
                                                            {Object.entries(
                                                                patientData[
                                                                    appointment
                                                                        .patientID!
                                                                ]
                                                                    ?.medicalHistory
                                                            ).map(
                                                                ([key, value]: [
                                                                    string,
                                                                    any
                                                                ]) => (
                                                                    <li
                                                                        key={
                                                                            key
                                                                        }
                                                                    >
                                                                        <strong>
                                                                            {
                                                                                key
                                                                            }
                                                                            :
                                                                        </strong>{" "}
                                                                        {value}
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                        <br />
                                                        {patientData[
                                                            appointment.patientID!
                                                        ]?.scanId && (
                                                            <button
                                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                                                                onClick={() =>
                                                                    handleOpenDicomPopup(
                                                                        patientData[
                                                                            appointment
                                                                                .patientID!
                                                                        ]
                                                                            .scanId as string
                                                                    )
                                                                }
                                                            >
                                                                Show Latest Scan
                                                            </button>
                                                        )}
                <label  htmlFor="file-upload" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
>
                Upload a scan
            </label>
            <input
                id="file-upload"
                type="file"
                style={{ display: 'none' }} // Hide the input visually
                onChange={handleUploadDicom(appointment.patientID)}
            />
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

                    <Popup
                        contentStyle={{
                            width: "100%",
                            maxWidth: "60rem", // Adjusted for potentially more space
                            padding: 0,
                            borderRadius: "12px",
                        }}
                        open={isDicomPopupOpen}
                        onClose={handleCloseDicomPopup}
                        modal
                        overlayStyle={{
                            background: "rgba(0, 0, 0, 0.75)", // Slightly darker overlay for better focus on the popup
                        }}
                    >
                        <div className="p-4">
                            {dicomImageUrl && (
                                <DicomViewer />
                            )}
                        </div>
                    </Popup>
                </div>
            </div>
        </div>
    );
};

export default Doctor;
