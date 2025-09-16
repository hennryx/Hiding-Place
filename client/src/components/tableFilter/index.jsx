// client/src/components/tableFilter/index.jsx
import React from 'react';

const TableFilter = ({ searchTerm, setSearchTerm, filterOptions, currentFilter, setFilter }) => {
    return (
        <div className='flex flex-row gap-4 justify-center items-center'>
            <label className="input bg-transparent border-2 border-gray-500 rounded-md">
                <svg className="h-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </g>
                </svg>
                <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search"
                />
            </label>
            
            {filterOptions && (
                <select
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    value={currentFilter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    {filterOptions.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default TableFilter;