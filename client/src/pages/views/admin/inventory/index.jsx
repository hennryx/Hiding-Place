import React, { useEffect, useState } from "react";
import Table from "./table";
import { BsBoxSeam } from "react-icons/bs";
import { FaBoxOpen } from "react-icons/fa6";
import { BsBoxSeamFill } from "react-icons/bs";
import Card from "./card";
import useAuthStore from "../../../../services/stores/authStore";
import useProductsStore from "../../../../services/stores/products/productsStore";
import EmbededModal from "./embededModal";
import ReduceDrawer from "./reduceDrawer";
import { NAL } from "../../../../components/modalAlert";
import { IoIosAdd } from "react-icons/io";

const info = {
    productName: "",
    unit: "",
    unitSize: "",
    containerType: "",
    sellingPrice: "",
    category: "",
    description: "",
    brand: "",
    createdby: "",
};

const Inventory = () => {
    const { token } = useAuthStore();
    const {
        getProducts,
        data,
        productInfo,
        reset,
        message,
        isSuccess,
        isLoading,
        allCategories,
    } = useProductsStore();
    const [toggleAdd, setToggleAdd] = useState(false);
    const [toggleReduce, setToggleReduce] = useState(false);
    const [productsData, setProductsdata] = useState([]);
    const [newProduct, setNewProduct] = useState(info);
    const [reduceProduct, setReduceProduct] = useState({});
    const [isUpdate, setIsUpdate] = useState(false);
    const [stocksInfo, setStocksInfo] = useState({});
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState([]);
    const [pageInfo, setPageInfo] = useState({});

    const handleUpdate = (_product, currentPage, itemsPerPage) => {
        setToggleAdd(true);
        setPageInfo({
            currentPage,
            itemsPerPage,
        });
        setNewProduct(_product);
        setIsUpdate(true);
    };
    const handleReduceProduct = (_product, currentPage, itemsPerPage) => {
        setReduceProduct(_product);
        setPageInfo({
            currentPage,
            itemsPerPage,
        });
    };
    const handleFetch = async (params) => {
        await getProducts(token, params);
    };

    useEffect(() => {
        if (token) {
            handleFetch({
                page: 1,
                limit: 5,
            });
        }
    }, [token]);

    useEffect(() => {
        const successHandler = async () => {
            if (Object.keys(data).length > 0) {
                setProductsdata(data);
                setCategories(allCategories);
                setStocksInfo(productInfo);
                setTotalPages(productInfo.totalPages);
                setCurrentPage(productInfo.currentPage);
            }

            console.log(isSuccess, message);

            if (isSuccess && message !== "" && message) {
                await NAL({
                    title: "Success",
                    text: message,
                    icon: "info",
                    confirmText: "Ok",
                });
            } else if (!isSuccess && message !== "") {
                await NAL({
                    title: "Oops...",
                    text: message,
                    icon: "error",
                    confirmText: "Ok",
                });
            }
        };

        successHandler();
        handleToggle(false);
        reset();
    }, [data, message, isSuccess]);

    const handleToggle = (toggle, key = "") => {
        if (key === "add" && toggle) {
            setToggleReduce(!toggle);
            setToggleAdd(toggle);
            return;
        }

        if (key === "reduce" && toggle) {
            setToggleAdd(!toggle);
            setToggleReduce(toggle);
            return;
        }

        setIsUpdate(false);
        setToggleAdd(toggle);
        setToggleReduce(toggle);
        setNewProduct(info);
        setPageInfo({});
    };

    return (
        <div className="container p-4">
            <div className="flex flex-col gap-5 pt-4">
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-[var(--primary-color)]">
                            Inventory
                        </h2>
                        <p className="text-sm">
                            Track and manage your stock levels
                        </p>
                    </div>

                    <button
                        className="flex items-center justify-center p-2 rounded-md whitespace-nowrap bg-[var(--primary-color)] text-[var(--text-primary-color)] hover:bg-[var(--primary-hover-color)] h-fit text-sm"
                        onClick={() => handleToggle(true, "add")}
                    >
                        <IoIosAdd />
                        Add New Product
                    </button>
                </div>
                {!toggleAdd && (
                    <div>
                        <div className="flex flex-row gap-4 justify-start items-center px-2 w-full">
                            <Card
                                title={"Total items"}
                                textClr={"text-[#525B5F]"}
                                boxClr={"bg-gray-400"}
                                logo={BsBoxSeam}
                                count={stocksInfo.totalNumberItems || 0}
                            />
                            <Card
                                title={"Out of Stock:"}
                                textClr={"text-red-800"}
                                boxClr={"bg-red-200"}
                                logo={FaBoxOpen}
                                count={stocksInfo.outStock || 0}
                            />
                            <Card
                                title={"Low Stock:"}
                                textClr={"text-yellow-800"}
                                boxClr={"bg-yellow-200"}
                                logo={BsBoxSeamFill}
                                count={stocksInfo.minimumStock || 0}
                            />
                        </div>
                    </div>
                )}

                {toggleAdd && (
                    <EmbededModal
                        handleToggle={handleToggle}
                        setNewProduct={setNewProduct}
                        newProduct={newProduct}
                        isUpdate={isUpdate}
                        isLoading={isLoading}
                        pageInfo={pageInfo}
                    />
                )}

                <div className="flex flex-row gap-4">
                    {!toggleAdd && (
                        <div
                            className={`transition-all duration-300 ease-in ${
                                toggleReduce ? "w-2/3" : "w-full"
                            }`}
                        >
                            <Table
                                data={productsData}
                                handleToggle={(status, key) =>
                                    handleToggle(status, key)
                                }
                                handleUpdate={handleUpdate}
                                handleReduceProduct={handleReduceProduct}
                                isLoading={isLoading}
                                loadData={handleFetch}
                                totalPages={totalPages}
                                allCategories={categories}
                                _currentPage={currentPage}
                            />
                        </div>
                    )}

                    {!toggleAdd && toggleReduce && (
                        <div className="w-1/3 bg-white rounded-lg shadow-md transition-all duration-300 ease-in-out">
                            <ReduceDrawer
                                reduceProduct={reduceProduct}
                                onClose={() => handleToggle(false, "reduce")}
                                pageInfo={pageInfo}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Inventory;
