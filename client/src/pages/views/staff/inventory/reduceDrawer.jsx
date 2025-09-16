import React, { useState } from 'react'
import NoImage from "../../../../assets/No-Image.webp"
import useProductsStore from '../../../../services/stores/products/productsStore';
import useAuthStore from '../../../../services/stores/authStore';

const ReduceDrawer = ({ reduceProduct, onClose, pageInfo }) => {
    const { token, auth } = useAuthStore();
    const { deducProduct } = useProductsStore();

    const [formData, setFormData] = useState({
        items: reduceProduct.map(product => ({
            productId: product._id,
            quantity: 1
        })),
        transactionType: 'SALE',
        notes: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e, productId = "") => {
        const { name, value } = e.target;
        if (name === 'quantity') {
            // Update quantity for specific product
            setFormData(prev => ({
                ...prev,
                items: prev.items.map(item =>
                    item.productId === productId
                        ? { ...item, quantity: Number(value) }
                        : item
                )
            }));
        } else {
            // Handle other fields (transactionType, notes)
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear errors for the changed field
        setErrors(prev => ({
            ...prev,
            [name]: '',
            [`quantity_${productId}`]: ''
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate transactionType
        if (!formData.transactionType) {
            newErrors.transactionType = 'Please select a transaction type';
        }

        // Validate quantities
        formData.items.forEach((item, index) => {
            const product = reduceProduct.find(p => p._id === item.productId);
            if (!item.quantity || item.quantity <= 0) {
                newErrors[`quantity_${item.productId}`] = 'Quantity must be greater than zero';
            } else if (item.quantity > product.totalStock) {
                newErrors[`quantity_${item.productId}`] = `Quantity cannot exceed available stock (${product.totalStock})`;
            }
        });

        return newErrors;
    };

    const handleSubmit = async () => {
        const validationErrors = validateForm();
        console.log("--2--")
        if (Object.keys(validationErrors).length > 0) {
            console.log("--2--", validationErrors)
            setErrors(validationErrors);
            return;
        }

        console.log("----")
        const transactionData = {
            transactionType: formData.transactionType,
            items: formData.items.map(item => {
                const product = reduceProduct.find(p => p._id === item.productId);
                return {
                    product: item.productId,
                    quantity: item.quantity,
                    unitPrice: product.sellingPrice
                };
            }),
            totalAmount: formData.items.reduce((sum, item) => {
                const product = reduceProduct.find(p => p._id === item.productId);
                return sum + item.quantity * product.sellingPrice;
            }, 0),
            notes: formData.notes,
            createdBy: auth._id,
            page: pageInfo.currentPage,
            limit: pageInfo.itemsPerPage
        };

        try {
            await deducProduct(transactionData, token);
        } catch (error) {
            setErrors({ api: error.message });
        }
    };


    const renderProductDetails = () => {

        if (reduceProduct.length > 1) {
            return (
                <div className='overflow-hidden flex items-center flex-col'>
                    <div className="h-32 w-32 overflow-hidden rounded border border-gray-300 bg-gray-100 flex items-center justify-center">
                        {reduceProduct.map((item, i) => (
                            <img
                                key={i}
                                className="h-12 w-12 object-cover rounded-md"
                                src={item.image?.url}
                                alt={item.image?.name}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = NoImage;
                                }}
                            />
                        ))}
                    </div>

                    <table className='table my-2 table-auto'>
                        <thead>
                            <tr className='text-black bg-gray-100'>
                                <th>#</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Size</th>
                                <th>Stock</th>
                                <th>Qty</th>
                            </tr>
                        </thead>
                        <tbody className='text-gray-500'>
                            {reduceProduct.map((item, i) => (
                                <tr key={i} className='border-b-2 border-gray-200'>
                                    <td>{i + 1}</td>
                                    <td>{item.productName}</td>
                                    <td>{item.sellingPrice}</td>
                                    <td>{item.unitSize} {item.unit}</td>
                                    <td>{item.totalStock}</td>
                                    <td>
                                        <div className="rounded-md shadow-sm min-w-16">
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={formData.items.find(it => it.productId === item._id)?.quantity || 1}
                                                onChange={(e) => handleChange(e, item._id)}
                                                min="1"
                                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                            />
                                            {errors[`quantity_${item._id}`] && (
                                                <p className="mt-1 text-sm text-red-600">{errors[`quantity_${item._id}`]}</p>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
        } else if (reduceProduct.length === 1) {
            const { image, productName, sellingPrice, unit, unitSize, totalStock } = reduceProduct[0];
            return (
                <>
                    <div className="h-32 w-32 overflow-hidden rounded border border-gray-300 bg-gray-100 flex items-center justify-center">
                        <img
                            className="h-32 w-32 object-cover rounded-md"
                            src={image?.url}
                            alt={image?.name}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = NoImage;
                            }}
                        />
                    </div>

                    <div className="border-y border-gray-100 w-full py-4">
                        <h3 className="text-lg font-semibold mb-2">Product Details</h3>

                        <div className="grid grid-cols-2 gap-2">
                            <p className="text-sm text-gray-500">Name:</p>
                            <p className="text-sm font-medium">{productName}</p>
                            <p className="text-sm text-gray-500">Price:</p>
                            <p className="text-sm font-medium">₱ {sellingPrice}</p>
                            <p className="text-sm text-gray-500">Size:</p>
                            <p className="text-sm font-medium">{unitSize} {unit}</p>
                            <p className="text-sm text-gray-500">Available Stock:</p>
                            <p className="text-sm font-medium">{totalStock}</p>
                        </div>
                    </div>
                </>
            )
        }
    }


    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center border-b border-gray-200 p-4 mb-4">
                <h2 className="text-xl font-bold">Reduce Stock</h2>
                <button
                    onClick={() => onClose(prev => !prev)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="flex flex-col items-center p-4 gap-4 overflow-auto">
                {renderProductDetails()}

                <div className="w-full space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Transaction Type
                        </label>
                        <select
                            name="transactionType"
                            value={formData.transactionType}
                            onChange={handleChange}
                            className="mt-1 block w-full select px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="SALE">Sale</option>
                            <option value="DAMAGE">Damage/Loss</option>
                        </select>
                        {errors.transactionType && (
                            <p className="mt-1 text-sm text-red-600">{errors.transactionType}</p>
                        )}
                    </div>
                    {reduceProduct.length <= 1 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Quantity to Reduce
                            </label>
                            <div className="mt-1 rounded-md shadow-sm">
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.items[0]?.quantity || 1}
                                    onChange={(e) => handleChange(e, reduceProduct[0]._id)}
                                    min="1"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                            {errors[`quantity_${reduceProduct[0]._id}`] && (
                                <p className="mt-1 text-sm text-red-600">{errors[`quantity_${reduceProduct[0]._id}`]}</p>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {formData.transactionType !== "SALE" && (<span className='required'></span>)}
                            {formData.transactionType === "SALE" ? ('Notes(Optional)') : ("Reason")}
                        </label>
                        <textarea
                            name="notes"
                            rows="3"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Additional information..."
                            className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>

                </div>
            </div>

            <div className="flex justify-end space-x-3 p-4">
                <button
                    type="button"
                    onClick={() => onClose()}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    onClick={() => handleSubmit()}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-[var(--text-color)] bg-indigo-600 hover:bg-indigo-700"
                >
                    Record Transaction
                </button>
            </div>
        </div>
    );
}

export default ReduceDrawer