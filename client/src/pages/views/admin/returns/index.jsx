import React, { useState, useEffect } from 'react';
import useAuthStore from '../../../../services/stores/authStore';
import useProductsStore from '../../../../services/stores/products/productsStore';
import useReturnsStore from '../../../../services/stores/returns/returnsStore';
import Table from './table';
import ReturnModal from './returnModal';
import { NAL } from '../../../../components/modalAlert';

const Returns = () => {
    const { token } = useAuthStore();
    const { getProducts } = useProductsStore();
    const { getReturns, data, isSuccess, isLoading, message, reset } = useReturnsStore();

    const [toggleAdd, setToggleAdd] = useState(false);
    const [returnsData, setReturnsData] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedReturn, setSelectedReturn] = useState({
        products: [],
        notes: '',
        transactionType: 'RETURN'
    });

    useEffect(() => {
        if (token) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            const startDate = today.toISOString();
            const endDate = endOfDay.toISOString();

            getReturns(token, { startDate, endDate });
            getProducts(token);
        }
    }, [token]);

    useEffect(() => {
        if (data) {
            setReturnsData(data);
        }
    }, [data]);

    const handleUpdate = (returnData) => {
        setToggleAdd(true);
        setSelectedReturn(returnData);
        setIsUpdate(true);
    };

    useEffect(() => {
        const successHandler = async () => {
            if (isSuccess && message) {
                setToggleAdd(false);
                setSelectedReturn({
                    products: [],
                    notes: '',
                    transactionType: 'RETURN'
                });

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);
                getReturns(token, {
                    startDate: today.toISOString(),
                    endDate: endOfDay.toISOString()
                });

                await NAL({
                    title: "Success!",
                    text: message,
                    icon: "success",
                    confirmText: "Ok"
                });

                reset();
            } else if (message) {
                await NAL({
                    title: "Error!",
                    text: message,
                    icon: "error",
                    confirmText: "Ok"
                });

                reset();
            }
        }
        successHandler()
    }, [isSuccess, message]);

    return (
        <div className='container p-4'>
            <div className="flex flex-col gap-5 pt-4">
                <div className=''>
                    <h2 className='text-xl text-[var(--primary-color)]'>Returns</h2>
                    <p className='text-sm text-[#989797]'>Returns / {toggleAdd ? 'Add New Return' : ''}</p>
                </div>

                {toggleAdd ? (
                    <ReturnModal
                        setIsOpen={setToggleAdd}
                        returnData={selectedReturn}
                        setReturnData={setSelectedReturn}
                        isUpdate={isUpdate}
                        setIsUpdate={setIsUpdate}
                    />
                ) : (
                    <Table
                        data={returnsData}
                        toggleAdd={setToggleAdd}
                        handleUpdate={handleUpdate}
                        isLoading={isLoading}
                        getReturns={getReturns}
                        token={token}
                    />
                )}
            </div>
        </div>
    );
};

export default Returns;