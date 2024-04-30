import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();
    const pathSegments = location.pathname.split("-");
    const userType = pathSegments[0];

    return (
        <div>
            <div className="bg-black">
                <div className="flex-col flex">
                    <div className="w-full border-b-4 border-gray-200">
                        <div className="bg-black h-16 justify-between items-center mx-auto px-4 flex">
                            <div className="text-xl font-bold font text-white ml-8">
                                {userType.charAt(1).toUpperCase() +
                                    userType.slice(2).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
