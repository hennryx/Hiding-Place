import { create } from 'zustand';
import axiosTools from '../../utilities/axiosUtils';

const useSuppliersStore = create((set, get) => ({
    data: [],
    supplier: {},
    suppliers: [],
    isSuccess: false,
    message: "",
    isLoading: false,
    otherInfo: {
        count: 0,
        currentPage: 0,
        totalPages: 0
    },

    getSuppliers: async (token, data) => {
        set({ isLoading: true, message: '', isSuccess: false });
        try {
            const res = await axiosTools.getData('suppliers/getAll', data, token);

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
                message: error,
                isSuccess: false,
                isLoading: false
            })
        }
    },

    getActiveSuppliers: async (token) => {
        set({ isLoading: true, message: '', isSuccess: false });
        try {
            const res = await axiosTools.getData('suppliers/getActive', '', token);

            set({
                suppliers: res.data,
                message: res.message,
                isSuccess: res.success,
                isLoading: false,
            })
        } catch (error) {
            set({
                message: error,
                isSuccess: false,
                isLoading: false
            })
        }
    },

    addSupplier: async (data, token) => {
        set({ isLoading: true, message: '', isSuccess: false });
        try {
            const res = await axiosTools.saveData("suppliers/save", data, token)

            set({
                supplier: res.user,
                message: res.message,
                isSuccess: res.success,
                isLoading: false,
                otherInfo: {
                    count: res.count,
                    currentPage: res.currentPage, 
                    totalPages: res.totalPages
                }
            });

        } catch (error) {
            set({
                message: error,
                isSuccess: false,
                isLoading: false
            })
        }

    },

    deleteSupplier: async (data, token) => {
        set({ isLoading: true, message: '', isSuccess: false });

        try {
            const res = await axiosTools.deleteData("suppliers/delete", data, token)

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
            });

        } catch (error) {
            set({
                message: error,
                isSuccess: false,
                isLoading: false
            })
        }
    },

    updateSupplier: async (data, token) => {
        set({ isLoading: true, message: '', isSuccess: false });

        try {
            const res = await axiosTools.updateData("suppliers/update", data, token)

            set({
                supplier: res.user,
                message: res.message,
                isSuccess: res.success,
                isLoading: false
            });

        } catch (error) {
            set({
                message: error,
                isSuccess: false,
                isLoading: false
            })
        }
    },

    reset: () => {
        set({
            message: '',
            isSuccess: false,
            isLoading: false
        });
    }
}))

export default useSuppliersStore;