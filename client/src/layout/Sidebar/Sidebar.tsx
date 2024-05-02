import { useLocation } from "react-router-dom";
import { PatientSidebarData } from "./PatientSidebarData";
import { AdminSidebarData } from "./AdminSidebarData";
import { DoctorSidebarData } from "./DoctorSidebarData";
import { ReceptionistSidebarData } from "./ReceptionistSidebarData";
import { CiLogout } from "react-icons/ci";

const Sidebar = () => {
    const location = useLocation();
    const pathSegments = location.pathname.split("-");
    const userType = pathSegments[0];

    // Define sidebar data for different user types
    const getUserSidebarData = () => {
        switch (userType) {
            case "/patient":
                return PatientSidebarData;
            case "/admin":
                return AdminSidebarData;
            case "/doctor":
                return DoctorSidebarData;
            case "/receptionist":
                return ReceptionistSidebarData;
            default:
                return PatientSidebarData;
        }
    };

    return (
        <div className="flex h-full">
            <div className="bg-black rounded-lg lg:flex md:w-64 md:flex-col flex pt-5 overflow-y-auto px-4 justify-between">
                <div className="space-y-4">
                    <div className="bg-top bg-cover space-y-1">
                        <div className="flex flex-col">
                            {/* Sidebar Content */}
                            {getUserSidebarData().map((item, index) => (
                                <a
                                    key={index}
                                    href={item.path}
                                    className="font-medium text-lg items-center rounded-lg text-white px-4 py-2.5 flex transition-all duration-200 hover:bg-gray-700 group cursor-pointer"
                                >
                                    {item.icon}
                                    <span className="ml-2">{item.title}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <a
                        href="/"
                        className="font-medium text-lg mb-2  items-center rounded-lg text-white px-4 py-2.5 flex transition-all duration-200 hover:bg-gray-700 group cursor-pointer mt-auto"
                    >
                        <CiLogout />
                        <span className="ml-2">Logout</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
