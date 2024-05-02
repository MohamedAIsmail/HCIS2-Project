import * as React from "react";
import { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import AddDoctor from "./AddDoctor";
import { useSelector, useDispatch } from "react-redux";
import { IDoctor } from "../Doctor/doctor-slice";
import { IStore } from "../../models/store";
import {
    fetchDoctorsDataThunk,
    deleteDoctorThunk,
} from "../Doctor/doctor-slice";
import { TAppDispatch } from "../../redux/store";
import Navbar from "../../layout/Navbar/Navbar";
import Sidebar from "../../layout/Sidebar/Sidebar";

export default function Admin() {
    const doctorsData = useSelector((state: IStore) => state.doctors);
    const [filteredDoctorsData, setFilteredDoctorsData] = useState<IDoctor[]>(
        []
    );

    const dispatch = useDispatch<TAppDispatch>();

    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        dispatch(fetchDoctorsDataThunk());
    }, [dispatch]);

    // Handle search input change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Handle delete user
    const handleDelete = (id: string) => {
        dispatch(deleteDoctorThunk(id));
    };

    // Popup state
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };
    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    useEffect(() => {
        const filteredData = doctorsData.filter(
            (item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredDoctorsData(filteredData);
    }, [doctorsData, searchTerm]);

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex h-[calc(6%)]">
                <Navbar />
            </div>
            <div className="flex flex-1">
                <div className="w-1/6">
                    <Sidebar />
                </div>
                <div className="p-4 w-5/6">
                    <header className="text-center py-4">
                        <h1 className="text-2xl font-bold">
                            Admin Control Panel
                        </h1>
                    </header>

                    <div>
                        <table className="w-full border-collapse bordertable-auto">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border px-4 py-2 min-w-[150px]">
                                        Name
                                    </th>
                                    <th className="border px-4 py-2 min-w-[150px]">
                                        Email
                                    </th>

                                    <div className="m-2 flex justify-center">
                                        <input
                                            type="text"
                                            placeholder="Search by name or email"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            className="block rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </tr>
                            </thead>
                            <tbody className="text-center ">
                                {filteredDoctorsData.map((item) => (
                                    <tr key={item._id}>
                                        <td className="border px-4 py-2">
                                            {item.name}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {item.email}
                                        </td>
                                        <td className="border px-4 py-2 ">
                                            <button
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                                onClick={() =>
                                                    item._id &&
                                                    handleDelete(item._id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center mt-4">
                        {/* Popup Trigger Button */}
                        <Popup
                            contentStyle={{
                                width: "100%",
                                maxWidth: "24rem",
                                padding: 0,
                                borderRadius: "12px",
                            }}
                            trigger={
                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                                    Add Doctor
                                </button>
                            }
                            position="center center"
                            closeOnDocumentClick
                            closeOnEscape
                            repositionOnResize
                            modal
                            overlayStyle={{
                                background: "rgba(0, 0, 0, 0.5)",
                            }}
                            open={isPopupOpen}
                            onOpen={handleOpenPopup}
                            onClose={handleClosePopup}
                        >
                            <AddDoctor onClose={handleClosePopup} />
                        </Popup>
                    </div>
                </div>
            </div>
        </div>
    );
}
