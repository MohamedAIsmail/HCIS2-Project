import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    parsedMessage,
    encodeHL7Message,
    ParsedMessage,
} from "../../utils/HL7Encoder";
import io from "socket.io-client";

import axios from "axios";
import Sidebar from "../../layout/Sidebar/Sidebar";
import Navbar from "../../layout/Navbar/Navbar";

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

interface PatientDataMap {
    [key: string]: PatientData;
}





export default function ReceptionistPortal() {
    const [patientData, setPatientData] = useState<PatientData[]>([]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/patient");
                console.log(response.data.patients)
                setPatientData(response.data.patients); // Access the array with the key 'patients'
            } catch (error) {
                console.error("Error fetching patients:", error);
            }
        }
        fetchPatients();
    }, []);
    

    return (
        <div className="h-screen">
            <div className="h-[calc(7%)]">
                <Navbar />
            </div>
            <div className="flex h-[calc(93%)]">
                <div className="w-1/6">
                    <Sidebar />
                </div>
                <div className="p-4 w-5/6">
                    <header className="text-center py-4">
                        <h1 className="text-2xl font-bold">
                            Our Patients
                        </h1>
                    </header>

                    <div  style={{ display: 'flex', justifyContent: 'center' }}>
                        <table className="w-full border-collapse border">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border px-2 py-2 min-w-[150px] border-gray-300 bg-blue-600 text-white uppercase">Name</th>
                                    <th className="border px-4 py-2 min-w-[150px] border-gray-300 bg-blue-600 text-white uppercase">Phone Number</th>
                                    <th className="border px-4 py-2 min-w-[150px] border-gray-300 bg-blue-600 text-white uppercase">Email</th>
                                    <th className="border px-4 py-2 min-w-[150px] border-gray-300 bg-blue-600 text-white uppercase">Age</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                            {patientData.map((patient: PatientData, index: number) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2  border-b border-gray-200 bg-white text-sm">{patient.name}</td>
                                    <td className="border px-4 py-2  border-b border-gray-200 bg-white text-sm" >{patient.phoneNumber || 'N/A'}</td>
                                    <td className="border px-4 py-2 border-b border-gray-200 bg-white text-sm">{patient.email}</td>
                                    <td className="border px-4 py-2 border-b border-gray-200 bg-white text-sm">{patient.age || 'N/A'}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
}
