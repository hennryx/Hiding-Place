import React, { useEffect, useState } from 'react'
import useAuthStore from '../../../../services/stores/authStore';
import useTransactionsStore from '../../../../services/stores/transactions/transactionStore';
import FilterMenu from '../../../../components/filterMenu';
import { toDate } from '../../../../services/utilities/convertDate';
import Pagination from '../../../../components/pagination';

const filterOptions = {
    date: {
        type: 'date',
        label: 'Transaction Date',
    },
    transactionType: {
        type: 'select',
        label: 'Transaction Type',
        choices: [
            { label: 'Purchase', value: 'PURCHASE' },
            { label: 'Sale', value: 'SALE' },
            { label: 'Damage', value: 'DAMAGE' },
            { label: 'Return', value: 'RETURN' }
        ]
    }
};
 
const Table = () => {
    const { token } = useAuthStore();
    const { getTransactionSales, salesData, pageInfo } = useTransactionsStore();
    const [allData, setAllData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const today = new Date().toISOString().split('T')[0];
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [filters, setFilters] = useState({
        date: {
            start: today,
            end: today
        },
        transactionType: 'PURCHASE'
    });

    const fetchTransactions = (params) => {
        if (!token) return
        getTransactionSales(params, token);
    }

    useEffect(() => {
        if (token) {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            fetchTransactions({ startOfDay, endOfDay, type: "All" });
        }
    }, [token]);

    useEffect(() => {
        if (salesData) {
            setAllData(salesData);
            setTotalPages(pageInfo.totalPages)
        }
    }, [salesData]);

    const applyFilters = (newFilters) => {
        const startDate = new Date(newFilters.date.start || today);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(newFilters.date.end || today);
        endDate.setHours(23, 59, 59, 999);

        fetchTransactions({
            startOfDay: startDate,
            endOfDay: endDate,
            type: newFilters.transactionType || "All"
        });

        setCurrentPage(1);
    };

    const handleApplyFilter = (newFilters) => {
        setFilters(newFilters);
        applyFilters(newFilters)
    };

    const handleSearch = () => {
        fetchTransactions({ page: currentPage, limit: itemsPerPage, search: searchTerm });
    }

    const handleSearchChange = (val) => {
        setSearchTerm(val);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchTransactions({ page: pageNumber, limit: itemsPerPage });
    };

    const handleItemsPerPageChange = (val) => {
        setItemsPerPage(val);
        setCurrentPage(1);
    };

    const handleKeyDown = (e) => {
        console.log(e.key)
        switch (e.key) {
            case 'Enter':
                fetchTransactions({ page: currentPage, limit: itemsPerPage, search: searchTerm });
                break;
            case 'Backspace':
                fetchTransactions({ page: currentPage, limit: itemsPerPage });
                break;
            default:
                break;

        }
    }

    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-2xl min-h-120">
            <table className="table">
                <caption>
                    <div className='flex justify-between p-4'>
                    <h3 className='text-xl'>Transactions Today</h3>
                        <div className='flex flex-row gap-4 justify-center items-center'>
                            <label className="input bg-transparent border-2 border-gray-500 rounded-md">
                                <div
                                    className='h-full flex items-center cursor-pointer p-2 text-gray-900'
                                    onClick={handleSearch}
                                >
                                    <svg className="h-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
                                </div>
                                <input
                                    type="search"
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    onKeyDown={handleKeyDown}
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
                        </div>
                    </div>
                </caption>
                <thead>
                    <tr className='text-black bg-gray-300'>
                        <th>#</th>
                        <th>Transaction Number</th>
                        <th>Transaction</th>
                        <th>Supplier</th>
                        <th>Transaction date</th>
                        <th>items</th>
                        <th>Total Amount</th>
                    </tr>
                </thead>
                <tbody className='text-gray-500'>
                    {allData || allData.length === 0 ? (
                        <tr>
                            <td colSpan={5} className='text-center py-4 text-gray-500'>No transactions found for the selected criteria</td>
                        </tr>
                    ) : (
                        allData.map((_data, i) => (
                            <tr key={i}>
                                <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                                <td className='h-auto'>{_data.orderNumber}</td>
                                <td>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${_data.transactionType === 'PURCHASE' ? 'bg-blue-100 text-blue-800' :
                                        _data.transactionType === 'SALE' ? 'bg-green-100 text-green-800' :
                                            _data.transactionType === 'DAMAGE' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {_data.transactionType}
                                    </span>
                                </td>
                                <td className='h-auto'>{_data.supplier?.companyName}</td>
                                <td className='h-auto'>{toDate(_data.transactionDate)}</td>
                                <td className='h-auto'>{_data.items?.length} {_data.items?.length > 0 && _data.items?.length > 1 ? "items" : "item"}</td>
                                <td className='h-auto'>₱{_data.totalAmount}</td>
                            </tr>
                        ))
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
    )
}

export default Table