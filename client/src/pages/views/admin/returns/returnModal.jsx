import React, { useState, useEffect } from 'react';
import { Checkbox } from '@headlessui/react';
import useAuthStore from '../../../../services/stores/authStore';
import useProductsStore from '../../../../services/stores/products/productsStore';
import useReturnsStore from '../../../../services/stores/returns/returnsStore';
import { ENDPOINT } from '../../../../services/utilities';
import NoImage from "../../../../assets/No-Image.webp";

const ReturnModal = ({ setIsOpen, returnData, setReturnData, isUpdate, setIsUpdate }) => {
    const { token, auth } = useAuthStore();
    const { data: productsData } = useProductsStore();
    const { addReturn, updateReturn } = useReturnsStore();

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (productsData) {
            const filtered = productsData.filter(product =>
                product.productName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [productsData, searchTerm]);

    useEffect(() => {
        if (isUpdate && returnData.products) {
            const selected = returnData.products.map(item => ({
                id: item.product._id,
                productName: item.product.productName,
                image: item.product.image,
                quantity: item.quantity
            }));
            setSelectedProducts(selected);
        }
    }, [isUpdate, returnData]);

    const handleProductSelection = (product) => {
        const exists = selectedProducts.find(p => p.id === product._id);

        if (exists) {
            setSelectedProducts(selectedProducts.filter(p => p.id !== product._id));
        } else {
            setSelectedProducts([...selectedProducts, {
                id: product._id,
                productName: product.productName,
                image: product.image,
                quantity: 1
            }]);
        }
    };

    const updateQuantity = (id, quantity) => {
        setSelectedProducts(selectedProducts.map(product => {
            if (product.id === id) {
                return { ...product, quantity: Math.max(1, quantity) };
            }
            return product;
        }));
    };

    const handleSubmit = async () => {
        if (selectedProducts.length === 0) {
            setErrorMsg('Please select at least one product');
            return;
        }

        if (!returnData.notes) {
            setErrorMsg('Please provide a reason for the return');
            return;
        }

        const data = {
            products: selectedProducts.map(product => ({
                product: product.id,
                quantity: product.quantity
            })),
            notes: returnData.notes,
            transactionType: 'RETURN',
            createdBy: auth._id
        };

        if (isUpdate) {
            await updateReturn({ ...data, _id: returnData._id }, token);
        } else {
            await addReturn(data, token);
        }
    };

    return (
        <div className='bg-white shadow-md rounded-lg p-6'>
            <h2 className="text-2xl font-semibold mb-6 text-[var(--primary-color)]">{isUpdate ? 'Update Return' : 'Add New Return'}</h2>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className='required'></span> Reason for Return
                </label>
                <textarea
                    value={returnData.notes || ''}
                    onChange={(e) => setReturnData({ ...returnData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    rows="3"
                    placeholder="Specify the reason for return..."
                    required
                ></textarea>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className='required'></span> Select Products
                </label>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-4"
                />

                {selectedProducts.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Products</h3>
                        <div className="border border-gray-200 rounded-md p-2">
                            {selectedProducts.map((product, index) => (
                                <div key={index} className="flex items-center justify-between p-2 border-b last:border-b-0">
                                    <div className="flex items-center">
                                        <img
                                            src={`${ENDPOINT}/assets/products/${product.image}`}
                                            alt={product.productName}
                                            className="h-10 w-10 rounded-md object-cover mr-3"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = NoImage;
                                            }}
                                        />
                                        <span className="text-sm font-medium">{product.productName}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(product.id, product.quantity - 1)}
                                            className="p-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-100"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={product.quantity}
                                            onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 1)}
                                            className="mx-2 w-16 text-center border border-gray-300 rounded-md p-1"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(product.id, product.quantity + 1)}
                                            className="p-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
                    {filteredProducts.length === 0 ? (
                        <p className="text-center py-4 text-gray-500">No products found</p>
                    ) : (
                        filteredProducts.map(product => (
                            <div key={product._id} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                                <Checkbox
                                    checked={selectedProducts.some(p => p.id === product._id)}
                                    onChange={() => handleProductSelection(product)}
                                    className="group block size-4 rounded-full bg-white border border-gray-400 data-[checked]:bg-blue-200"
                                >
                                    <svg className="stroke-blue-800 opacity-0 group-data-[checked]:opacity-100" viewBox="0 0 14 14" fill="none">
                                        <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Checkbox>
                                <div className="flex items-center ml-3">
                                    <img
                                        src={`${ENDPOINT}/assets/products/${product.image}`}
                                        alt={product.productName}
                                        className="h-10 w-10 rounded-md object-cover mr-3"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = NoImage;
                                        }}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{product.productName}</p>
                                        <p className="text-xs text-gray-500">{product.unitSize} {product.unit}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {errorMsg && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {errorMsg}
                </div>
            )}

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={() => {
                        setIsOpen(false);
                        setIsUpdate(false);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-[var(--text-color)] hover:bg-indigo-700"
                >
                    {isUpdate ? 'Update Return' : 'Submit Return'}
                </button>
            </div>
        </div>
    );
};

export default ReturnModal;