import { create } from "zustand"; 
import axiosTools from "../../utilities/axiosUtils";

const usePurchaseStore = create((set, get) => ({
    data: [],
    purchase: {},
    isSuccess: false,
    message: "",
    isLoading: false,
    otherInfo: {
        count: 0,
        currentPage: 0,
        totalPages: 0
    },

    getPurchases: async(token, data) => {
        set({
            isSuccess: false,
            isLoading: true,
            message: ""
        })
        try {
            const res = await axiosTools.getData("purchases/getAll", data, token);

            set({
                data: res.data,
                message: res.message,
                isSuccess: res.success,
                isLoading: false,
                otherInfo: {
                    count: res.count,
                    currentPage: res.currentPage, 
                    totalPages: res.totalPages
                }
            })
        } catch (error) {
            set({
                isSuccess: false,
                isLoading: false,
                message: error.message
            })
        }
    }, 

    addPurchase: async (token, data) => {
        set({ isSuccess: false, isLoading: true, message: ""})
        try {
            const res = await axiosTools.saveData("purchases/save", data, token);

            const newData = [...get().data, res.data]
            set({
                data: newData,
                isLoading: false,
                isSuccess: res.success,
                message: res.message
            })

        } catch (error) {
            set({
                isSuccess: false,
                isLoading: false,
                message: error.message
            })
        }
    }, 

    updatePurchase: async (token, data) => {
        set({ isSuccess: false, isLoading: true, message: ""})
        try {
            const res = await axiosTools.updateData("purchases/update", data, token);

            const oldData = [...get().data]
            const index = oldData.findIndex(obj => obj._id === res.data?._id)

            if(index !== -1) {
                oldData[index] = res.data
            }

            set({
                data: oldData,
                isLoading: false,
                isSuccess: res.success,
                message: res.message,
                otherInfo: {
                    count: res.count,
                    currentPage: res.currentPage, 
                    totalPages: res.totalPages
                }
            })

        } catch (error) {
            set({
                isSuccess: false,
                isLoading: false,
                message: error.message
            })
        }
    }, 

    deletePurchase: async (token, data) => {
        set({ isSuccess: false, isLoading: true, message: ""})
        try {
            const res = await axiosTools.deleteData("purchases/delete", data, token);
            const filterdData = get().data.filter(item => item._id !== res.data?._id);

            set({
                data: filterdData,
                isLoading: false,
                isSuccess: res.success,
                message: res.message,
                otherInfo: {
                    count: res.count,
                    currentPage: res.currentPage, 
                    totalPages: res.totalPages
                }
            })

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

export default usePurchaseStore;