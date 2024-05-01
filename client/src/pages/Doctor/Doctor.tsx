import React, { useEffect, useState } from "react";
import Navbar from "../../layout/Navbar/Navbar";
import Sidebar from "../../layout/Sidebar/Sidebar";
import AddAppointment from "./AddAppointment";
import Popup from "reactjs-popup";
import { useParams } from 'react-router-dom';
import { fetchHL7AppointmentsDataThunk } from "./appointment-slice";
import HL7Segment from "./appointment-slice"
import { useDispatch, useSelector } from 'react-redux';
import { TAppDispatch } from "../../redux/store";
import  HL7Appointment   from './appointment-slice'; // Import your slice actions

const Doctor = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };
    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };
    const { doctorId } = useParams();
    const dispatch = useDispatch<TAppDispatch>(); 
    const appointments = useSelector((state: { appointments: { schedule: Array<any> } }) => state.appointments.schedule || []);

    useEffect(() => {
        dispatch(fetchHL7AppointmentsDataThunk(String(doctorId)));
    }, [dispatch, doctorId,appointments]); 


    return (
        <div className="h-screen">
            <div>
                <Navbar />
            </div>
            <div className="flex h-[calc(92%)]">
                <div >
                    <Sidebar />
                </div>
                <div className="w-5/6 p-4">
                    <header className="text-center py-4">
                        <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
                    </header>
                    <div className="overflow-x-auto mt-6">
                        <table className="min-w-full leading-normal">
                            <thead>

        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Appointment ID
        </th>
        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Appointment Date & Time
        </th>
        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Duration
        </th>
        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Priority
        </th>
        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Reason
        </th>
       
                            </thead>
                            <tbody>
                            {appointments.length > 0 ? (
                                    appointments.map((appointment , index:number) => (
                                        <tr key={index}>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {appointment._id}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                      {appointment.requestedStartDateTimeRange}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                                                                     {appointment.appointmentDuration }
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {appointment.priorityARQ }
                                            </td>
                                             <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {appointment.appointmentReason}
                                            </td>

                                            
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td  className="text-r px-5 py-5 border-b border-gray-200 bg-white text-sm col-span-5 ">
                                            No appointments found
                                        </td>
                                    </tr>
                                )}
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

