import * as React from "react";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

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

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleDelete = (id: number) => {
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
    };

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
            <div className="flex items-center space-x-4 p-4">
                <IconButton
                    aria-label="logout"
                    className="bg-purple-600 text-white"
                >
                    <ExitToAppIcon />
                </IconButton>
                <TextField
                    className="w-full"
                    margin="normal"
                    type="text"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    variant="outlined"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-4 py-2">ID</th>
                            <th className="border px-4 py-2">Name</th>
                            <th className="border px-4 py-2">Email</th>
                            <th className="border px-4 py-2">Password</th>
                            <th className="border"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item) => (
                            <tr key={item.id}>
                                <td className="border px-4 py-2">{item.id}</td>
                                <td className="border px-4 py-2">
                                    {item.name}
                                </td>
                                <td className="border px-4 py-2">
                                    {item.email}
                                </td>
                                <td className="border px-4 py-2">
                                    {item.password}
                                </td>
                                <td className="border px-4 py-2">
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={5} className="border px-4 py-2">
                                <div>
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                                        <a
                                            href="./AddDoctor"
                                            className="text-white"
                                        >
                                            Add Doctor
                                        </a>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    );
}
