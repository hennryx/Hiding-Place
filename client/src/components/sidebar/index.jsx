import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import ROLES from "../../pages/views/roles";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import useAuthStore from "../../services/stores/authStore";
import { VscAccount } from "react-icons/vsc";
import { IoMdLogOut } from "react-icons/io";
import { NAL } from "../modalAlert";
import { ChevronLeft, ChevronRight, Coffee } from "lucide-react";

const Sidebar = ({ role }) => {
    const menuItems = ROLES[role] || [];
    const { logout, auth } = useAuthStore();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth?.profileImage) {
            setImagePreview(auth.profileImage?.url);
        }
    }, [auth]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1199) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };
        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const path = location.pathname;
        const index = menuItems.findIndex((item) => item.path === path);

        toggleMenu(index);
    }, [location.pathname]);

    const toggleMenu = (index) => {
        setExpandedMenu((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        const result = await NAL({
            title: "Are you sure?",
            text: "You want to logout?",
            icon: "question",
            showCancel: true,
            confirmText: "logout",
        });

        if (result.isConfirmed) {
            await logout();
        }
    };

    const handleNavigate = (url) => {
        navigate(url);
    };

    return (
        <div className={`${isCollapsed ? "w-16" : "w-64"}`}>
            <div
                className={`flex flex-col ${
                    isCollapsed ? "w-16" : "w-64"
                } h-dvh sidebar-main transition-[width] duration-500 fixed gap-4 bg-white border-r border-gray-100`}
                style={{ boxShadow: "2px 0 10px rgba(0,0,0,0.05)" }}
            >
                {/* Header */}
                <div className="px-4 py-6 border-b border-gray-100 relative">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">
                                <Coffee />
                            </span>
                        </div>
                        {!isCollapsed && (
                            <div>
                                <h1 className="text-gray-900 font-semibold text-sm">
                                    Hidden Place
                                </h1>
                                <p className="text-gray-500 text-xs">
                                    POS System
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`p-2 bg-transparent text-orange-500 hover:text-orange-600 transition-colors duration-200 absolute top-0 bottom-0 ${
                            isCollapsed ? "-right-5" : "right-0"
                        }`}
                    >
                        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
                    </button>
                </div>

                {/* Staff Section */}
                {!isCollapsed && (
                    <div className="px-4">
                        <div
                            className="flex items-center gap-3 mb-6 cursor-pointer"
                            onClick={() => handleNavigate("/account")}
                        >
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <VscAccount
                                    className="text-gray-600"
                                    size={16}
                                />
                            </div>
                            <div>
                                <p className="text-gray-900 font-medium text-sm">
                                    {role === "STAFF"
                                        ? "Cashier"
                                        : role === "ADMIN"
                                        ? "Administrator"
                                        : role === "SUPER_ADMIN"
                                        ? "System Administrator"
                                        : ""}
                                </p>
                                <p className="text-green-600 text-xs font-medium bg-green-50 px-2 py-0.5 rounded">
                                    {role}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 px-4">
                    <ul className="space-y-2">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <div
                                    onClick={() => toggleMenu(index)}
                                    className={`group relative transition-all duration-200`}
                                >
                                    {!item.children ? (
                                        <NavLink
                                            to={item.path}
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 py-2.5 rounded-lg transition-all duration-200 ${
                                                    isActive
                                                        ? "bg-orange-500 text-white"
                                                        : "text-gray-600 hover:bg-gray-50"
                                                } ${
                                                    isCollapsed
                                                        ? "justify-center"
                                                        : "px-3 "
                                                }`
                                            }
                                        >
                                            <item.icon size={18} />
                                            {!isCollapsed && (
                                                <span className="font-medium text-sm">
                                                    {item.name}
                                                </span>
                                            )}

                                            {/* Notification badges */}
                                            {!isCollapsed &&
                                                item.name ===
                                                    "Notifications" && (
                                                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                        3
                                                    </span>
                                                )}
                                        </NavLink>
                                    ) : (
                                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer transition-all duration-200">
                                            <item.icon size={18} />
                                            {!isCollapsed && (
                                                <>
                                                    <span className="font-medium text-sm">
                                                        {item.name}
                                                    </span>
                                                    <button className="ml-auto focus:outline-none">
                                                        {expandedMenu[index] ? (
                                                            <HiChevronUp
                                                                size={16}
                                                            />
                                                        ) : (
                                                            <HiChevronDown
                                                                size={16}
                                                            />
                                                        )}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Submenu */}
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                        expandedMenu[index] && !isCollapsed
                                            ? "max-h-60 mt-1"
                                            : "max-h-0"
                                    }`}
                                >
                                    {item.children && (
                                        <ul className="pl-8 space-y-1">
                                            {item.children.map(
                                                (child, cIndex) => (
                                                    <li key={cIndex}>
                                                        <NavLink
                                                            to={`${item.path}${child.path}`}
                                                            className={({
                                                                isActive,
                                                            }) =>
                                                                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                                                    isActive
                                                                        ? "bg-orange-100 text-orange-700"
                                                                        : "text-gray-600 hover:bg-gray-50"
                                                                }`
                                                            }
                                                        >
                                                            <span>
                                                                {child.name}
                                                            </span>
                                                        </NavLink>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Bottom Section */}
                <div className="px-4 py-4 border-t border-gray-100">
                    {/* System Status */}
                    {!isCollapsed && (
                        <div className="flex items-center gap-2 mb-4 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-600">System Online</span>
                        </div>
                    )}

                    {/* Sign Out Button */}
                    <div
                        className={`flex items-center gap-3 py-2.5 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-all duration-200 ${
                            isCollapsed ? "justify-center" : "px-3 "
                        }`}
                        onClick={(e) => handleLogout(e)}
                    >
                        <IoMdLogOut size={18} />
                        {!isCollapsed && (
                            <span className="font-medium text-sm">
                                Sign Out
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Collapsed Sidebar Toggle Button */}
            {/* {isCollapsed && (
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="fixed top-4 left-4 z-50 p-2 bg-orange-500 text-white rounded-lg shadow-lg hover:bg-orange-600 transition-colors duration-200"
                    style={{ left: "70px" }}
                >
                    <BsList size={20} />
                </button>
            )} */}
        </div>
    );
};

export default Sidebar;
