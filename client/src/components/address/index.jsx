import React from "react";
import { Places } from "./places"; // path to your places.js

const AddressSelector = ({ setAddress, address={} }) => {

    const {
        region,
        province,
        municipality,
        barangay,
        street,
        zipcode
    } = address;

    const regions = Object.keys(Places);
    const provinces = region
        ? Object.keys(Places[region].province_list)
        : [];
    const municipalities = province
        ? Object.keys(Places[region].province_list[province].municipality_list)
        : [];
    const barangays = municipality
        ? Places[region].province_list[province].municipality_list[municipality].barangay_list
        : [];

    const handleChange = (key, value) => {
        let updatedAddress = { ...address, [key]: value };

        if (key === "region") {
            updatedAddress = {
                ...updatedAddress,
                province: "",
                municipality: "",
                barangay: ""
            };
        }
        else if (key === "province") {
            updatedAddress = {
                ...updatedAddress,
                municipality: "",
                barangay: ""
            };
        }
        else if (key === "municipality") {
            updatedAddress = {
                ...updatedAddress,
                barangay: ""
            };
        }

        setAddress(updatedAddress);
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
                <label className="block text-sm font-medium">Region</label>
                <select
                    value={region || ""}
                    name="region"
                    onChange={(e) => {
                        handleChange(e.target.name, e.target.value)
                    }}
                    className="select w-full p-2 rounded outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                >
                    <option value="">Select Region</option>
                    {regions.map((region) => (
                        <option key={region} value={region || ""}>
                            {region}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium">Province</label>
                <select
                    value={province || ""}
                    name="province"
                    onChange={(e) => {
                        handleChange(e.target.name, e.target.value)
                    }}
                    className="select w-full p-2 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                    disabled={!region}
                >
                    <option value="">Select Province</option>
                    {provinces.map((province) => (
                        <option key={province} value={province || ""}>
                            {province}
                        </option>
                    ))}
                </select>

            </div>

            <div>
                <label className="block text-sm font-medium">Municipality</label>
                <select
                    value={municipality || ""}
                    name="municipality"
                    onChange={(e) => {
                        handleChange(e.target.name, e.target.value)
                    }}
                    className="select w-full p-2 rounded outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                    disabled={!province}
                >
                    <option value="">Select Municipality</option>
                    {municipalities.map((municipality) => (
                        <option key={municipality} value={municipality || ""}>
                            {municipality}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium">Barangay</label>
                <select
                    value={barangay || ""}
                    name="barangay"
                    onChange={(e) => {
                        handleChange(e.target.name, e.target.value)
                    }}
                    className="select w-full p-2 rounded outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                    disabled={!municipality}
                >
                    <option value="" >Select Barangay</option>
                    {barangays.map((_barangay) => (
                        <option key={_barangay} value={_barangay || ""}>
                            {_barangay}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium">Street</label>
                <input
                    type="text"
                    value={street || ""}
                    name="street"
                    onChange={(e) => {
                        handleChange(e.target.name, e.target.value)
                    }}
                    className="w-full p-2 rounded outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                    placeholder="Enter street"
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Zipcode</label>
                <input
                    type="text"
                    name="zipcode"
                    value={zipcode || ""}
                    onChange={(e) => {
                        handleChange(e.target.name, e.target.value)
                    }}
                    className="w-full p-2 rounded outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                    placeholder="Enter zipcode"
                />
            </div>
        </div>

    );
};

export default AddressSelector;