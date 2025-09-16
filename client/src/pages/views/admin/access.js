import AddNewUser from "./addNewUser";
import DashBoard from "./dashboard";
import Inventory from "./inventory";
import AddNewSupplier from "./addNewSupplier";
import Reports from "./reports";
import Purchase from "./purchase";
import Notification from "./notifications";

import { IoNotificationsOutline } from "react-icons/io5";
import { BsGrid1X2, BsPersonAdd, BsBox, BsTruck } from "react-icons/bs";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { BsClipboardCheck } from "react-icons/bs";

const access = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: BsGrid1X2,
        element: DashBoard,
    },

    {
        name: "User Management",
        path: "/add-new-user",
        icon: BsPersonAdd,
        element: AddNewUser,
    },

    {
        name: "Inventory",
        path: "/inventory",
        icon: BsBox,
        element: Inventory,
    },

    {
        name: "Suppliers",
        path: "/add-new-supplier",
        icon: BsTruck,
        element: AddNewSupplier,
    },

    {
        name: "Delivery",
        path: "/purchase",
        icon: BsClipboardCheck,
        element: Purchase,
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
