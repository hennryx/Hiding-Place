import React, { useEffect, useState } from "react";
import { useDebounce } from "../../services/utilities/useDebounce";

const MultiSelect = ({ data, handleFetch, handleChange, field }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const debounceSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    handleFetch({
      search: debounceSearch,
      exclude: selected.length > 0 ? selected.map((item) => item.id) : [],
    });
  }, [debounceSearch]);

  const addItem = (item) => {
    setSelected([...selected, { id: item.id, name: item.name }]);
    handleFetch({
      exclude: [...selected.map((item) => item.id), item.id],
    });
    setSearchTerm("");
    handleChange(field, [...selected.map((s) => s.id), item.id]);
  };

  const removeItem = (item) => {
    setSelected(selected.filter((s) => s.id !== item));
    handleFetch({
      exclude: [...selected.filter((s) => s.id !== item)],
    });
    handleChange(field, [...selected.filter((s) => s.id !== item)]);
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
        {selected.map((item) => (
          <span
            key={item.id}
            className="bg-[var(--primary-color)] text-white px-3 py-1 rounded-full flex items-center"
          >
            {item.name}
            <button
              onClick={() => removeItem(item.id)}
              className="ml-2 text-white hover:text-red-300"
            >
              ✕
            </button>
          </span>
        ))}

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search and add..."
          className="flex-grow outline-none p-1"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
      </div>

      {isFocused && data.length > 0 && (
        <ul className="border mt-2 rounded-lg bg-white shadow">
          {data
            .filter((dt) => !selected.some((s) => s.id === dt.id))
            .map((item) => (
              <li
                key={item.id}
                onClick={() => addItem(item)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {item.name}
              </li>
            ))}
        </ul>
      )}

      {isFocused &&
        (data.length === 0 ||
          data.filter((dt) => !selected.some((s) => s.id === dt.id)).length ===
            0) && (
          <ul className="border mt-2 rounded-lg bg-white shadow">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              No more results
            </li>
          </ul>
        )}
    </div>
  );
};

export default MultiSelect;
