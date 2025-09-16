import React, { useState, useEffect } from "react";

const FilterMenu = ({ onApplyFilter, filters, filterOptions }) => {
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleFilterChange = (key, value) => {
        const updatedFilters = {
            ...localFilters,
            [key]: value,
        };
        setLocalFilters(updatedFilters);
        onApplyFilter(updatedFilters);
    };

    const handleClearFilter = () => {
        const clearedFilters = Object.keys(localFilters).reduce((acc, key) => {
            if (Array.isArray(localFilters[key])) {
                acc[key] = [];
            } else if (
                typeof localFilters[key] === "object" &&
                localFilters[key] !== null
            ) {
                acc[key] = { start: "", end: "" };
            } else {
                acc[key] = "";
            }
            return acc;
        }, {});

        setLocalFilters(clearedFilters);
        onApplyFilter(clearedFilters);
    };

    const renderFilterFields = () => {
        return Object.entries(filterOptions).map(([key, options]) => {
            const { type, label, choices } = options;

            switch (type) {
                case "select":
                    return (
                        <div key={key} className="">
                            {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                                {label}
                            </label> */}
                            <select
                                value={localFilters[key] || ""}
                                onChange={(e) =>
                                    handleFilterChange(key, e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Categories</option>
                                {choices.map((choice) => (
                                    <option
                                        key={choice.value}
                                        value={choice.value}
                                    >
                                        {choice.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );

                case "date":
                    return (
                        <div key={key} className="">
                            {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                                {label}
                            </label> */}
                            <div className="flex flex-row items-center justify-center gap-2">
                                <div>
                                    <input
                                        type="date"
                                        value={localFilters[key]?.start || ""}
                                        onChange={(e) =>
                                            handleFilterChange(key, {
                                                ...localFilters[key],
                                                start: e.target.value,
                                            })
                                        }
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <p className="block text-xs font-medium text-gray-500 mb-1">
                                    To
                                </p>
                                <div>
                                    <input
                                        type="date"
                                        value={localFilters[key]?.end || ""}
                                        onChange={(e) =>
                                            handleFilterChange(key, {
                                                ...localFilters[key],
                                                end: e.target.value,
                                            })
                                        }
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    );

                case "multiselect":
                    return (
                        <div key={key} className="">
                            {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                                {label}
                            </label> */}
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {choices.map((choice) => (
                                    <label
                                        key={choice.value}
                                        className="flex items-center"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={
                                                localFilters[key]?.includes(
                                                    choice.value
                                                ) || false
                                            }
                                            onChange={(e) => {
                                                const currentValues =
                                                    localFilters[key] || [];
                                                const newValues = e.target
                                                    .checked
                                                    ? [
                                                          ...currentValues,
                                                          choice.value,
                                                      ]
                                                    : currentValues.filter(
                                                          (val) =>
                                                              val !==
                                                              choice.value
                                                      );
                                                handleFilterChange(
                                                    key,
                                                    newValues
                                                );
                                            }}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            {choice.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    );

                default:
                    return null;
            }
        });
    };

    return renderFilterFields();
};

export default FilterMenu;
