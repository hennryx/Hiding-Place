import React, { useEffect, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { BsEye, BsEyeSlash } from "react-icons/bs";
import useUsersStore from '../../../../services/stores/users/usersStore';
import useAuthStore from '../../../../services/stores/authStore';
import { NAL } from '../../../../components/modalAlert';

const Modal = ({ isOpen, setIsOpen, setUserData, userData, isUpdate, setIsUpdate }) => {
    const [errorMsg, setErrorMsg] = useState("");
    const { signup, message, isSuccess, user, reset, update } = useUsersStore();
    const { token } = useAuthStore()
    const [viewPass, setViewPass] = useState(false);

    const handleUserData = (key, value) => {
        setUserData((prev) => ({
            ...prev,
            [key]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { firstname, lastname, email, password } = userData;

        if (firstname === "" || lastname === "" || email === "" || password === "") {
            setErrorMsg("Please fill all the required fields!");
            return;
        }

        if (isUpdate) {
            const result = await NAL({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancel: true,
                confirmText: "Yes, Submit it!"
            })

            if (result.isConfirmed) {
                await update(userData, token)
            }
            return;
        }

        const result = await NAL({
            title: "Are you sure?",
            text: "You want to Add this!",
            icon: "warning",
            showCancel: true,
            confirmText: "Yes"
        })

        if (result.isConfirmed) {
            await signup(userData);
        }
    }

    const handleCancel = () => {
        setIsOpen(false);
        setIsUpdate(false);
        setUserData(() => ({
            firstname: "",
            middlename: "",
            lastname: "",
            email: "",
            password: "",
            role: "STAFF"
        }));
    }

    useEffect(() => {
        if (errorMsg) {
            setTimeout(() => {
                setErrorMsg("");
            }, 3000);
        }
    }, [errorMsg])
    return (
        <Dialog open={isOpen} onClose={setIsOpen} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed top-[10%] z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                    >
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <DialogTitle as="h3" className="text-2xl font-semibold text-[var(--primary-color)]">
                                        {isUpdate ? "Update user" : "Add new user"}
                                    </DialogTitle>
                                    <div className="mt-2">
                                        <div className="border-b border-gray-900/10 pb-2">
                                            <h2 className="text-base/7 font-semibold text-gray-900">Personal Information</h2>
                                            <p className="mt-1 text-sm/6 text-gray-600">Use a real mail where you can receive mail.</p>

                                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">

                                                <div className="sm:col-span-4">
                                                    <label htmlFor="first-name" className="block text-sm/6 font-medium text-gray-900">
                                                        <span className='required'></span>
                                                        First name
                                                    </label>
                                                    <div className="mt-2">
                                                        <input
                                                            required
                                                            id="first-name"
                                                            name="firstname"
                                                            type="text"
                                                            value={userData.firstname}
                                                            onChange={(e) => handleUserData(e.target.name, e.target.value)}
                                                            autoComplete="given-name"
                                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label htmlFor="middle-name" className="block text-sm/6 font-medium text-gray-900">
                                                        Middle name
                                                    </label>
                                                    <div className="mt-2">
                                                        <input
                                                            id="middle-name"
                                                            name="middlename"
                                                            value={userData.middlename}
                                                            onChange={(e) => handleUserData(e.target.name, e.target.value)}
                                                            type="text"
                                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-6">
                                                    <label htmlFor="last-name" className="block text-sm/6 font-medium text-gray-900">
                                                        <span className='required'></span>
                                                        Last name
                                                    </label>
                                                    <div className="mt-1">
                                                        <input
                                                            required
                                                            id="last-name"
                                                            name="lastname"
                                                            value={userData.lastname}
                                                            onChange={(e) => handleUserData(e.target.name, e.target.value)}
                                                            type="text"
                                                            autoComplete="family-name"
                                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-6">
                                                    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                                        <span className='required'></span>
                                                        Email address
                                                    </label>
                                                    <div className="mt-1">
                                                        <input
                                                            required
                                                            id="email"
                                                            name="email"
                                                            value={userData.email}
                                                            onChange={(e) => handleUserData(e.target.name, e.target.value)}
                                                            type="email"
                                                            autoComplete="email"
                                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-6">
                                                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                                        <span className='required'></span>
                                                        Password
                                                    </label>

                                                    <div className="mt-1 flex flex-row items-center rounded-md border border-gray-300 placeholder:text-gray-400 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                                        <input
                                                            required
                                                            id="password"
                                                            name="password"
                                                            type={viewPass ? "text" : "password"}
                                                            value={userData?.password || ""}
                                                            onChange={(e) => handleUserData(e.target.name, e.target.value)}
                                                            autoComplete="password"
                                                            className="block w-full bg-white px-3 py-1.5 text-base text-gray-900 sm:text-sm/6 border-0 focus:outline-none"
                                                        />
                                                        <div className='px-3 h-full flex items-center'>
                                                            {viewPass ? (
                                                                <BsEye size={25} className='text-black cursor-pointer' onClick={() => setViewPass((prev) => !prev)} />
                                                            ) : (
                                                                <BsEyeSlash size={25} className='text-black cursor-pointer' onClick={() => setViewPass((prev) => !prev)} />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        {errorMsg && (
                                            <div className='text-red-800 bg-red-200 p-2 flex justify-center rounded-md'>{errorMsg}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-5">
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e)}
                                className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold bg-primary text-[var(--text-color)] hover:bg-[var(--primary-hover-color)] sm:ml-3 sm:w-auto shadow-xs`}
                            >
                                {isUpdate ? "Update" : "Save"}
                            </button>

                            <button
                                type="button"
                                data-autofocus
                                onClick={() => handleCancel()}
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-red-300 hover:text-red-800 sm:mt-0 sm:w-auto"
                            >
                                Cancel
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}

export default Modal