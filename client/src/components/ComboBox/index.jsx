import React, { useEffect, useState } from 'react'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { HiChevronDown } from "react-icons/hi";
import { HiCheckCircle } from "react-icons/hi2";
/**
 * Reusable Combobox component built on Headless UI
 * @param {Function} handleDataChange - Callback function when selection changes, receives the selected item's ID
 * @param {Array} data - Array of objects to display in the dropdown
 * @param {string} selectedData - ID of the currently selected item
 * @param {string} displayKey - Object property to use for display and filtering (e.g., 'companyName', 'name')
 * @param {string} [placeholder="Select an option"] - Placeholder text when no item is selected
 * @param {string} [idKey="_id"] - Object property to use as the unique identifier
 * @param {boolean} [disabled=false] - Whether the combobox is disabled
 * @param {string} [className=""] - Additional CSS classes for the input
 * @param {string} [label=""] - Label for accessibility
 * @param {boolean} [required=false] - Whether the field is required
 * @param {string} [emptyMessage="Nothing found."] - Message to show when no results match the search
 * @param {function} [renderOptionDisplay] - A function that receives a single item and returns a JSX element to be rendered for that option.
 *
 * Example usage:
 * 
 * renderOptionDisplay={(item) => (
 *   <div className="text-sm/6 text-gray-900 truncate">
 *     {item.productName} {item.unitSize}{item.unit} - ₱{item.sellingPrice}
 *   </div>
 * )}
 * 
 */

const ComboBox = ({
    handleDataChange,
    data = [],
    displayKey = "",
    placeholder = "Select an option",
    selectedData = null,
    idKey = "_id",
    disabled = false,
    className = "",
    label = "",
    required = false,
    emptyMessage = "Nothing found.",
    renderOptionDisplay = ""
}) => {
    const [query, setQuery] = useState('')
    const [internalValue, setInternalValue] = useState(selectedData)

    /* if (!displayKey) {
        console.warn('ComboBox: displayKey prop is required');
        return null;
    } */

    useEffect(() => {
        if (selectedData) {
            setInternalValue(selectedData)
        }
    }, [selectedData])

    if (!Array.isArray(data)) {
        console.warn('ComboBox: data prop must be an array');
        return null;
    }

    // Get selected item object for display
    const selectedDisplayItem = data.find(item => item[idKey] === internalValue) || null;

    // Filter data based on query with safe property access
    const filteredData = query === ''
        ? data
        : data.filter((item) => {
            const displayValue = item[displayKey];
            return displayValue &&
                displayValue.toString()
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.toLowerCase().replace(/\s+/g, ''))
        });

    const handleSelectionChange = (selectedItem) => {
        const selectedId = selectedItem?.[idKey] || '';
        handleDataChange(selectedId);
        setInternalValue(selectedId)
    };

    // Base input classes with override capability
    const inputClasses = `
         w-full rounded-lg border border-gray-300 bg-white py-1.5 pr-8 pl-3 text-sm/6 text-gray-900 
         focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary
         disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
         ${className}
     `.trim();

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <Combobox
                value={selectedDisplayItem}
                onChange={handleSelectionChange}
                onClose={() => setQuery('')}
                disabled={disabled}
            >
                <div className="relative">
                    <ComboboxInput
                        aria-label={label || "Select option"}
                        displayValue={(item) => item?.[displayKey] || ''}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={placeholder}
                        className={inputClasses}
                        disabled={disabled}
                    />
                    <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5 disabled:cursor-not-allowed">
                        <HiChevronDown className={`size-4 transition-colors ${disabled
                            ? 'fill-gray-400'
                            : 'fill-gray-500 group-hover:fill-gray-700'
                            }`} />
                    </ComboboxButton>
                </div>

                <ComboboxOptions
                    anchor="bottom"
                    transition
                    className="w-[var(--input-width)] border border-gray-300 bg-white shadow-lg rounded-lg empty:invisible z-50 max-h-60 overflow-auto mt-1"
                >
                    {filteredData.length > 0 ? (
                        filteredData.map((item, index) => (
                            <ComboboxOption
                                key={item[idKey] || index}
                                value={item}
                                className="group flex cursor-pointer items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-blue-100 hover:bg-gray-50"
                            >
                                {renderOptionDisplay ? renderOptionDisplay(item) : (
                                    <div className="text-sm/6 text-gray-900 truncate">
                                        {item[displayKey] || 'Unnamed item'}
                                    </div>
                                )}
                                <HiCheckCircle size={20} className="invisible fill-primary group-data-[selected]:visible" />
                            </ComboboxOption>
                        ))
                    ) : (
                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700 text-sm">
                            {query ? emptyMessage : 'No options available'}
                        </div>
                    )}
                </ComboboxOptions>
            </Combobox>
        </div>
    )
}

export default ComboBox