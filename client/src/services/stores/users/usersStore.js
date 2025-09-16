import { create } from 'zustand';
import axiosTools from '../../utilities/axiosUtils';

const useUsersStore = create((set, get) => ({
    data: [],
    userAuth: {},
    isLoading: false,
    message: '',
    isSuccess: false,
    otherInfo: {
        count: 0,
        currentPage: 0,
        totalPages: 0
    },

    getUsers: async (token, data) => {
        try {
            const res = await axiosTools.getData('users/getAll', data, token);

            set({
                data: res.data,
                isSuccess: res.success,
                otherInfo: {
                    count: res.count,
                    currentPage: res.currentPage,
                    totalPages: res.totalPages
                }
            });
        } catch (error) {
            set({
                isSuccess: false,
                message: error?.response?.data?.message || "Something went wrong"
            });
        }
    },

    update: async (data, token) => {
        set({ isLoading: true, message: '', isSuccess: false });
        try {
            const res = await axiosTools.updateData('users/update', data, token)

            set({
                isSuccess: res.success,
                isLoading: false,
                message: 'User updated successfully!',
                userAuth: res.user
            });

        } catch (error) {
            set({
                isLoading: false,
                message: error,
                isSuccess: false,
            });
        }
    },

    deleteUser: async (data, token) => {
        set({ isLoading: true, message: '', isSuccess: false});

        try {
            const res = await axiosTools.deleteData('users/delete', data, token)

            set({
                isSuccess: res.success,
                isLoading: false,
                message: 'User deleted successfully!',
                userAuth: res.user
            });
        } catch (error) {
            set({
                isLoading: false,
                message: error,
                isSuccess: false,
            });
        }
    },

    reset: () => {
        set({
            message: '',
            isSuccess: false,
            isLoading: false
        });
    },
}));

export default useUsersStore;
