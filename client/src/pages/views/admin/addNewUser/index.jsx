import React, { useEffect, useState } from "react";
import Table from "./table";
import Modal from "./modal";
import useAuthStore from "../../../../services/stores/authStore";
import useUsersStore from "../../../../services/stores/users/usersStore";
import { NAL } from "../../../../components/modalAlert";
import { IoIosAdd } from "react-icons/io";

const info = {
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    password: "",
    role: "STAFF",
};

const AddNewUser = () => {
    const { token } = useAuthStore();
    const {
        getUsers,
        data,
        user,
        reset,
        message,
        isSuccess,
        otherInfo,
        isLoading,
    } = useUsersStore();
    const [toggleAdd, setToggleAdd] = useState(false);
    const [usersData, setUsersData] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [newUser, setNewUser] = useState(info);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (token) {
            fetchData(token);
        }
    }, [token]);

    const fetchData = (params = "") => {
        getUsers(token, params);
    };

    useEffect(() => {
        if (data) {
            setUsersData(data);
            setTotalPages(otherInfo.totalPages);
        }
    }, [data]);

    const handleUpdate = (user) => {
        setToggleAdd(true);
        setNewUser(user);
        setIsUpdate(true);
        console.log(user);
    };

    useEffect(() => {
        const successHandler = async () => {
            if (isSuccess && message) {
                setToggleAdd(false);

                setNewUser(info);

                if (user && isUpdate) {
                    const updatedUsers = usersData.map((u) =>
                        u._id === user._id ? user : u
                    );
                    setUsersData(updatedUsers);
                    setIsUpdate(false);
                } else if (user) {
                    setUsersData((prev) => {
                        const exists = prev.some((u) => u._id === user._id);

                        if (exists) {
                            return prev.filter((u) => u._id !== user._id);
                        } else {
                            return [...prev, user];
                        }
                    });
                }

                reset();
                await NAL({
                    title: "Saved!",
                    text: message,
                    icon: "success",
                    confirmText: "Ok",
                });
            } else if (message) {
                reset();
                await NAL({
                    title: "Error!",
                    text: message,
                    icon: "error",
                    confirmText: "Ok",
                });
            }
        };
        successHandler();
    }, [isSuccess, message, user]);

    return (
        <>
            <div className="container p-4">
                <div className="flex flex-col gap-5 pt-4">
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold text-[var(--primary-color)]">
                                User Management
                            </h2>
                            <p className="text-sm">
                                Manage system users and their permissions
                            </p>
                        </div>

                        <button
                            className="flex items-center justify-center p-2 rounded-md whitespace-nowrap bg-[var(--primary-color)] text-[var(--text-primary-color)] hover:bg-[var(--primary-hover-color)] h-fit text-sm"
                            onClick={() => toggleAdd((prev) => !prev)}
                        >
                            <IoIosAdd />
                            Add New User
                        </button>
                    </div>
                    <div>
                        <Table
                            data={usersData}
                            toggleAdd={setToggleAdd}
                            handleUpdate={handleUpdate}
                            totalPages={totalPages}
                            loadData={fetchData}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
            <Modal
                isOpen={toggleAdd}
                setIsOpen={setToggleAdd}
                setUserData={setNewUser}
                userData={newUser}
                isUpdate={isUpdate}
                setIsUpdate={setIsUpdate}
            />
        </>
    );
};

export default AddNewUser;
