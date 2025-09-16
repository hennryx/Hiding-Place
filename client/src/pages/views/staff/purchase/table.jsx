import React, { useEffect, useState } from 'react'
import useAuthStore from '../../../../services/stores/authStore';
import usePurchaseStore from '../../../../services/stores/purchase/purchaseStore';
import { toDate } from '../../../../services/utilities/convertDate';
import FilterMenu from '../../../../components/filterMenu';
import { NAL } from '../../../../components/modalAlert';

const Table = ({ data, toggleAdd, handleUpdate }) => {
    const { deletePurchase } = usePurchaseStore();
    const { token } = useAuthStore()
    const [searchResult, setSearchResult] = useState("")
    const [allData, setAllData] = useState(data)
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        date: { start: '', end: '' },
        supplier: '',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Filter options configuration
    const filterOptions = {
        date: {
            type: 'date',
            label: 'Purchase Date',
        },
        supplier: {
            type: 'select',
            label: 'Supplier',
            choices: [
                ...new Set(data?.map(item => item.supplier?.companyName))
            ]
                .filter(Boolean)
                .map(name => ({ label: name, value: name }))
        }
    };

    const handleDelete = async (e, data) => {
        e.preventDefault();
        const result = await NAL({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancel: true,
            confirmText: "Yes, Delete it!"
        })

        if (result.isConfirmed) {
            await deletePurchase(token, data)
        }
    }

    // Apply filters to data
    const applyFilters = () => {
        let filteredData = [...data];

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredData = filteredData.filter(item =>
                item.supplier?.firstname?.toLowerCase().includes(term) ||
                item.supplier?.middlename?.toLowerCase().includes(term) ||
                item.supplier?.lastname?.toLowerCase().includes(term) ||
                item.supplier?.companyName?.toLowerCase().includes(term)
            );
        }

        // Filter by date range
        if (filters.date.start || filters.date.end) {
            filteredData = filteredData.filter(item => {
                const purchaseDate = new Date(item.purchaseDate);

                if (filters.date.start && filters.date.end) {
                    const startDate = new Date(filters.date.start);
                    const endDate = new Date(filters.date.end);
                    endDate.setHours(23, 59, 59); // End of the day
                    return purchaseDate >= startDate && purchaseDate <= endDate;
                } else if (filters.date.start) {
                    const startDate = new Date(filters.date.start);
                    return purchaseDate >= startDate;
                } else if (filters.date.end) {
                    const endDate = new Date(filters.date.end);
                    endDate.setHours(23, 59, 59); // End of the day
                    return purchaseDate <= endDate;
                }

                return true;
            });
        }

        // Filter by supplier
        if (filters.supplier) {
            filteredData = filteredData.filter(item =>
                item.supplier?.companyName === filters.supplier
            );
        }

        if (filteredData.length === 0) {
            setSearchResult("No results match your filters");
        } else {
            setSearchResult("");
        }

        setAllData(filteredData);
        setCurrentPage(1);
    };

    // Handle filter changes
    const handleApplyFilter = (newFilters) => {
        setFilters(newFilters);
    };

    useEffect(() => {
        if (data) {
            setAllData(data);
            applyFilters();
        }
    }, [data, filters, searchTerm]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = allData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(allData.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const renderPagination = () => {
        return (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                    <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                            <span className="font-medium">
                                {indexOfLastItem > allData.length ? allData.length : indexOfLastItem}
                            </span>{" "}
                            of <span className="font-medium">{allData.length}</span> results
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="rounded border-gray-300 text-sm"
                        >
                            <option value={5}>5 per page</option>
                            <option value={10}>10 per page</option>
                            <option value={25}>25 per page</option>
                        </select>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                            >
                                <span className="sr-only">Previous</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {pageNumbers.map((number) => (
                                <button
                                    key={number}
                                    onClick={() => handlePageChange(number)}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === number
                                        ? 'bg-blue-600 text-[var(--text-color)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                                        }`}
                                >
                                    {number}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                            >
                                <span className="sr-only">Next</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
            <table className="table">
                <caption>
                    <div className='flex justify-between p-4'>
                        <h3 className='text-xl'>Purchases</h3>
                        <div className='flex flex-row gap-4 justify-center items-center'>
                            <label className="input bg-transparent border-2 border-gray-500 rounded-md">
                                <svg className="h-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
                                <input
                                    type="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search"
                                />
                            </label>
                            <div className="relative">
                                <FilterMenu
                                    isOpen={isFilterOpen}
                                    toggleFilter={setIsFilterOpen}
                                    onApplyFilter={handleApplyFilter}
                                    filters={filters}
                                    filterOptions={filterOptions}
                                />
                            </div>
                            {/* <button
                                className='flex items-center justify-center px-4 py-3 bg-green-200 rounded-md text-green-800 whitespace-nowrap hover:bg-green-300'
                                onClick={() => toggleAdd((prev) => !prev)}
                            >
                                <IoIosAdd />
                                Add New Purchase
                            </button> */}
                        </div>
                    </div>
                </caption>
                <thead>
                    <tr className='text-black bg-gray-300'>
                        <th>#</th>
                        <th>Products</th>
                        <th>Supplier name</th>
                        <th>Supplier company</th>
                        <th>Purchase date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className='text-gray-500'>
                    {searchResult ? (
                        <tr>
                            <td colSpan={6} className='text-center py-4 text-gray-500'>{searchResult}</td>
                        </tr>
                    ) : (
                        currentItems.map((_data, i) => (
                            <tr key={i}>
                                <td>{indexOfFirstItem + i + 1}</td>
                                <td>
                                    {_data.products?.map((item, index) => (
                                        <div key={index} className='border-b-1 border-gray-300 flex flex-col'>
                                            <p className='flex gap-2'>
                                                <span className='text-gray-400'>
                                                    product:
                                                </span>
                                                <span className='text-gray-500'>
                                                    {item.product?.productName}
                                                </span>
                                            </p>
                                            <p className='flex gap-2'>
                                                <span className='text-gray-400'>
                                                    stock:
                                                </span>
                                                <span className='text-gray-500'>
                                                    {item?.stock}
                                                </span>
                                            </p>
                                        </div>
                                    ))}
                                </td>
                                <td>{_data.supplier?.firstname}</td>
                                <td>{_data.supplier?.companyName}</td>
                                <td>{toDate(_data.purchaseDate)}</td>
                                <td className='flex flex-row justify-start items-center gap-2 p-2'>
                                    <button
                                        className='p-2 bg-blue-200 text-blue-800 rounded-md hover:bg-blue-300'
                                        onClick={() => handleUpdate(_data)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className='p-2 bg-red-200 text-red-800 rounded-md hover:bg-red-300'
                                        onClick={(e) => handleDelete(e, _data)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {!searchResult && renderPagination()}
        </div>
    )
}

export default Table