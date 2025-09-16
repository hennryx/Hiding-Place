import React, { useEffect, useState } from "react";
import Table from "./table";
import useAuthStore from "../../../../services/stores/authStore";
import useSuppliersStore from "../../../../services/stores/suppliers/suppliersStore";
import EmbededModal from "./embededModal";
import { NAL } from "../../../../components/modalAlert";
import { IoIosAdd } from "react-icons/io";

const info = {
    firstname: "",
    middlename: "",
    lastname: "",
    contactNumber: "",
    companyName: "",
    companyAddress: {
        region: "",
        province: "",
        municipality: "",
        barangay: "",
        street: "",
        zipcode: "",
    },
    products: [],
};

const AddNewSupplier = () => {
    const { token } = useAuthStore();
    const {
        getSuppliers,
        data,
        otherInfo,
        supplier,
        reset,
        message,
        isSuccess,
        isLoading,
    } = useSuppliersStore();
    const [toggleAdd, setToggleAdd] = useState(false);
    const [suppliersData, setSuppliersData] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [newSupplier, setNewSupplier] = useState(info);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (token) {
            handleFetch({
                page: 1,
                limit: 5,
            });
        }
    }, [token]);

    const handleFetch = async (params) => {
        getSuppliers(token, params);
    };

    useEffect(() => {
        if (data) {
            setSuppliersData(data);
            setTotalPages(otherInfo.totalPages);
        }
    }, [data]);

    const handleUpdate = (supplier) => {
        setToggleAdd(true);
        setNewSupplier(supplier);
        setIsUpdate(true);
    };

    useEffect(() => {
        const successHandler = async () => {
            if (isSuccess && message) {
                setToggleAdd(false);

                setNewSupplier(info);

                if (Object.keys(supplier).length > 0 && isUpdate) {
                    const updatedSupplier = suppliersData.map((u) =>
                        u._id === supplier._id ? supplier : u
                    );
                    setSuppliersData(updatedSupplier);
                    setIsUpdate(false);
                } else if (Object.keys(supplier).length > 0) {
                    setSuppliersData((prev) => {
                        const exists = prev.some((u) => u._id === supplier._id);

                        if (exists) {
                            return prev.filter((u) => u._id !== supplier._id);
                        } else {
                            return [...prev, supplier];
                        }
                    });
                }

                await NAL({
                    title: "Saved!",
                    text: message,
                    icon: "success",
                    confirmText: "Ok",
                });
            } else if (message) {
                await NAL({
                    title: "Error!",
                    text: message,
                    icon: "error",
                    confirmText: "Ok",
                });
            }
        };

        successHandler();
        reset();
    }, [isSuccess, message, supplier]);

    return (
        <>
            <div className="container p-4">
                <div className="flex flex-col gap-5 pt-4">
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-col">
                            <h2 className="text-xl text-[var(--primary-color)] font-bold">
                                Suppliers list
                            </h2>
                            <p className="text-sm">
                                Manage your suppliers and delivery schedules
                            </p>
                        </div>

                        <button
                            className="flex items-center justify-center p-2 rounded-md whitespace-nowrap bg-[var(--primary-color)] text-[var(--text-primary-color)] hover:bg-[var(--primary-hover-color)] h-fit text-sm"
                            onClick={() => toggleAdd((prev) => !prev)}
                        >
                            <IoIosAdd />
                            Add New Supplier
                        </button>
                    </div>
                    <div>
                        {toggleAdd ? (
                            <EmbededModal
                                setIsOpen={setToggleAdd}
                                setNewSupplier={setNewSupplier}
                                newSupplier={newSupplier}
                                isUpdate={isUpdate}
                                setIsUpdate={setIsUpdate}
                                temp={info}
                            />
                        ) : (
                            <Table
                                data={suppliersData}
                                toggleAdd={setToggleAdd}
                                handleUpdate={handleUpdate}
                                totalPages={totalPages}
                                handleFetch={handleFetch}
                                isLoading={isLoading}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddNewSupplier;
