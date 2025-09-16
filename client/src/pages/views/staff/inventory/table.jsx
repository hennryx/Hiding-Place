import React, { useEffect, useState } from "react";
import useProductsStore from "../../../../services/stores/products/productsStore";
import useAuthStore from "../../../../services/stores/authStore";
import NoImage from "../../../../assets/No-Image.webp";
import { Checkbox } from "@headlessui/react";
import { IoIosAdd } from "react-icons/io";
import { RiFileReduceLine } from "react-icons/ri";
import FilterMenu from "../../../../components/filterMenu";
import Pagination from "../../../../components/pagination";
import { NAL } from "../../../../components/modalAlert";

const staff = {
    inventory: {
        canAdd: true,
        canUpdate: false,
        canDelete: false,
        canReduce: false,
    },
};

const Table = ({
    data,
    handleToggle,
    handleUpdate,
    handleReduceProduct,
    isLoading,
    loadData,
    totalPages,
    allCategories,
    _currentPage,
    headerStatus,
    itemsPerPage,
    setItemsPerPage,
    currentPage,
    setCurrentPage,
}) => {
    const { deleteProduct } = useProductsStore();
    const { token } = useAuthStore();
    const [allData, setAllData] = useState(data);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPrd, setSelectedPrd] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        category: "",
    });

    const filterOptions = {
        category: {
            type: "select",
            label: "Category",
            choices: [...allCategories]
                .filter(Boolean)
                .map((name) => ({ label: name, value: name })),
        },
    };

    useEffect(() => {
        console.log(_currentPage);
        if (data) {
            setAllData(data);
        }
        if (_currentPage) {
            setCurrentPage(_currentPage);
        }
    }, [data, _currentPage]);

    const handleDelete = async (e, _id) => {
        e.preventDefault();

        const result = await NAL({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancel: true,
            confirmText: "Yes, Delete it!",
        });

        if (result.isConfirmed) {
            await deleteProduct({ _id }, token);
        }
    };

    const handleApplyFilter = (newFilters) => {
        if (newFilters.category) {
            loadData({
                page: currentPage,
                limit: itemsPerPage,
                category: newFilters.category,
                search: searchTerm,
                status: headerStatus,
            });
            setFilters(newFilters);
        }

        setCurrentPage(1);
    };

    const handleSearch = () => {
        loadData({
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm,
            category: filters.category,
        });
    };

    const handleSearchChange = (val) => {
        setSearchTerm(val);
        setCurrentPage(1);
    };

    const handleKeyDown = (e) => {
        switch (e.key) {
            case "Enter":
                handleSearch();
                break;
            case "Backspace":
                loadData({ page: currentPage, limit: itemsPerPage });
                break;

            default:
                break;
        }
    };

    const handleItemSelection = (item) => {
        if (Array.isArray(item)) {
            if (selectedPrd.length === allData.length) {
                setSelectedPrd([]);
            } else {
                setSelectedPrd([...allData]);
            }
        } else {
            const isSelected = selectedPrd.some(
                (product) => product._id === item._id
            );

            if (isSelected) {
                setSelectedPrd(
                    selectedPrd.filter((product) => product._id !== item._id)
                );
            } else {
                setSelectedPrd([...selectedPrd, item]);
            }
        }
    };

    const openReduceDrawer = (productsToReduce = null) => {
        const productsForDrawer = productsToReduce || selectedPrd;

        if (productsForDrawer && productsForDrawer.length > 0) {
            handleReduceProduct(productsForDrawer, currentPage, itemsPerPage);
            handleToggle(true, "reduce");
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        loadData({
            page: pageNumber,
            limit: itemsPerPage,
            search: searchTerm,
            category: filters.category,
            status: headerStatus,
        });
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
        const _items = Number(value);
        loadData({
            page: 1,
            limit: _items,
            search: searchTerm,
            category: filters.category,
            status: headerStatus,
        });
    };

    console.log(isLoading);
    return (
        <div className="overflow-x-auto min-h-fit bg-white shadow-md rounded-2xl">
            <table className="table table-auto">
                <caption>
                    <div className="flex justify-between p-4">
                        <h3 className="text-xl">Inventory Items</h3>
                        <div className="flex flex-row gap-4 justify-center items-center">
                            <label className="input bg-transparent border-2 border-gray-500 rounded-md pl-0">
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
                                    className="flex-1"
                                    type="search"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        handleSearchChange(e.target.value)
                                    }
                                    placeholder="Search"
                                    onKeyDown={handleKeyDown}
                                />
                            </label>

                            <FilterMenu
                                isOpen={isFilterOpen}
                                toggleFilter={setIsFilterOpen}
                                onApplyFilter={handleApplyFilter}
                                filters={filters}
                                filterOptions={filterOptions}
                            />

                            {staff.inventory.canReduce &&
                                selectedPrd.length > 0 && (
                                    <button
                                        className="flex items-center justify-center px-4 py-3 rounded-md whitespace-nowrap bg-[var(--primary-color)] text-[var(--text-color)] hover:bg-[var(--primary-hover-color)]"
                                        onClick={() => openReduceDrawer()}
                                    >
                                        <RiFileReduceLine />
                                        Reduce{" "}
                                        {selectedPrd.length > 1
                                            ? "All"
                                            : "Item"}{" "}
                                        ({selectedPrd.length})
                                    </button>
                                )}
                        </div>
                    </div>
                </caption>
                <thead>
                    <tr className="text-black bg-gray-300">
                        {staff.inventory.canReduce && (
                            <th>
                                <Checkbox
                                    checked={
                                        selectedPrd.length === allData.length &&
                                        allData.length > 0
                                    }
                                    onChange={() =>
                                        handleItemSelection(allData)
                                    }
                                    className="group block size-4 rounded-full bg-white border border-gray-400 data-[checked]:bg-blue-200"
                                >
                                    <svg
                                        className="stroke-blue-800 opacity-0 group-data-[checked]:opacity-100"
                                        viewBox="0 0 14 14"
                                        fill="none"
                                    >
                                        <path
                                            d="M3 8L6 11L11 3.5"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </Checkbox>
                            </th>
                        )}
                        <th>#</th>
                        <th>image</th>
                        <th>product</th>
                        <th>Size</th>
                        <th>Price</th>
                        <th>Stock</th>
                        {(staff.inventory.canUpdate ||
                            staff.inventory.canDelete) && <th>Action</th>}
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
                        allData.map((item, i) => (
                            <tr key={i}>
                                {staff.inventory.canReduce && (
                                    <td>
                                        <Checkbox
                                            checked={selectedPrd?.some(
                                                (prd) => prd._id === item._id
                                            )}
                                            onChange={() =>
                                                handleItemSelection(item)
                                            }
                                            className="group block size-4 rounded-full bg-white border border-gray-400 data-[checked]:bg-blue-200"
                                        >
                                            <svg
                                                className="stroke-blue-800 opacity-0 group-data-[checked]:opacity-100"
                                                viewBox="0 0 14 14"
                                                fill="none"
                                            >
                                                <path
                                                    d="M3 8L6 11L11 3.5"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </Checkbox>
                                    </td>
                                )}
                                <td>
                                    {(currentPage - 1) * itemsPerPage + i + 1}
                                </td>
                                <td>
                                    <img
                                        className="h-15 w-15 object-fill rounded-md"
                                        src={
                                            item.image !== null
                                                ? item.image?.url
                                                : NoImage
                                        }
                                        alt={item.image?.name}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = NoImage;
                                        }}
                                    />
                                </td>
                                <td>{item.productName}</td>
                                <td>{item.unitSize + " " + item.unit}</td>
                                <td>{item.sellingPrice}</td>
                                <td>{item.totalStock}</td>
                                {(staff.inventory.canUpdate ||
                                    staff.inventory.canDelete) && (
                                    <td className="flex flex-row justify-start items-center gap-2 p-2">
                                        {staff.inventory.canUpdate && (
                                            <button
                                                className="p-2 bg-blue-200 text-blue-800 rounded-md hover:bg-blue-300"
                                                onClick={() =>
                                                    handleUpdate(
                                                        item,
                                                        currentPage,
                                                        itemsPerPage
                                                    )
                                                }
                                            >
                                                Update
                                            </button>
                                        )}

                                        {staff.inventory.canDelete && (
                                            <button
                                                className="p-2 bg-red-200 text-red-800 rounded-md hover:bg-red-300"
                                                onClick={(e) =>
                                                    handleDelete(e, item._id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                )}
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
