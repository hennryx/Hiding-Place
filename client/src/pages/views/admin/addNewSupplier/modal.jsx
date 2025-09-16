import React, { useEffect, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import useUsersStore from '../../../../services/stores/users/usersStore';
import useAuthStore from '../../../../services/stores/authStore';
import { NAL } from '../../../../components/modalAlert';

const Modal = ({ isOpen, setIsOpen, setNewSupplier, supplierData, isUpdate, setIsUpdate }) => {
    const [errorMsg, setErrorMsg] = useState("");
    const { signup, update } = useUsersStore();
    const { token } = useAuthStore()

    const handleSupplierData = (key, value) => {
        setNewSupplier((prev) => ({
            ...prev,
            [key]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { firstname, lastname, email, password } = supplierData;

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
                await update(supplierData, token)
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
            await signup(supplierData);
        }
    }

    const handleCancel = () => {
        setIsOpen(false);
        setIsUpdate(false);
        setNewSupplier(() => ({
            firstname: "",
            middlename: "",
            lastname: "",
            email: "",
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
                                        {isUpdate ? "Update supplier" : "Add new supplier"}
                                    </DialogTitle>
                                    <div className="mt-2">
                                        <div className="border-b border-gray-900/10 pb-2">
                                            <h2 className="text-base/7 font-semibold text-gray-900">Supplier Information</h2>
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
                                                            value={supplierData?.firstname || ""}
                                                            onChange={(e) => handleSupplierData(e.target.name, e.target.value)}
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
                                                            value={supplierData?.middlename}
                                                            onChange={(e) => handleSupplierData(e.target.name, e.target.value)}
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
                                                            value={supplierData?.lastname}
                                                            onChange={(e) => handleSupplierData(e.target.name, e.target.value)}
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
                                                            value={supplierData?.email}
                                                            onChange={(e) => handleSupplierData(e.target.name, e.target.value)}
                                                            type="email"
                                                            autoComplete="email"
                                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                                        />
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
                                className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold ${isUpdate ? "bg-blue-200 text-blue-800 hover:bg-blue-300" : "bg-green-200 text-green-800 hover:bg-green-300"} sm:ml-3 sm:w-auto shadow-xs`}
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