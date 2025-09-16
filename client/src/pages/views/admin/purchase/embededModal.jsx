import React, { useEffect, useState } from 'react'
import useAuthStore from '../../../../services/stores/authStore';
import usePurchaseStore from '../../../../services/stores/purchase/purchaseStore';
import useSuppliersStore from '../../../../services/stores/suppliers/suppliersStore';
import "./purchaseStyles.css"
import ComboBox from '../../../../components/ComboBox';
import useProductsStore from '../../../../services/stores/products/productsStore';
import { Textarea } from '@headlessui/react';
import { isMoreThanOneYearAhead } from '../../../../services/utilities/convertDate';
import { NAL } from '../../../../components/modalAlert';

const EmbededModal = ({ handleToggleAdd, setNewPurchase, newPurchase, isUpdate, _isLoading, pageInfo }) => {
    const { addPurchase, updatePurchase } = usePurchaseStore();
    const { suppliers: SuppliersData, getActiveSuppliers, isLoading } = useSuppliersStore()
    const { getCustomProduct, data } = useProductsStore();
    const { token, auth } = useAuthStore();
    const [errorMsg, setErrorMsg] = useState("");
    const [dateWarningMsg, setDateWarningMsg] = useState({});
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [supBasicInfo, setSupBasicInfo] = useState({})

    useEffect(() => {
        if (token) {
            getActiveSuppliers(token)
            getCustomProduct(token)
        }
    }, [token]);

    useEffect(() => {
        if (SuppliersData) setSuppliers(SuppliersData);
        if (data) setProducts(data);
    }, [SuppliersData, data])

    useEffect(() => {
        if (!newPurchase.products) {
            setNewPurchase(prev => ({
                ...prev,
                products: []
            }));
        }
    }, []);

    useEffect(() => {
        if (newPurchase?.supplier !== "") {
            const selectedSupplier = suppliers.find(sup => sup._id === newPurchase.supplier);

            if (selectedSupplier) {
                const { firstname, middlename, lastname, companyAddress, ...res } = selectedSupplier;

                const { street, barangay, municipality, province } = companyAddress;
                const address = `Street ${street}, Brgy. ${barangay}, ${municipality}, ${province}`;

                const name = firstname + " " + middlename + " " + lastname;
                console.log(res, "----")
                setSupBasicInfo({ ...res, name, address })
            }
        }
    }, [newPurchase, suppliers])

    const handleSubmit = async (e) => {
        e.preventDefault();
        let { supplier, items, notes, purchaseDate } = newPurchase;
        const isInValid = items.some(item => {
            const hasId = item.product !== "";
            return !hasId || item.quantity <= 0 || !item.unitPrice <= 0;
        }) && supplier === "";

        if (isInValid) {
            setErrorMsg("Please fill all the required fields!");
            return;
        }

        const totalAmount = items.reduce((total, item) => {
            return total + (item.quantity * item.unitPrice)
        }, 0)

        const formatedITems = items.map((item) => {
            let obj = { ...item }
            if (item.expiryDate && !item.expiryDate.includes('T')) {
                const date = new Date(`${item.expiryDate}T00:00:00Z`);
                obj.expiryDate = date.toISOString();
            }
            return obj
        })

        const date = new Date()
        const formatedDate = date.toISOString()
        let purchasePrd = {
            transactionType: "PURCHASE",
            supplier,
            items: formatedITems,
            purchaseDate: purchaseDate !== "" ? purchaseDate : formatedDate,
            totalAmount,
            createdBy: auth._id,
            notes,
        };

        let text = isUpdate ? "You want to save the update for this purchase?" : "You want to Add this purchase?"
        const result = await NAL({
            title: "Are you sure?",
            text: text,
            icon: "question",
            showCancel: true,
            confirmText: "Yes"
        })

        if (result.isConfirmed) {

            if (isUpdate) {
                const { currentPage, itemsPerPage } = pageInfo;
                await updatePurchase(token, { ...purchasePrd, _id: newPurchase._id, updatedBy: auth._id, page: currentPage, limit: itemsPerPage });
                return
            }
            await addPurchase(token, purchasePrd);
        }
    }

    // Add new row
    const handleAddItem = () => {
        setNewPurchase((prev) => ({
            ...prev,
            items: [...prev.items, { product: null, quantity: 1, unitPrice: 0 }]
        }));
    };

    // Delete row
    const handleDeleteItem = (index) => {
        setNewPurchase((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    // Handle product selection and quantity/price changes
    const handleSet = (index, field, value) => {
        const isValid = isMoreThanOneYearAhead(value)
        if (!isValid) {
            setDateWarningMsg((prev) => ({ ...prev, [index]: "Date should be atleast greater than one year" }))
        } else {
            setDateWarningMsg((prev) => ({ ...prev, [index]: "" }))
        }

        setNewPurchase((prev) => {
            const updatedItems = [...prev.items];

            if (field === 'product') {
                const selectedItem = products.find(item => item._id === value)
                updatedItems[index] = {
                    ...updatedItems[index],
                    product: value,
                    unitPrice: value ? selectedItem.sellingPrice : 0
                };
            } else {
                if (field === "expiryDate") {
                    updatedItems[index] = {
                        ...updatedItems[index],
                        [field]: value
                    };
                }

                const val = Number(value);
                if (val > 0) {
                    updatedItems[index] = {
                        ...updatedItems[index],
                        [field]: Number(value) || 0
                    };
                }
            }

            return { ...prev, items: updatedItems };
        });
    };

    return (
        <div className="w-full">
            <div className='bg-white p-4 rounded-md flex flex-col gap-5 max-w-7xl m-auto'>
                <h3 className="text-2xl font-semibold text-[var(--primary-color)]">
                    {isUpdate ? "Update purchase" : "Add new purchase"}
                </h3>

                <div className="mt-2">
                    <h2 className="text-base/7 font-semibold text-gray-900">Purchase Information</h2>
                    <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <ComboBox
                                handleDataChange={(value) => setNewPurchase((prev) => ({ ...prev, supplier: value }))}
                                data={suppliers}
                                selectedData={supBasicInfo._id}
                                displayKey="companyName"
                                idKey="_id"
                                label="Supplier"
                                placeholder="Choose Supplier..."
                                required={true}
                                disabled={isLoading}
                                className="border-2"
                                emptyMessage="No Supplier match your search."
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="supplier-name" className="block text-sm/6 font-medium text-gray-900">
                                Supplier name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="supplier-name"
                                    value={supBasicInfo.name || ""}
                                    disabled={true}
                                    type="text"
                                    autoComplete="off"
                                    className="block w-full rounded-md bg-gray-50 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="supplier-contact" className="block text-sm/6 font-medium text-gray-900">
                                Supplier Contact
                            </label>
                            <div className="mt-2">
                                <input
                                    id="supplier-contact"
                                    value={supBasicInfo?.contactNumber || ""}
                                    disabled={true}
                                    type="text"
                                    autoComplete="off"
                                    className="block w-full rounded-md bg-gray-50 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="company-address" className="block text-sm/6 font-medium text-gray-900">
                                Company address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="company-address"
                                    value={supBasicInfo.address || ""}
                                    disabled={true}
                                    type="text"
                                    autoComplete="off"
                                    className="block w-full rounded-md bg-gray-50 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pb-2">
                    <label className="block text-base/7 font-semibold text-gray-900">
                        <span className='required'></span>
                        Order items
                    </label>
                    <div className="mt-2 flex flex-wrap flex-col gap-4">
                        {newPurchase?.items.length > 0 ? newPurchase.items.map((item, index) => (
                            <div key={index} className="flex gap-4 items-center justify-center">
                                <ComboBox
                                    handleDataChange={(value) => handleSet(index, 'product', value)}
                                    label="Product"
                                    data={products}
                                    renderOptionDisplay={(item) => (
                                        <div className="text-sm/6 text-gray-900 truncate">
                                            {item.productName} {item.unitSize}{item.unit} - ₱{item.sellingPrice}
                                        </div>
                                    )}
                                    selectedData={item.product}
                                    displayKey="productName"
                                    idKey="_id"
                                    required={true}
                                    placeholder="Select a product"
                                    emptyMessage="No Product match your search."
                                    value={item.product}
                                />

                                <div className="w-full">
                                    <label htmlFor={`quantity-${index}`} className="block text-sm font-medium text-gray-900">
                                        Quantity
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id={`quantity-${index}`}
                                            value={item.quantity}
                                            type="string"
                                            onChange={(e) => handleSet(index, 'quantity', e.target.value)}
                                            className="block w-full rounded-md bg-gray-50 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="w-full">
                                    <label htmlFor={`price-${index}`} className="block text-sm font-medium text-gray-900">
                                        Price
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id={`price-${index}`}
                                            value={item.unitPrice}
                                            type="string"
                                            onChange={(e) => handleSet(index, 'unitPrice', e.target.value)}
                                            className="block w-full rounded-md bg-gray-50 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="w-full">
                                    <label htmlFor={`exp-date-${index}`} className="block text-sm font-medium text-gray-900">
                                        Expiry Date
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id={`exp-date-${index}`}
                                            value={item?.expiryDate?.split('T')[0] || ""}
                                            type="date"
                                            min={new Date().toISOString().split("T")[0]}
                                            onChange={(e) => handleSet(index, 'expiryDate', e.target.value)}
                                            className="block w-full rounded-md bg-gray-50 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                                        />
                                    </div>
                                    {dateWarningMsg?.[index] && (
                                        <p className='text-xs text-yellow-500'>{dateWarningMsg?.[index]}</p>
                                    )}
                                </div>

                                <div className="w-24">
                                    <p className="text-sm font-medium text-gray-900">
                                        Total: ₱{(item.quantity * item.unitPrice).toFixed(2)}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleDeleteItem(index)}
                                    className="bg-accent p-2 rounded-md text-[var(--text-color)] hover:bg-red-600 text-sm font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        )) : (
                            <div className="flex items-center justify-start text-sm text-[var(--secondary-color)]">
                                Click on add Item to add a product to purchase
                            </div>
                        )}
                        <div className="w-full flex items-start">
                            <button
                                onClick={handleAddItem}
                                className="mt-2 border-2 rounded-md p-2 border-[var(--secondary-color)] text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                            >
                                Add Item
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pb-2">
                    <label htmlFor="notes" className="relative w-full mb-2 text-sm/6 font-medium text-gray-900 block">
                        <span>Notes</span>
                    </label>
                    <div className="mt-2">
                        <Textarea
                            required
                            id="notes"
                            name="notes"
                            type="text"
                            placeholder='Add a notes...'
                            value={newPurchase.notes}
                            onChange={(e) => setNewPurchase((prev) => ({ ...prev, notes: e.target.value }))}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                    </div>
                </div>
                {errorMsg && (
                    <div className='text-red-800 bg-red-200 p-2 flex justify-center rounded-md mt-4'>{errorMsg}</div>
                )}

                <div className="mt-4">
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-5">
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e)}
                            disabled={_isLoading}
                            className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold bg-primary text-[var(--text-color)] hover:bg-[var(--primary-hover-color)] sm:ml-3 sm:w-auto shadow-xs`}
                        >
                            {isUpdate ? "Update" : "Save"}
                        </button>

                        <button
                            type="button"
                            data-autofocus
                            disabled={_isLoading}
                            onClick={() => handleToggleAdd(false)}
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-red-300 hover:text-red-800 sm:mt-0 sm:w-auto"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmbededModal