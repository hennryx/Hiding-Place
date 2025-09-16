import axiosTools from "../../utilities/axiosUtils";
import { create } from "zustand";
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_URL, {
    autoConnect: false
});

const useNotificationStore = create((set, get) => ({
    data: [],
    isSuccess: false,
    message: "",
    isLoading: false,
    otherInfo: {
        count: 0,
        currentPage: 0,
        totalPages: 0
    },

    getNotifications: async (token, data = "") => {
        set({ isLoading: true, isSuccess: false, message: "" });

        try {
            const res = await axiosTools.getData('notification/getAll', data, token)

            set({
                data: res.data,
                isLoading: false,
                isSuccess: res.success,
                otherInfo: {
                    count: res.count,
                    currentPage: res.currentPage,
                    totalPages: res.totalPages
                },
            })
        } catch (error) {
            set({
                message: error,
                isSuccess: false,
                isLoading: false
            });
        }
    },

    markAsRead: async (token, data = "") => {
        set({ isLoading: true, isSuccess: false, message: "" });

        try {
            const res = await axiosTools.updateData("notification/markAsRead", data, token)

            let oldData = [...get().data]
            const index = oldData.findIndex(obj => obj._id === res.data?._id)

            if(index !== -1) {
                oldData[index] = res.data
            }
            
            set({
                data: oldData,
                isLoading: false,
                isSuccess: res.success,
                otherInfo: {
                    count: res.count,
                    currentPage: res.currentPage,
                    totalPages: res.totalPages
                },
                message: res.message,
            })
        } catch (error) {
            set({
                message: error,
                isSuccess: false,
                isLoading: false
            });
        }
    },

    archivedNotification: async (token, data = "") => {
        set({ isLoading: true, isSuccess: false, message: "" });

        try {
            const res = await axiosTools.updateData("notification/archive", data, token)

            let oldData = [...get().data]
            const index = oldData.findIndex(obj => obj._id === res.data?._id)

            if(index !== -1) {
                oldData[index] = res.data
            }
            
            set({
                data: oldData,
                isLoading: false,
                isSuccess: res.success,
                otherInfo: {
                    count: res.count,
                    currentPage: res.currentPage,
                    totalPages: res.totalPages
                },
                message: res.message,
            })
        } catch (error) {
            set({
                message: error,
                isSuccess: false,
                isLoading: false
            });
        }
    },

    deleteNotification: async (token, data = "") => {
        set({ isLoading: true, isSuccess: false, message: "" });

        try {
            const res = await axiosTools.deleteData("notification/delete", data, token)

            let oldData = [...get().data]
            const index = oldData.findIndex(obj => obj._id === res.data?._id)

            if(index !== -1) {
                oldData[index] = res.data
            }
            
            set({
                data: oldData,
                isLoading: false,
                isSuccess: res.success,
                otherInfo: {
                    count: res.count,
                    currentPage: res.currentPage,
                    totalPages: res.totalPages
                },
                message: res.message,
            })
        } catch (error) {
            set({
                message: error,
                isSuccess: false,
                isLoading: false
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

    connectSocket: (userId, token) => {
        socket.connect();
        socket.auth = { userId, token }; // For auth if needed
        socket.emit('join', userId); // Join room

        socket.on('newNotification', (notif) => {
            set((state) => ({
                data: [notif, ...state.data], // Prepend new
                otherInfo: {
                    ...state.otherInfo,
                    count: state.otherInfo.count + 1
                }
            }));
        });
    },

    disconnectSocket: () => {
        socket.disconnect();
    },
    
}))

export default useNotificationStore;