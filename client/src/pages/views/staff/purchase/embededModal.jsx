import React, { useEffect, useState } from 'react'
import useAuthStore from '../../../../services/stores/authStore';
import usePurchaseStore from '../../../../services/stores/purchase/purchaseStore';
import useSuppliersStore from '../../../../services/stores/suppliers/suppliersStore';
import { Checkbox } from '@headlessui/react';
import { ENDPOINT } from '../../../../services/utilities';
import { FiPlus, FiMinus } from "react-icons/fi";
import "./purchaseStyles.css"
import { NAL } from '../../../../components/modalAlert';

const EmbededModal = ({ setIsOpen, setNewPurchase, newPurchase, isUpdate, setIsUpdate, temp }) => {
    const { addPurchase, updatePurchase } = usePurchaseStore();
    const { data: SuppliersData, getSuppliers } = useSuppliersStore()
    const { token, auth } = useAuthStore();
    const [errorMsg, setErrorMsg] = useState("");
    const [suppliers, setSuppliers] = useState([]);
    const [supBasicInfo, setSupBasicInfo] = useState({})
    const [productInputs, setProductInputs] = useState({});

    useEffect(() => {
        if (token) {
            getSuppliers(token)
        }
    }, [token]);

    useEffect(() => {
        if (SuppliersData) {
            setSuppliers(SuppliersData)
        }
    }, [SuppliersData])

    useEffect(() => {
        if (!newPurchase.products) {
            setNewPurchase(prev => ({
                ...prev,
                products: []
            }));
        }
    }, []);

    const handleSupplierData = (key, value) => {
        if (key === 'supplier' && value === '') {
            setNewPurchase(temp);
        } else {
            setNewPurchase((prev) => ({
                ...prev,
                [key]: value
            }));
        }
    }

    useEffect(() => {
        if (supBasicInfo?.products?.length > 0) {
            const inputsState = {};

            supBasicInfo.products.forEach(product => {
                const existingProduct = newPurchase.products?.find(p => p.id === product._id || p.product?._id === product._id);

                const date = new Date(existingProduct?.expiryDate);

                let expDate = existingProduct?.expiryDate;

                if (!isNaN(date.getTime()) && expDate.includes("T") && expDate.includes("Z")) {
                    expDate = expDate.split("T")[0];
                }

                inputsState[product._id] = {
                    price: existingProduct?.price || 0,
                    stock: existingProduct?.stock || 1,
                    expiryDate: expDate || '',
                    isChecked: !!existingProduct
                };
            });

            console.log(inputsState);

            setProductInputs(inputsState);
        }
    }, [supBasicInfo, newPurchase.supplier]);

    const handleProductSelection = (productId, isChecked) => {
        setProductInputs(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                isChecked
            }
        }));

        setNewPurchase((prev) => {
            const currentProducts = Array.isArray(prev.products) ? [...prev.products] : [];

            if (!isChecked) {
                return {
                    ...prev,
                    products: currentProducts.filter(item => item.id !== productId)
                };
            } else {
                if (!currentProducts.some(item => item.id === productId)) {
                    const productInput = productInputs[productId] || { price: 0, stock: 1, expiryDate: '' };

                    return {
                        ...prev,
                        products: [
                            ...currentProducts,
                            {
                                id: productId,
                                stock: productInput.stock,
                                price: productInput.price,
                                expiryDate: productInput.expiryDate
                            }
                        ]
                    };
                }
                return prev;
            }
        });
    }

    const updateProductInput = (productId, field, value) => {
        if (field === 'expiryDate') {

            const today = new Date();
            const pickedDate = new Date(value);

            today.setHours(0, 0, 0, 0);
            pickedDate.setHours(0, 0, 0, 0);

            const fieldElement = document.querySelector('.dateInp');
            if (pickedDate < today) {
                fieldElement.style.border = "2px solid red";
                return
            } else {
                fieldElement.style.border = "none";
            }
        }

        if (field === 'price') {
            const fieldElement = document.querySelector('.priceInp');
            if (Number(value) <= 0) {
                fieldElement.style.border = "2px solid red";
                return
            } else {
                fieldElement.style.border = "none";
            }
        }


        if (field === 'stock') {
            const fieldElement = document.querySelector('.stockInp');
            if (Number(value) <= 0) {
                fieldElement.style.border = "2px solid red";
                return
            } else {
                fieldElement.style.border = "none";
            }
        }

        setProductInputs(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                [field]: value
            }
        }));

        if (productInputs[productId]?.isChecked) {
            setNewPurchase((prev) => {
                const updatedProducts = prev.products.map(product => {
                    if (product.id === productId) {
                        return { ...product, [field]: value };
                    }
                    return product;
                });

                return {
                    ...prev,
                    products: updatedProducts
                };
            });
        }
    }

    const handleStockChange = (productId, increment) => {
        const currentStock = productInputs[productId]?.stock || 1;
        const newStock = Math.max(1, currentStock + increment);

        updateProductInput(productId, 'stock', newStock);
    }

    useEffect(() => {
        if (Object.keys(newPurchase).length > 0) {
            const selectedSupplier = suppliers.find(sup => sup._id === newPurchase.supplier);

            if (selectedSupplier) {
                const { firstname, middlename, lastname, companyAddress, ...res } = selectedSupplier;

                const { street, barangay, municipality, province } = companyAddress;
                const address = `Street ${street}, Brgy. ${barangay}, ${municipality}, ${province}`;

                const name = firstname + " " + middlename + " " + lastname;
                setSupBasicInfo({ ...res, name, address })
            }
        }
    }, [newPurchase, suppliers])

    const handleSubmit = async (e) => {
        e.preventDefault();
        let { supplier, products } = newPurchase;

        const isInValid = products.some(item => !item.id || !item.expiryDate || !item.price || !item.stock)

        if (
            supplier === "" ||
            !products.length || isInValid
        ) {
            setErrorMsg("Please fill all the required fields!");
            return;
        }

        const purchasePrd = {
            ...newPurchase,
            purchaseDate: new Date(),
            createdBy: auth._id
        };

        if (isUpdate) {
            const result = await NAL({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancel: true,
                confirmText: "Yes, Submit it!"
            })

            if (result.isConfirmed) {
                await updatePurchase(token, purchasePrd);
            }
            return;
        }

        const result = await NAL({
            title: "Are you sure?",
            text: "You want to Add this!",
            icon: "warning",
            showCancel: true,
            confirmText: "Yes"
        })

        if (result.isConfirmed) {
            await addPurchase(token, purchasePrd);
        }
    }

    const handleCancel = () => {
        setIsOpen(false);
        setIsUpdate(false);
        setNewPurchase(temp);
    }

    useEffect(() => {
        if (errorMsg) {
            setTimeout(() => {
                setErrorMsg("");
            }, 3000);
        }
    }, [errorMsg])

    const isProductSelected = (productId) => {
        return productInputs[productId]?.isChecked || false;
    }

    return (
        <div className='bg-white p-4 rounded-md flex flex-col gap-5'>
            <h3 className="text-2xl font-semibold text-[#4154F1]">
                {isUpdate ? "Update purchase" : "Add new purchase"}
            </h3>

            <div className="mt-2">
                <h2 className="text-base/7 font-semibold text-gray-900">Purchase Information</h2>
                <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm/6 font-medium text-gray-900">
                            <span className='required'></span>
                            Supplier
                        </label>
                        <select
                            name="supplier"
                            value={newPurchase.supplier?._id || ""}
                            onChange={(e) => handleSupplierData(e.target.name, e.target.value)}
                            className="mt-1 block w-full select px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">--Select Supplier--</option>
                            {suppliers.map((sup, i) => (
                                <option key={i} value={sup._id}>{sup.companyName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="middle-name" className="block text-sm/6 font-medium text-gray-900">
                            Supplier name
                        </label>
                        <div className="mt-2">
                            <input
                                value={supBasicInfo.name || ""}
                                disabled={true}
                                type="text"
                                autoComplete="off"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="middle-name" className="block text-sm/6 font-medium text-gray-900">
                            Supplier Contact
                        </label>
                        <div className="mt-2">
                            <input
                                value={supBasicInfo?.contactNumber || ""}
                                disabled={true}
                                type="text"
                                autoComplete="off"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="middle-name" className="block text-sm/6 font-medium text-gray-900">
                            Company address
                        </label>
                        <div className="mt-2">
                            <input
                                value={supBasicInfo.address || ""}
                                disabled={true}
                                type="text"
                                autoComplete="off"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <div className="border-b border-gray-900/10 pb-2">
                    <h2 className="text-base/7 font-semibold text-gray-900">Company Products</h2>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4">
                        {supBasicInfo?.products?.length > 0 && supBasicInfo.products.map((item, i) => {
                            const inputValues = productInputs[item._id] || { price: 0, stock: 1, expiryDate: '' };

                            return (
                                <div className='bg-gray-100 rounded-md flex justify-between items-center p-2 gap-2' key={i}>
                                    <div className="flex gap-2 justify-center items-center">
                                        <Checkbox
                                            className="group block size-5 rounded-full bg-white border border-gray-400 data-[checked]:bg-blue-200"
                                            checked={isProductSelected(item._id)}
                                            onChange={(isChecked) => handleProductSelection(item._id, isChecked)}
                                        >
                                            <svg className="stroke-blue-800 opacity-0 group-data-[checked]:opacity-100" viewBox="0 0 14 14" fill="none">
                                                <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </Checkbox>

                                        <div className="flex flex-col gap-1">
                                            <img src={`${ENDPOINT}/assets/products/${item.image}`} alt="product" className='h-15 w-15' />
                                        </div>

                                        <div className='text-sm flex flex-col min-w-20 max-w-20'>
                                            <span className='text-gray-500'>Name:</span>
                                            <span className='text-gray-800 text-wrap'>{item.productName}</span>
                                        </div>

                                        <div className='text-sm flex flex-col'>
                                            <span className='text-gray-500'>Size:</span>
                                            <span className='text-gray-800'>{item.unitSize} {item.unit}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <p className='text-sm text-gray-500'>Price:</p>
                                        <input
                                            type="number"
                                            name="price"
                                            value={inputValues.price || ''}
                                            onChange={(e) => updateProductInput(item._id, 'price', parseFloat(e.target.value))}
                                            className='input bg-white text-sm h-8 no-spinner priceInp'
                                        />
                                    </div>

                                    <div>
                                        <p className='text-sm text-gray-500'>Expiry Date:</p>
                                        <input
                                            type="date"
                                            name="expiryDate"
                                            value={inputValues.expiryDate || ''}
                                            onChange={(e) => updateProductInput(item._id, 'expiryDate', e.target.value)}
                                            min={new Date().toISOString().split("T")[0]}
                                            className='input bg-white text-sm h-8 dateInp'
                                        />
                                    </div>

                                    <div>
                                        <p className='text-sm text-gray-500'>Quantity:</p>
                                        <div className="flex">
                                            <div
                                                className='bg-white flex items-center justify-center border border-gray-300 p-2 cursor-pointer'
                                                onClick={() => handleStockChange(item._id, 1)}
                                            >
                                                <FiPlus />
                                            </div>
                                            <input
                                                type="number"
                                                value={inputValues.stock || 1}
                                                onChange={(e) => updateProductInput(item._id, 'stock', parseInt(e.target.value, 10) || 1)}
                                                className='focus:border-transparent bg-white text-sm h-9 w-15 border-y-1 border-gray-300 no-spinner text-center stockInp'
                                                min="1"
                                            />
                                            <div
                                                className='bg-white flex items-center justify-center border border-gray-300 p-2 cursor-pointer'
                                                onClick={() => handleStockChange(item._id, -1)}
                                            >
                                                <FiMinus />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {errorMsg && (
                    <div className='text-red-800 bg-red-200 p-2 flex justify-center rounded-md'>{errorMsg}</div>
                )}
            </div>

            <div className="mt-4">
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-5">
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e)}
                        className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold ${isUpdate ? "bg-blue-200 text-blue-800 hover:bg-blue-300" : "bg-green-200 text-green-800 hover:bg-green-300"} sm:ml-3 sm:w-auto shadow-xs`}
                    >
                        {isUpdate ? "Update" : "Save"}
                    </button>

                    <button
                        type="button"
                        data-autofocus
                        onClick={() => handleCancel()}
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-red-300 hover:text-red-800 sm:mt-0 sm:w-auto"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EmbededModal