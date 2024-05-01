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
import io from 'socket.io-client';

import axios from "axios";
import Sidebar from "../../layout/Sidebar/Sidebar";
import Navbar from "../../layout/Navbar/Navbar";

const Receptionist = () => {
    // State to store form data
    const [formData, setFormData] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();

    // Function to handle form input changes
    const handleInputChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleDateChange = (date: any) => {
        const formattedDate = date.format("YYYY-MM-DD");
        setFormData({
            ...formData,
            "Date/Time of Birth": formattedDate,
        });
    };
    const [response, setResponse] = useState('');

    // Function to handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const mappedData: ParsedMessage = {};
        Object.entries(parsedMessage).forEach(([segmentKey, segment]) => {
            mappedData[segmentKey] = {
                segment: segment.segment,
                fields: { ...segment.fields }, // Copy fields from parsedMessage
            };
            Object.entries(segment.fields).forEach(([fieldName, _]) => {
                // Find matching field in formData
                const formDataKey = Object.keys(formData).find(
                    (key) => key.toLowerCase() === fieldName.toLowerCase()
                );
                if (formDataKey) {
                    mappedData[segmentKey].fields[fieldName] =
                        formData[formDataKey];
                }
            });
        });
        encodeHL7Message(mappedData)
        const socket = io('http://localhost:8080/', {
            withCredentials: true,
            extraHeaders: {
                "my-custom-header": "abcd"
            }
        });

        socket.on('connect', () => {
            console.log('Connected to server');

            // Send data to the server
            const data = JSON.stringify({
                scenario: "registerPatient",
                hl7Message: encodeHL7Message(mappedData)
            });

            socket.emit('sendData', data);
            window.location.reload(); 
        });



        socket.on('error', (errorMessage) => {
            console.error('Error from server:', errorMessage);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        // Cleanup on component unmount
        return () => {
            socket.disconnect();
        };

    };

    return (
        <div className="h-screen">
            <div className="">
                <Navbar />
            </div>
            <div className="flex h-5/6">
                <div className="p-12 w-full">
                    <form className="mx-auto" onSubmit={handleSubmit}>
                        <div className="space-y-12 ">
                            <div className="border-b border-gray-900/10 pb-12">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">
                                    Patient Personal Information
                                </h2>

                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div className="sm:col-span-3">
                                        <label
                                            htmlFor="first-name"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            First name
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="Patient Name"
                                                id="first-name"
                                                autoComplete="given-name"
                                                onChange={handleInputChange}
                                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label
                                            htmlFor="last-name"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Last name
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="Mothers Maiden Name"
                                                id="last-name"
                                                autoComplete="family-name"
                                                onChange={handleInputChange}
                                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-full">
                                        <label
                                            htmlFor="date-of-birth"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Birthdate
                                        </label>
                                        <div className="mt-2">
                                            <LocalizationProvider
                                                dateAdapter={AdapterDayjs}
                                            >
                                                <DemoContainer
                                                    components={["DatePicker"]}
                                                >
                                                    <DatePicker
                                                        disableFuture
                                                        onChange={
                                                            handleDateChange
                                                        }
                                                    />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label
                                            htmlFor="country"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Country
                                        </label>
                                        <div className="mt-2">
                                            <select
                                                id="country"
                                                name="Country Code"
                                                autoComplete="country-name"
                                                onChange={handleInputChange}
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            >
                                                <option value="+20">
                                                    Egypt (+20)
                                                </option>
                                                <option value="+1">
                                                    United States (+1)
                                                </option>
                                                <option value="+44">
                                                    United Kingdom (+44)
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label
                                            htmlFor="gender"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Gender
                                        </label>
                                        <div className="mt-2">
                                            <select
                                                id="gender"
                                                name="Sex"
                                                autoComplete="gender"
                                                onChange={handleInputChange}
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            >
                                                <option>Male</option>
                                                <option>Female</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="phone"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Phone Number
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="tel"
                                                name="Phone Number - Home"
                                                id="phone"
                                                autoComplete="phone"
                                                onChange={handleInputChange}
                                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="nationality"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Nationality
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="Nationality"
                                                id="nationality"
                                                autoComplete="nationality"
                                                onChange={handleInputChange}
                                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="religion"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Religion
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="Religion"
                                                id="religion"
                                                onChange={handleInputChange}
                                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-full">
                                        <label
                                            htmlFor="street-address"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Street address
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="Patient Address"
                                                id="street-address"
                                                autoComplete="home street-address"
                                                onChange={handleInputChange}
                                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2 sm:col-start-1">
                                        <label
                                            htmlFor="birth-place"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Birth Place
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="Birth Place"
                                                id="Birth Place"
                                                onChange={handleInputChange}
                                                autoComplete="address-level2"
                                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="Citizenship"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Citizenship
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="Citizenship"
                                                id="Citizenship"
                                                autoComplete="address-level1"
                                                onChange={handleInputChange}
                                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="ssn"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Social Security Number
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="number"
                                                name="SSN Number - Patient"
                                                id="ssn"
                                                autoComplete="ssn"
                                                onChange={handleInputChange}
                                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-x-6">
                            <button
                                type="button"
                                className="text-sm font-semibold leading-6 text-gray-900"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Receptionist;
