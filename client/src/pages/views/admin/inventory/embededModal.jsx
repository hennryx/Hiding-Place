import React, { useEffect, useState, useRef } from "react";
import useAuthStore from "../../../../services/stores/authStore";
import useProductsStore from "../../../../services/stores/products/productsStore";
import NoImage from "../../../../assets/No-Image.webp";
import { Textarea } from "@headlessui/react";
import { NAL } from "../../../../components/modalAlert";

const EmbededModal = ({
    handleToggle,
    setNewProduct,
    newProduct,
    isUpdate,
    isLoading,
    pageInfo,
}) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const fileInputRef = useRef(null);

    const { addProduct, updateProduct } = useProductsStore();
    const { token, auth } = useAuthStore();

    const categories = [
        "Energy Drink",
        "Soda",
        "Beer",
        "Probiotics",
        "Fruit juice",
        "Water",
    ];

    const handleProductData = (key, value) => {
        setNewProduct((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (!selectedFile.type.match("image.*")) {
                setErrorMsg("Please select an image file");
                return;
            }

            if (selectedFile.size > 5 * 1024 * 1024) {
                setErrorMsg("Image size should be less than 5MB");
                return;
            }

            handleProductData("image", selectedFile);
            if (selectedFile) {
                setImagePreview(URL.createObjectURL(selectedFile));
            } else {
                setImagePreview(null);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const {
            productName,
            image,
            unit,
            unitSize,
            sellingPrice,
            category,
            containerType,
            brand,
            description,
        } = newProduct;

        if (
            productName.trim() === "" ||
            containerType.trim() === "" ||
            brand.trim() === "" ||
            !image ||
            String(unit).trim() === "" ||
            String(unitSize).trim() === "" ||
            String(sellingPrice).trim() === "" ||
            String(category).trim() === ""
        ) {
            setErrorMsg("Please fill all the required fields!");
            return;
        }

        if (Number(sellingPrice) < 0) {
            setErrorMsg(`Invalid price, cannot be lower than 0`);
            return;
        }

        const formData = new FormData();
        formData.append("productName", productName);
        formData.append("image", image);
        formData.append("unit", unit);
        formData.append("unitSize", unitSize);
        formData.append("sellingPrice", sellingPrice);
        formData.append("createdBy", auth?._id);
        formData.append("category", category);
        formData.append("containerType", containerType);
        formData.append("description", description);
        formData.append("brand", brand);

        let text = isUpdate
            ? "You want to update this product!"
            : "You want to add this product!";
        const result = await NAL({
            title: "Are you sure?",
            text: text,
            icon: "warning",
            showCancel: true,
            confirmText: "Yes, Update it!",
        });

        if (result.isConfirmed) {
            if (isUpdate) {
                formData.append("_id", newProduct._id);
                formData.append("updatedBy", auth._id);

                formData.append("page", pageInfo.currentPage);
                formData.append("limit", pageInfo.itemsPerPage);

                await updateProduct(formData, token);
            } else {
                formData.append("createdBy", auth._id);
                await addProduct(formData, token);
            }
            setImagePreview(null);
        }
    };

    useEffect(() => {
        let timeout;
        if (errorMsg) {
            timeout = setTimeout(() => {
                setErrorMsg("");
            }, 3000);
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [errorMsg]);

    return (
        <div className="bg-white p-4 rounded-md flex flex-col gap-5">
            <h3 className="text-2xl font-semibold text-[var(--primary-color)]">
                {isUpdate ? "Update Product" : "Add New Product"}
            </h3>

            <div className="mt-2 flex flex-col gap-y-4">
                <h2 className="text-base/7 font-semibold text-gray-900">
                    Product Information
                </h2>

                <div className="mt-8 grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-4">
                    <div className="sm:col-span-1">
                        <div className="sm:col-span-6">
                            <label
                                htmlFor="product-image"
                                className="block text-sm/6 font-medium text-gray-900"
                            >
                                <span className="required"></span>
                                Product Image
                            </label>
                            <div className="mt-2 flex flex-col items-center gap-4">
                                <div className="h-40 w-40 overflow-hidden rounded border border-gray-300 bg-gray-100 flex items-center justify-center">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Product preview"
                                            className="h-full w-full object-cover object-center"
                                        />
                                    ) : (
                                        <img
                                            src={
                                                isUpdate &&
                                                newProduct.image !== null
                                                    ? newProduct.image?.url
                                                    : NoImage
                                            }
                                            alt="Product placeholder"
                                            className="h-40 w-40 text-gray-400"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = NoImage;
                                            }}
                                        />
                                    )}
                                </div>

                                <input
                                    ref={fileInputRef}
                                    required
                                    id="product-image"
                                    name="image"
                                    type="file"
                                    accept="image/jpeg, image/png, image/jpg, image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />

                                <button
                                    type="button"
                                    onClick={triggerFileInput}
                                    className="inline-flex items-center px-4 py-2 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Upload Image
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <div className="grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-4">
                            <div className="sm:col-span-4">
                                <label
                                    htmlFor="product-name"
                                    className="block text-sm/6 font-medium text-gray-900"
                                >
                                    <span className="required"></span>
                                    Product Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        required
                                        id="product-name"
                                        name="productName"
                                        type="text"
                                        autoComplete="off"
                                        value={newProduct.productName}
                                        onChange={(e) =>
                                            handleProductData(
                                                e.target.name,
                                                e.target.value
                                            )
                                        }
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <label
                                    htmlFor="description"
                                    className="relative w-full mb-4 text-sm/6 font-medium text-gray-900 block"
                                >
                                    <span>Description</span>
                                    <span className="absolute -bottom-3 left-0 text-wrap text-xs text-blue-700">
                                        &#40;Not required but its good to
                                        have&#41;
                                    </span>
                                </label>
                                <div className="mt-2">
                                    <Textarea
                                        required
                                        id="description"
                                        name="description"
                                        type="text"
                                        value={newProduct.description}
                                        onChange={(e) =>
                                            handleProductData(
                                                e.target.name,
                                                e.target.value
                                            )
                                        }
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="container-type"
                                    className="block text-sm/6 font-medium text-gray-900"
                                >
                                    <span className="required"></span>
                                    Container
                                </label>
                                <div className="mt-2">
                                    <select
                                        required
                                        id="containerType"
                                        name="containerType"
                                        value={newProduct.containerType}
                                        onChange={(e) =>
                                            handleProductData(
                                                e.target.name,
                                                e.target.value
                                            )
                                        }
                                        className="block select w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    >
                                        <option value="">
                                            Select Container
                                        </option>
                                        <option value="bottle">Bottle</option>
                                        <option value="can">Can</option>
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="brand"
                                    className="block text-sm/6 font-medium text-gray-900"
                                >
                                    <span className="required"></span>
                                    Brand
                                </label>
                                <div className="mt-2">
                                    <input
                                        required
                                        id="brand"
                                        name="brand"
                                        type="text"
                                        value={newProduct.brand}
                                        onChange={(e) =>
                                            handleProductData(
                                                e.target.name,
                                                e.target.value
                                            )
                                        }
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="unit"
                                    className="block text-sm/6 font-medium text-gray-900"
                                >
                                    <span className="required"></span>
                                    Unit
                                </label>
                                <div className="mt-2">
                                    <select
                                        required
                                        id="unit"
                                        name="unit"
                                        value={newProduct.unit}
                                        onChange={(e) =>
                                            handleProductData(
                                                e.target.name,
                                                e.target.value
                                            )
                                        }
                                        className="block select w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    >
                                        <option value="">Select Unit</option>
                                        <option value="l">Liter (l)</option>
                                        <option value="ml">
                                            Milliliter (ml)
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="unit-size"
                                    className="block text-sm/6 font-medium text-gray-900"
                                >
                                    <span className="required"></span>
                                    Unit Size
                                </label>
                                <div className="mt-2">
                                    <input
                                        required
                                        id="unit-size"
                                        name="unitSize"
                                        type="text"
                                        value={newProduct.unitSize}
                                        onChange={(e) =>
                                            handleProductData(
                                                e.target.name,
                                                e.target.value
                                            )
                                        }
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        placeholder="e.g. 250, 500, 1"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="selling-price"
                                    className="block text-sm/6 font-medium text-gray-900"
                                >
                                    <span className="required"></span>
                                    Selling Price
                                </label>
                                <div className="mt-2 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">
                                            ₱
                                        </span>
                                    </div>
                                    <input
                                        required
                                        id="selling-price"
                                        name="sellingPrice"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={newProduct.sellingPrice}
                                        onChange={(e) =>
                                            handleProductData(
                                                e.target.name,
                                                e.target.value
                                            )
                                        }
                                        className="block w-full pl-7 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="category"
                                    className="block text-sm/6 font-medium text-gray-900"
                                >
                                    <span className="required"></span>
                                    Category
                                </label>
                                <div className="mt-2">
                                    <select
                                        required
                                        id="category"
                                        name="category"
                                        value={newProduct.category}
                                        onChange={(e) =>
                                            handleProductData(
                                                e.target.name,
                                                e.target.value
                                            )
                                        }
                                        className="block select w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    >
                                        <option value="">
                                            Select Category
                                        </option>
                                        {categories.map((item, i) => (
                                            <option key={i} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* {isUpdate && (
                                <p className='required'>Update Stock here <br />(in development)</p>
                            )} */}
                        </div>
                    </div>
                </div>

                {errorMsg && (
                    <div className="mt-4 text-red-800 bg-red-200 p-2 flex justify-center rounded-md">
                        {errorMsg}
                    </div>
                )}
            </div>

            <div className="mt-4">
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-5">
                    <button
                        disabled={isLoading}
                        type="button"
                        onClick={handleSubmit}
                        className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold ${
                            isLoading
                                ? "bg-blue-100 text-blue-200"
                                : "bg-primary text-[var(--text-color)] hover:bg-[var(--primary-hover-color)]"
                        } sm:ml-3 sm:w-auto shadow-xs`}
                    >
                        {isUpdate ? "Update" : "Save"}
                    </button>

                    <button
                        type="button"
                        onClick={() => handleToggle(false, "add")}
                        disabled={isLoading}
                        className={`mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-xs ring-1 ring-gray-300 ring-inset ${
                            isLoading
                                ? "bg-gray-300 text-gray-400"
                                : " bg-white hover:bg-red-300 text-gray-900 hover:text-red-800"
                        } sm:mt-0 sm:w-auto`}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmbededModal;
