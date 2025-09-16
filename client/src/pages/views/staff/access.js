import DashBoard from "./dashboard";
import Inventory from "./inventory";
import Reports from "./reports";

import { IoNotificationsOutline } from "react-icons/io5";
import { BsGrid1X2, BsBox } from "react-icons/bs";
import { HiOutlineDocumentReport } from "react-icons/hi";
import Notification from "./notifications";

const access = [
    {
        name: "POS",
        path: "/dashboard",
        icon: BsGrid1X2,
        element: DashBoard,
    },

    {
        name: "Inventory",
        path: "/inventory",
        icon: BsBox,
        element: Inventory,
    },
    {
        name: "Notifications",
        path: "/notification",
        icon: IoNotificationsOutline,
        element: Notification,
    },

    {
        name: "Reports",
        path: "/reports",
        icon: HiOutlineDocumentReport,
        element: Reports,
    },
];

export default access;
