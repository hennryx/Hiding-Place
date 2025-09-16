import React, { useEffect, useState } from 'react'
import Table from './table'
import useAuthStore from '../../../../services/stores/authStore';
import EmbededModal from './embededModal';
import usePurchaseStore from '../../../../services/stores/purchase/purchaseStore';
import { NAL } from '../../../../components/modalAlert';

const info = {
    supplier: "",
    purchaseDate: "",
    products: [],
    createdBy: "",
}

const Purchase = () => {
    const { token } = useAuthStore();
    const { getPurchases, data, purchase, reset, message, isSuccess } = usePurchaseStore();
    const [toggleAdd, setToggleAdd] = useState(false);
    const [purchaseData, setPurchaseData] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [newPurchase, setNewPurchase] = useState(info);

    useEffect(() => {
        if (token) {
            getPurchases(token);
        }
    }, [token]);

    useEffect(() => {
        if (data) {
            setPurchaseData(data)
        }
    }, [data]);

    const handleUpdate = (purchase) => {
        setToggleAdd(true);
        let { supplier, ...res } = purchase;
        setNewPurchase({ ...res, supplier: supplier._id });
        setIsUpdate(true);
    }

    useEffect(() => {
        const successHandler = async () => {

            if (isSuccess && message) {
                setToggleAdd(false);
                setNewPurchase(info);
                if (purchase && isUpdate) {
                    const updatedPurchase = purchaseData.map(u =>
                        u._id === purchase._id ? purchase : u
                    );
                    setPurchaseData(updatedPurchase);
                    setIsUpdate(false);

                } else if (purchase) {
                    setPurchaseData((prev) => {
                        const exists = prev.some(u => u._id === purchase._id);

                        if (exists) {
                            return prev.filter(u => u._id !== purchase._id);
                        } else {
                            return [...prev, purchase];
                        }
                    })
                }

                reset()
                await NAL({
                    title: "Saved!",
                    text: message,
                    icon: "success",
                    confirmText: "Ok"
                });


            } else if (message) {
                reset()
                await NAL({
                    title: "Error!",
                    text: message,
                    icon: "error",
                    confirmText: "Ok"
                });
            }
        }

        successHandler()
    }, [isSuccess, message, purchase])

    return (
        <>
            <div className='container p-4'>
                <div className="flex flex-col gap-5 pt-4">
                    <div className=''>
                        <h2 className='text-xl text-[#4154F1]'>Purchase</h2>
                        <p className='text-sm'><span className={`${toggleAdd ? "text-[#989797]" : "text-gray-600"}`}>purchase</span> / {toggleAdd && (<span className="text-gray-600">Add purchase</span>)}</p>
                    </div>
                    <div>
                        {toggleAdd ? (
                            <EmbededModal
                                setIsOpen={setToggleAdd}
                                setNewPurchase={setNewPurchase}
                                newPurchase={newPurchase}
                                isUpdate={isUpdate}
                                setIsUpdate={setIsUpdate}
                                temp={info}
                            />
                        ) : (
                            <Table
                                data={purchaseData}
                                toggleAdd={setToggleAdd}
                                handleUpdate={handleUpdate}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Purchase