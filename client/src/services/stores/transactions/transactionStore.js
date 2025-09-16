import { create } from "zustand"; 
import axiosTools from "../../utilities/axiosUtils";

const useTransactionsStore = create((set, get) => ({
    transactionData: [],
    salesData: [],
    isSuccess: false,
    message: "",
    isLoading: false,
    pageInfo: {
        currentPage: 1,
        totalPages: 1
    },

    getTransactionSales: async(data, token) => {
        set({
            isSuccess: false,
            isLoading: true,
            message: ""
        })
        try {
            const res = await axiosTools.getData("transactions/getAll", data, token);

            set({
                salesData: res.data,
                message: res.message,
                isSuccess: res.success,
                isLoading: false,
                pageInfo: {
                    currentPage: res.currentPage,
                    totalPages: res.totalPages
                },
            });
        } catch (error) {
            set({
                isSuccess: false,
                isLoading: false,
                message: error.message
            })
        }
    }, 

    reset: () => {
        set({
            isSuccess: false,
            isLoading: false,
            message: ""
        })
    }

}))

export default useTransactionsStore;