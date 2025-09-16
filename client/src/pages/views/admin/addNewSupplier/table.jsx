import React, { useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import useAuthStore from "../../../../services/stores/authStore";
import useSuppliersStore from "../../../../services/stores/suppliers/suppliersStore";
import Pagination from "../../../../components/pagination";
import { FaRegBuilding } from "react-icons/fa";
import { LuPhone } from "react-icons/lu";
import { TbEdit } from "react-icons/tb";
import { MdOutlineLocationOn } from "react-icons/md";
import { toDateNoTime } from "../../../../services/utilities/convertDate";
import { GoPerson } from "react-icons/go";

const Table = ({
    data,
    toggleAdd,
    handleUpdate,
    totalPages,
    handleFetch,
    isLoading,
}) => {
    const { deleteSupplier } = useSuppliersStore();
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

    const handleSearch = () => {
        handleFetch({
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm,
        });
    };

    const handleSearchChange = (val) => {
        setSearchTerm(val);
        setCurrentPage(1);
    };

    const handleKeyDown = (e) => {
        switch (e.key) {
            case "Enter":
                loadData({
                    page: currentPage,
                    limit: itemsPerPage,
                    search: searchTerm,
                });
                break;
            case "Backspace":
                loadData({ page: currentPage, limit: itemsPerPage });
                break;

            default:
                break;
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    const handleStatusChange = async (e, _id) => {
        console.log("Selected:", e.target.value);
        e.preventDefault();

        await deleteSupplier({ _id }, token);
    };

    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
            <table className="table">
                <caption>
                    <div className="flex justify-between p-4">
                        <h3 className="text-xl">Suppliers</h3>
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
                                    onKeyDown={handleKeyDown}
                                />
                            </label>
                        </div>
                    </div>
                </caption>
                <thead>
                    <tr className="text-white bg-orange-500">
                        <th className="border border-r">#</th>
                        <th className="border border-r">Name</th>
                        <th className="border border-r">Address</th>
                        <th className="border border-r">Phone number</th>
                        <th className="border border-r">Status</th>
                        <th className="border border-r">Last Order</th>
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
                    ) : allData.length > 0 ? (
                        allData.map((_data, i) => (
                            <tr key={i}>
                                <th>
                                    {(currentPage - 1) * itemsPerPage + i + 1}
                                </th>
                                <td>
                                    <div className="flex flex-col">
                                        <span className="flex items-center gap-1 text-sm">
                                            <FaRegBuilding />{" "}
                                            {_data.companyName}
                                        </span>
                                        <div className="flex items-center flex-row gap-1">
                                            <GoPerson />
                                            <span className="text-xs">
                                                {" "}
                                                {_data.firstname}{" "}
                                                {_data.middlename}{" "}
                                                {_data.lastname}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <div className="flex items-center gap-1 text-sm">
                                        <MdOutlineLocationOn />
                                        <span className="capitalize">
                                            {_data.companyAddress?.barangay.toLowerCase()}
                                            ,{" "}
                                            {_data.companyAddress?.municipality.toLowerCase()}
                                            ,{" "}
                                            {_data.companyAddress?.province.toLowerCase()}
                                        </span>
                                    </div>
                                </td>

                                <td>
                                    <span className="flex items-center gap-1 text-sm">
                                        <LuPhone /> {_data.contactNumber}
                                    </span>
                                </td>

                                <td>
                                    <select
                                        id="my-select"
                                        value={
                                            _data.isActive
                                                ? "active"
                                                : "inactive"
                                        }
                                        onChange={(e) =>
                                            handleStatusChange(e, _data._id)
                                        }
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">
                                            inActive
                                        </option>
                                    </select>
                                </td>
                                <td>
                                    <span>
                                        {_data.lastOrder
                                            ? toDateNoTime(
                                                  _data.lastOrder
                                                      ?.transactionDate
                                              )
                                            : "No order"}
                                    </span>
                                </td>

                                <td>
                                    <div className="flex flex-row justify-start items-center gap-2 p-2">
                                        <button
                                            className="p-2 bg-blue-200 text-blue-800 rounded-md hover:bg-blue-300"
                                            onClick={() => handleUpdate(_data)}
                                        >
                                            <TbEdit />
                                        </button>
                                    </div>
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
