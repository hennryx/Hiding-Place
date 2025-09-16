import React, { useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import useAuthStore from "../../../../services/stores/authStore";
import usePurchaseStore from "../../../../services/stores/purchase/purchaseStore";
import {
    toDate,
    toDateNoTime,
} from "../../../../services/utilities/convertDate";
import FilterMenu from "../../../../components/filterMenu";
import Pagination from "../../../../components/pagination";
import Icons from "../../../../services/utilities/ICONS";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from "@headlessui/react";
import { NAL } from "../../../../components/modalAlert";

const Table = ({
    data,
    handleToggleAdd,
    handleUpdate,
    totalPages,
    isLoading,
    loadData,
}) => {
    const { deletePurchase } = usePurchaseStore();
    const { token } = useAuthStore();
    const [allData, setAllData] = useState(data);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        date: { start: "", end: "" },
        supplier: "",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const [isOpenView, setIsOpenView] = useState(false);
    const [itemDetails, setItemDetails] = useState({});
    const { Eye, Edit, Delete } = Icons;

    const filterOptions = {
        date: {
            type: "date",
            label: "Purchase Date",
        },
        supplier: {
            type: "select",
            label: "Supplier",
            choices: [
                ...new Set(data?.map((item) => item.supplier?.companyName)),
            ]
                .filter(Boolean)
                .map((name) => ({ label: name, value: name })),
        },
    };

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
            await deletePurchase(token, data);
        }
    };

    const handleApplyFilter = (newFilters) => {
        loadData({
            page: 1,
            limit: 5,
            filters: JSON.stringify(newFilters),
        });

        setCurrentPage(1);
        setFilters(newFilters);
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
        loadData({ page: pageNumber, limit: itemsPerPage });
    };

    const handleItemsPerPageChange = (val) => {
        setItemsPerPage(val);
        setCurrentPage(1);
    };

    const handleViewPurchase = (item) => {
        setItemDetails(item);
        setIsOpenView(true);
    };

    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
            <table
                className={`${isFilterOpen ? "min-h-80 " : ""} table h-auto`}
            >
                <caption>
                    <div className="flex justify-between p-4">
                        <h3 className="text-xl">Purchases</h3>
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
                            <div className="flex flex-row-reverse items-center justify-center gap-3">
                                <FilterMenu
                                    isOpen={isFilterOpen}
                                    toggleFilter={setIsFilterOpen}
                                    onApplyFilter={handleApplyFilter}
                                    filters={filters}
                                    filterOptions={filterOptions}
                                />
                            </div>
                        </div>
                    </div>
                </caption>
                <thead>
                    <tr className="text-white bg-orange-500">
                        <th className="border border-r">#</th>
                        <th className="border border-r">Order Number</th>
                        <th className="border border-r">Supplier</th>
                        <th className="border border-r">Purchase date</th>
                        <th className="border border-r">Items</th>
                        <th className="border border-r">Total Amount</th>
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
                            <tr key={i} className="max-h-max align-top">
                                <td className="h-auto">
                                    {(currentPage - 1) * itemsPerPage + i + 1}
                                </td>
                                <td className="h-auto">{_data.orderNumber}</td>
                                <td className="h-auto">
                                    {_data.supplier?.companyName}
                                </td>
                                <td className="h-auto">
                                    {toDate(_data.transactionDate)}
                                </td>
                                <td className="h-auto">
                                    {_data.items?.length}{" "}
                                    {_data.items?.length > 0 &&
                                    _data.items?.length > 1
                                        ? "items"
                                        : "item"}
                                </td>
                                <td className="h-auto">₱{_data.totalAmount}</td>
                                <td className="flex flex-row justify-start items-center gap-2 p-2 h-auto">
                                    <button
                                        className="p-2 border-2 border-blue-200 text-blue-800 rounded-md hover:bg-blue-300"
                                        onClick={() =>
                                            handleViewPurchase(_data)
                                        }
                                    >
                                        <Eye />
                                    </button>
                                    <button
                                        className="p-2 bg-blue-200 text-blue-800 rounded-md hover:bg-blue-300"
                                        onClick={() =>
                                            handleUpdate(
                                                _data,
                                                currentPage,
                                                itemsPerPage
                                            )
                                        }
                                    >
                                        <Edit />
                                    </button>
                                    <button
                                        className="p-2 bg-red-200 text-red-800 rounded-md hover:bg-red-300"
                                        onClick={(e) => handleDelete(e, _data)}
                                    >
                                        <Delete />
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

            <Modal
                item={itemDetails}
                isOpen={isOpenView}
                setIsOpen={setIsOpenView}
            />
        </div>
    );
};

export default Table;

const Modal = ({ item, isOpen, setIsOpen }) => {
    const { Close } = Icons;

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
                        <div className="bg-white px-4 py-2 sm:p-3">
                            <div className="sm:flex sm:items-start">
                                <div className="text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <div className="flex justify-between items-center">
                                        <DialogTitle
                                            as="h3"
                                            className="text-2xl font-semibold text-primary"
                                        >
                                            Purchase Order Details
                                        </DialogTitle>

                                        <div
                                            onClick={() => setIsOpen(false)}
                                            className="p-2 text-lg hover:bg-primary hover:text-[var(--text-color)] border-2 border-primary rounded-md transition-all duration-300"
                                        >
                                            <Close />
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <div className="border-b border-gray-900/10 pb-2">
                                            <div className="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
                                                <div className="flex flex-col">
                                                    <p className="block text-sm font-medium text-[var(--dark-color)]">
                                                        Order Number
                                                    </p>
                                                    <p className="text-base font-medium text-[var(--dark-color)]">
                                                        {item.orderNumber}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="block text-sm font-medium text-[var(--dark-color)]">
                                                        Order date
                                                    </p>
                                                    <p className="text-base font-medium text-[var(--dark-color)]">
                                                        {toDateNoTime(
                                                            item.transactionDate
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="block text-sm font-medium text-[var(--dark-color)]">
                                                        Created by
                                                    </p>
                                                    <p className="text-base font-medium text-[var(--dark-color)]">
                                                        {item.createdBy?.role}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="block text-sm font-medium text-[var(--dark-color)]">
                                                        Supplier
                                                    </p>
                                                    <p className="text-base font-medium text-[var(--dark-color)]">
                                                        {
                                                            item.supplier
                                                                ?.companyName
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-4 mt-4">
                                                <div>
                                                    <p className="text-sm">
                                                        Order Items
                                                    </p>
                                                </div>

                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>Product</th>
                                                            <th>Quantity</th>
                                                            <th>Unit Price</th>
                                                            <th>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {item.items?.length >
                                                            0 &&
                                                            item.items.map(
                                                                (prd, i) => (
                                                                    <tr
                                                                        key={i}
                                                                        className="border-b-1 border-[var(--secondary-color)]"
                                                                    >
                                                                        <td>
                                                                            {
                                                                                prd
                                                                                    .product
                                                                                    ?.productName
                                                                            }{" "}
                                                                            {
                                                                                prd
                                                                                    .product
                                                                                    ?.unitSize
                                                                            }
                                                                            {
                                                                                prd
                                                                                    .product
                                                                                    ?.unit
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                prd.quantity
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                prd.unitPrice
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            ₱
                                                                            {prd.quantity *
                                                                                prd.unitPrice}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                    </tbody>
                                                </table>
                                                <div className="w-full text-end">
                                                    <p className="font-bold">
                                                        Total Amount: ₱
                                                        {item.totalAmount}
                                                    </p>
                                                </div>
                                                <div className="w-full text-start">
                                                    <p className="font-medium text-sm">
                                                        Notes:
                                                    </p>
                                                    <p className="text-sm">
                                                        {item.notes}
                                                    </p>
                                                </div>
                                            </div>
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
