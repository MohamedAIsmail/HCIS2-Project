import * as React from "react";
import { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import AddDoctor from "./AddDoctor";
import { Add } from "@mui/icons-material";

type UserData = {
    id: number;
    name: string;
    role: string;
    email: string;
    password: string;
};

export default function Admin() {
    const [data, setData] = useState<UserData[]>([
        {
            id: 1,
            name: "John Doe",
            role: "Admin",
            email: "john@example.com",
            password: "password1",
        },
        {
            id: 2,
            name: "Jane Smith",
            role: "Moderator",
            email: "jane@example.com",
            password: "password2",
        },
    ]);

    const [searchTerm, setSearchTerm] = useState<string>("");

    // Handle search input change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Handle delete user
    const handleDelete = (id: number) => {
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
    };

    // Popup state
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };
    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    // Filter data based on search term
    const filteredData = data.filter(
        (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <React.Fragment>
            <header className="text-center py-4">
                <h1 className="text-2xl font-bold">Admin Control Panel</h1>
            </header>

            <div className="overflow-x-auto mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div>
                    <table className="w-full border-collapse border justify-center">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border px-4 py-2">ID</th>
                                <th className="border px-4 py-2">Name</th>
                                <th className="border px-4 py-2">Email</th>
                                <th className="border px-4 py-2">Password</th>
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
                        <tbody className="text-center">
                            {filteredData.map((item) => (
                                <tr key={item.id}>
                                    <td className="border px-4 py-2">
                                        {item.id}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {item.name}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {item.email}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {item.password}
                                    </td>
                                    <td className="border px-4 py-2 ">
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                            onClick={() =>
                                                handleDelete(item.id)
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
                            width: "80%",
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
                        overlayStyle={{ background: "rgba(0, 0, 0, 0.5)" }}
                        open={isPopupOpen}
                        onOpen={handleOpenPopup}
                        onClose={handleClosePopup}
                    >
                        <AddDoctor onClose={handleClosePopup} />
                    </Popup>
                </div>
            </div>
        </React.Fragment>
    );
}
