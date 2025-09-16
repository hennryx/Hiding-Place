import React, { useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import useUsersStore from "../../../../services/stores/users/usersStore";
import useAuthStore from "../../../../services/stores/authStore";
import Pagination from "../../../../components/pagination";
import { NAL } from "../../../../components/modalAlert";

const Table = ({
    data,
    toggleAdd,
    handleUpdate,
    totalPages,
    loadData,
    isLoading,
}) => {
    const { deleteUser } = useUsersStore();
    const { token } = useAuthStore();
    const [allData, setAllData] = useState(data);
    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    useEffect(() => {
        if (data) {
            setAllData(data);
        }
    }, [data]);

    const handleDelete = async (e, data) => {
        e.preventDefault();

        const result = await NAL({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancel: true,
            confirmText: "Yes, Delete it!",
        });

        if (result.isConfirmed) {
            await deleteUser(data, token);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        loadData({ page: pageNumber, limit: itemsPerPage });
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
        const _items = Number(value);
        loadData({ page: 1, limit: _items });
    };

    const handleSearch = () => {
        loadData({
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm,
        });
    };

    const handleSearchChange = (val) => {
        setSearchTerm(val);
        setCurrentPage(1);
    };

    const handleOnKeyPress = (e) => {
        switch (e.key) {
            case "Enter":
                handleSearch();
                break;
            case "Backspace":
                loadData({ page: 1, limit: _items });
                break;
            default:
                break;
        }
    };

    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
            <table className="table">
                <caption>
                    <div className="flex justify-between p-4">
                        <h3 className="text-xl">Users</h3>
                        <div className="flex flex-row gap-4 justify-center items-center">
                            <label className="input bg-transparent border-2 border-gray-500 rounded-md">
                                <div
                                    className="h-full flex items-center cursor-pointer p-2 text-gray-900"
                                    onClick={handleSearch}
                                >
                                    <svg
                                        className="h-4 opacity-50"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                    >
                                        <g
                                            strokeLinejoin="round"
                                            strokeLinecap="round"
                                            strokeWidth="2.5"
                                            fill="none"
                                            stroke="currentColor"
                                        >
                                            <circle
                                                cx="11"
                                                cy="11"
                                                r="8"
                                            ></circle>
                                            <path d="m21 21-4.3-4.3"></path>
                                        </g>
                                    </svg>
                                </div>

                                <input
                                    type="search"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        handleSearchChange(e.target.value)
                                    }
                                    placeholder="Search"
                                    onKeyDown={handleOnKeyPress}
                                />
                            </label>
                        </div>
                    </div>
                </caption>
                <thead>
                    <tr className="text-white bg-orange-500">
                        <th className="border border-r">#</th>
                        <th className="border border-r">Name</th>
                        <th className="border border-r">Mail</th>
                        <th className="border border-r">Role</th>
                        <th className="border border-r">Action</th>
                    </tr>
                </thead>
                <tbody className="text-gray-500">
                    {isLoading ? (
                        <tr>
                            <td
                                colSpan={5}
                                className="text-center py-4 text-gray-500"
                            >
                                Loading...
                            </td>
                        </tr>
                    ) : allData && allData.length > 0 ? (
                        allData.map((_data, i) => (
                            <tr key={i}>
                                <th>
                                    {(currentPage - 1) * itemsPerPage + i + 1}
                                </th>
                                <td>
                                    {_data.firstname} {_data.middlename}{" "}
                                    {_data.lastname}
                                </td>
                                <td>{_data.email}</td>
                                <td>{_data.role}</td>
                                <td className="flex flex-row justify-center items-center gap-2 p-2">
                                    <button
                                        className="p-2 bg-blue-200 text-blue-800 rounded-md hover:bg-blue-300"
                                        onClick={() => handleUpdate(_data)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="p-2 bg-red-200 text-red-800 rounded-md hover:bg-red-300"
                                        onClick={(e) => handleDelete(e, _data)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={5}
                                className="text-center py-4 text-gray-500"
                            >
                                No results found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalItems={totalPages * itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
            />
        </div>
    );
};

export default Table;
