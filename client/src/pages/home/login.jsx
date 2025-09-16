import React, { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { HiOutlineX } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { toast } from "react-toastify";
import useAuthStore from "../../services/stores/authStore";
import { useNavigate, Link } from "react-router-dom";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from "@headlessui/react";

const Login = ({ isOpen, handleClose }) => {
    const [viewPassword, setViewPassword] = useState(false);
    const [userData, setUserData] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const { login, message, isSuccess, isLoading, reset, email, logout } =
        useAuthStore();

    const handleChange = (key, value) => {
        setUserData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password } = userData;
        if (email === "") {
            console.log("email cannot be empty!");
            return;
        }

        if (password === "") {
            console.log("password cannot be empty!");
            return;
        }
        await login(userData);
    };

    const handleLoginDemo = async (email, password, e) => {
        e.preventDefault();
        await login({
            email,
            password,
        });
    };

    const handleGoogleLogin = () => {
        window.location.href = `${backendUrl}/auth/google`;
    };

    const handleFacebookLogin = () => {
        window.location.href = `${backendUrl}/auth/facebook`;
    };

    useEffect(() => {
        if (isSuccess && !message.includes("OAuth")) {
            toast.success(message);
            handleClose();
            reset();
            if (message === "Login successful") {
                navigate("/dashboard");
            } else {
                setUserData((prev) => ({
                    ...prev,
                    email: "",
                    password: "",
                }));
            }
        } else if (message && !message.includes("OAuth")) {
            toast.error(message || "Something went wrong.");
        }
    }, [isSuccess, message]);

    useEffect(() => {
        if (email) {
            setUserData((prev) => ({ ...prev, email }));
        }
    }, [email]);

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            className="relative z-10 overflow-auto"
        >
            <DialogBackdrop
                transition
                className="fixed inset-0 overflow-auto bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />
            <div className="fixed top-[10%] z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95 max-h-[80vh] overflow-y-auto"
                    >
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full p-2">
                                    <DialogTitle
                                        as="div"
                                        className="text-2xl font-semibold text-[#4154F1] flex justify-between items-center"
                                    >
                                        <h3>Signin</h3>
                                        <button
                                            className="btn btn-ghost bg-white text-black"
                                            type="button"
                                            onClick={handleClose}
                                        >
                                            <HiOutlineX />
                                        </button>
                                    </DialogTitle>

                                    <div className="mt-3">
                                        <form
                                            id="loginForm"
                                            method="POST"
                                            className="flex flex-col gap-2 w-full text-black"
                                            onKeyDown={handleKeyDown}
                                        >
                                            <label htmlFor="">Email</label>
                                            <div className="input input-bordered flex items-center gap-2 w-full bg-white border-gray-300">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 16 16"
                                                    fill="currentColor"
                                                    className="h-4 w-4 opacity-70"
                                                >
                                                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                                                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                                                </svg>

                                                <input
                                                    type="email"
                                                    className="grow"
                                                    placeholder="Juan@mail.com"
                                                    name="email"
                                                    value={userData.email}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            e.target.name,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <label htmlFor="">Password</label>
                                            <div className="input w-full input-bordered flex items-center gap-2 bg-white border-gray-300">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 16 16"
                                                    fill="currentColor"
                                                    className="h-4 w-4 opacity-70"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <input
                                                    type={
                                                        viewPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    className="grow"
                                                    placeholder={
                                                        viewPassword
                                                            ? "Password"
                                                            : "******"
                                                    }
                                                    name="password"
                                                    value={userData.password}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            e.target.name,
                                                            e.target.value
                                                        )
                                                    }
                                                    autoComplete="off"
                                                />
                                                {viewPassword ? (
                                                    <button
                                                        type="button"
                                                        className="h-full"
                                                        onClick={() =>
                                                            setViewPassword(
                                                                !viewPassword
                                                            )
                                                        }
                                                    >
                                                        <FaRegEye />
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="h-full"
                                                        onClick={() =>
                                                            setViewPassword(
                                                                !viewPassword
                                                            )
                                                        }
                                                    >
                                                        <FaRegEyeSlash />
                                                    </button>
                                                )}
                                            </div>

                                            <div>
                                                {/* <button
                                                    onClick={(e) =>
                                                        handleLoginDemo(
                                                            "superAdmin@gmail.com",
                                                            "superAdmin123!",
                                                            e
                                                        )
                                                    }
                                                    className={`group relative w-full flex justify-center py-2 px-4 border-2 border-accent text-sm font-medium rounded-md text-[var(--text-primary-color)] ${
                                                        isLoading
                                                            ? "bg-orange-400"
                                                            : "bg-orange-600 hover:bg-orange-700"
                                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
                                                >
                                                    Demo Super Admin Account
                                                </button> */}
                                            </div>
                                            <div>
                                                <button
                                                    onClick={(e) =>
                                                        handleLoginDemo(
                                                            "admin@gmail.com",
                                                            "admin123!",
                                                            e
                                                        )
                                                    }
                                                    className={`group relative w-full flex justify-center py-2 px-4 border-2 border-accent text-sm font-medium rounded-md text-[var(--text-primary-color)] ${
                                                        isLoading
                                                            ? "bg-orange-400"
                                                            : "bg-orange-600 hover:bg-orange-700"
                                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
                                                >
                                                    Demo Admin Account
                                                </button>
                                            </div>
                                            <div>
                                                <button
                                                    onClick={(e) =>
                                                        handleLoginDemo(
                                                            "staff@gmail.com",
                                                            "staff123!",
                                                            e
                                                        )
                                                    }
                                                    className={`group relative w-full flex justify-center py-2 px-4 border-2 border-accent text-sm font-medium rounded-md text-[var(--text-primary-color)] ${
                                                        isLoading
                                                            ? "bg-orange-400"
                                                            : "bg-orange-600 hover:bg-orange-700"
                                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
                                                >
                                                    Demo Staff Account
                                                </button>
                                            </div>

                                            <div className="flex flex-col gap-2 pt-2 w-full">
                                                <button
                                                    disabled={isLoading}
                                                    className="w-full border-0 justify-center rounded-md bg-[var(--primary-color)] px-3 py-1.5 text-sm font-semibold leading-6 text-blue-800 shadow-sm hover:bg-[var(--primary-hover-color)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-650"
                                                    onClick={(e) =>
                                                        handleSubmit(e)
                                                    }
                                                >
                                                    <span className="text-[var(--text-primary-color)]">
                                                        {isLoading
                                                            ? "logging in..."
                                                            : "Log in"}
                                                    </span>
                                                </button>
                                                {email && (
                                                    <button
                                                        className="w-full justify-center rounded-md bg-gray-300 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-800 shadow-sm hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200"
                                                        onClick={(e) =>
                                                            handleLogout(e)
                                                        }
                                                    >
                                                        Logout
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="text-sm">
                                                    <Link
                                                        to="/forgot-password"
                                                        className="font-medium text-orange-600 hover:text-orange-500"
                                                    >
                                                        Forgot your password?
                                                    </Link>
                                                </div>
                                            </div>
                                        </form>
                                        <div className="flex flex-col gap-2 mt-4">
                                            <div className="flex items-center my-2">
                                                <div className="flex-1 border-t border-gray-300"></div>
                                                <span className="px-4 text-gray-500 text-sm">
                                                    Or continue with
                                                </span>
                                                <div className="flex-1 border-t border-gray-300"></div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleGoogleLogin}
                                                disabled={isLoading}
                                                className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                                            >
                                                <FcGoogle size={20} />
                                                <span className="text-black">
                                                    Continue with Google
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleFacebookLogin}
                                                disabled={isLoading}
                                                className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-md transition-colors bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                <FaFacebook size={20} />
                                                <span>
                                                    Continue with Facebook
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};

export default Login;
