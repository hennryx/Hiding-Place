import React, { useEffect, useState } from "react";
import Table from "./table";
import useAuthStore from "../../../../services/stores/authStore";
import EmbededModal from "./embededModal";
import usePurchaseStore from "../../../../services/stores/purchase/purchaseStore";
import { NAL } from "../../../../components/modalAlert";
import { IoIosAdd } from "react-icons/io";

const info = {
    supplier: "",
    purchaseDate: "",
    items: [],
    notes: "",
    createdBy: "",
};

const Purchase = () => {
    const { token } = useAuthStore();
    const {
        getPurchases,
        data,
        reset,
        message,
        isSuccess,
        isLoading,
        otherInfo,
    } = usePurchaseStore();
    const [toggleAdd, setToggleAdd] = useState(false);
    const [purchaseData, setPurchaseData] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [newPurchase, setNewPurchase] = useState(info);
    const [totalPages, setTotalPages] = useState(0);
    const [pageInfo, setPageInfo] = useState({
        currentPage: 0,
        itemsPerPage: 0,
    });

    const handleFetchData = async (params) => {
        await getPurchases(token, params);
    };

    useEffect(() => {
        if (token) {
            handleFetchData({
                page: 1,
                limit: 5,
            });
        }
    }, [token]);

    useEffect(() => {
        const successHandler = async () => {
            if (data) {
                setPurchaseData(data);
                setTotalPages(otherInfo.totalPages);
            }

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
        handleToggleAdd(false);
        reset();
    }, [data, isSuccess, message]);

    const handleUpdate = (purchase, currentPage, itemsPerPage) => {
        setPageInfo({
            currentPage,
            itemsPerPage,
        });
        setToggleAdd(true);
        setIsUpdate(true);

        let { supplier, items, ...res } = purchase;
        setNewPurchase({
            ...res,
            items: items.map((item) => ({
                ...item,
                product: item.product._id,
            })),
            supplier: supplier._id,
        });
    };

    const handleToggleAdd = (toggle) => {
        if (toggle) {
            setToggleAdd(toggle);
            return;
        }

        setToggleAdd(toggle);
        setNewPurchase(info);
        setIsUpdate(false);
    };
    return (
        <>
            <div className="container p-4">
                <div className="flex flex-col gap-5 pt-4">
                    <div className="flex flex-row gap-2 items-center justify-between">
                        <div className="flex flex-col gap-2 items-center justify-center">
                            <h2 className="text-xl text-[var(--primary-color)]">
                                Delivery
                            </h2>
                            <p className="text-sm">
                                <span
                                    className={`${
                                        toggleAdd
                                            ? "text-[#989797] cursor-pointer"
                                            : "text-gray-600"
                                    }`}
                                    onClick={() => setToggleAdd(false)}
                                >
                                    delivery
                                </span>{" "}
                                /
                                {toggleAdd && (
                                    <span className="text-gray-600">
                                        purchase
                                    </span>
                                )}
                            </p>
                        </div>

                        <button
                            className="flex items-center justify-center p-2 rounded-md whitespace-nowrap bg-[var(--primary-color)] text-[var(--text-primary-color)] hover:bg-[var(--primary-hover-color)] h-fit text-sm"
                            onClick={() => handleToggleAdd(true)}
                        >
                            <IoIosAdd />
                            Add New Purchase
                        </button>
                    </div>
                    <div>
                        {toggleAdd ? (
                            <EmbededModal
                                handleToggleAdd={handleToggleAdd}
                                setNewPurchase={setNewPurchase}
                                newPurchase={newPurchase}
                                isUpdate={isUpdate}
                                _isLoading={isLoading}
                                pageInfo={pageInfo}
                            />
                        ) : (
                            <Table
                                data={purchaseData}
                                handleToggleAdd={handleToggleAdd}
                                handleUpdate={handleUpdate}
                                totalPages={totalPages}
                                isLoading={isLoading}
                                loadData={handleFetchData}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Purchase;
