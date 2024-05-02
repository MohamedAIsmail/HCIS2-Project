import * as AiIcons from "react-icons/ai";

export const ReceptionistSidebarData = [
    {
        title: "View Patient",
        path: "/receptionist", // assuming unique paths for each item
        icon: <AiIcons.AiOutlineFileText />,
        cName: "nav-text",
    },
    {
        title: "Add Patient",
        path: "/receptionist-add", // assuming unique paths for each item
        icon: <AiIcons.AiOutlineUserAdd />,
        cName: "nav-text",
    },
];
