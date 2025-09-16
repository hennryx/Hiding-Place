import axiosTools from "../../utilities/axiosUtils";
import { create } from "zustand";

const useProductsStore = create((set, get) => ({
  data: [],
  dataStorage: [],
  topProducts: [],
  product: {},
  isSuccess: false,
  message: "",
  isLoading: false,
  allCategories: [],
  productInfo: {
    minStock: 0,
    outStock: 0,
    totalItems: 0,
    totalNumberItems: 0,
    currentPage: 1,
  },

  getProducts: async (token, data = "") => {
    set({ isLoading: true, isSuccess: false, message: "" });

    try {
      const res = await axiosTools.getData("products/getAll", data, token);

      set({
        data: res.data,
        productInfo: {
          totalItems: res.totalItems,
          totalNumberItems: res.totalNumberItems,
          minimumStock: res.minimumStock,
          outStock: res.outStock,
          totalPages: res.totalPages,
          currentPage: res.currentPage,
        },
        topProducts: res.topProducts,
        isSuccess: res.success,
        isLoading: false,
        allCategories: res.allCategories,
      });
    } catch (error) {
      set({
        message: error,
        isSuccess: false,
        isLoading: false,
      });
    }
  },

  getAllProducts: async (token, data) => {
    set({ isLoading: true, isSuccess: false, message: "" });

    try {
      const res = await axiosTools.getData(
        "products/getAllProducts",
        data,
        token
      );
      const storage = get().dataStorage?.map((item) => ({ ...item }));

      storage.push(...res.data);
      const uniqueStorage = storage.filter(
        (item, index, self) =>
          index === self.findIndex((obj) => obj._id === item._id)
      );

      set({
        data: res.data,
        dataStorage: uniqueStorage,
        productInfo: {
          totalItems: res.totalItems,
          minimumStock: res.minimumStock,
          totalNumberItems: res.totalNumberItems,
          outStock: res.outStock,
          totalPages: res.totalPages,
        },
        allCategories: res.allCategories,
        topProducts: res.topProducts,
        message: res?.message || "",
        isSuccess: res.success,
        isLoading: false,
      });
    } catch (error) {
      set({
        message: error,
        isSuccess: false,
        isLoading: false,
      });
    }
  },

  getProduct: async (data, token) => {
    set({ isLoading: true, message: "", isSuccess: false });
    try {
      const res = await axiosTools.getData("products/get", data, token);

      set({
        product: res.data,
        message: res.message,
        isSuccess: res.success,
        isLoading: false,
      });
    } catch (error) {
      set({
        message: error,
        isSuccess: false,
        isLoading: false,
      });
    }
  },

  getCustomProduct: async (token) => {
    set({ isLoading: true, message: "", isSuccess: false });
    try {
      const res = await axiosTools.getData(
        "products/getCustomProducts",
        "",
        token
      );

      set({
        data: res.data,
        isSuccess: res.success,
        isLoading: false,
      });
    } catch (error) {
      set({
        message: error,
        isSuccess: false,
        isLoading: false,
      });
    }
  },

  addProduct: async (data, token) => {
    set({ isLoading: true, message: "", isSuccess: false });
    try {
      const res = await axiosTools.saveData("products/save", data, token);

      const currentData = get().data;
      set({
        data: [res.product, ...currentData],
        product: res.product,
        message: res.message,
        isSuccess: res.success,
        isLoading: false,
        productInfo: {
          ...get().productInfo,
          totalItems: get().productInfo.totalItems + 1,
        },
      });
    } catch (error) {
      set({
        message: error,
        isSuccess: false,
        isLoading: false,
      });
    }
  },

  deleteProduct: async (data, token) => {
    set({ isLoading: true, message: "", isSuccess: false });

    try {
      const res = await axiosTools.deleteData("products/delete", data, token);

      set({
        data: res.data,
        message: res.message,
        isSuccess: res.success,
        isLoading: false,
        productInfo: {
          totalPages: res.totalPages,
          currentPage: res.currentPage,
          minimumStock: res.minimumStock,
          totalNumberItems: res.totalNumberItems,
          outStock: res.outStock,
        },
      });
    } catch (error) {
      set({
        message: error,
        isSuccess: false,
        isLoading: false,
      });
    }
  },

  updateProduct: async (data, token) => {
    set({ isLoading: true, message: "", isSuccess: false });

    try {
      const res = await axiosTools.updateData("products/update", data, token);
      let oldData = [...get().data];
      const index = oldData.findIndex((obj) => obj._id === res.data?._id);

      if (index !== -1) {
        oldData[index] = res.data;
      }

      set({
        data: oldData,
        message: res.message,
        isSuccess: res.success,
        isLoading: false,
        productInfo: {
          totalPages: res.totalPages,
          currentPage: res.currentPage,
          minimumStock: res.minimumStock,
          totalNumberItems: res.totalNumberItems,
          outStock: res.outStock,
        },
      });
    } catch (error) {
      set({
        message: error,
        isSuccess: false,
        isLoading: false,
      });
    }
  },

  deducProduct: async (data, token) => {
    set({ isLoading: true, message: "", isSuccess: false });

    try {
      const res = await axiosTools.saveData("products/deduct", data, token);
      let oldData = get().dataStorage.map((item) => ({ ...item }));
      console.log(oldData);

      if (Array.isArray(res.data)) {
        res.data.forEach((deductItem) => {
          const index = oldData.findIndex(
            (oldItem) => oldItem._id === deductItem.product
          );

          if (index !== -1) {
            oldData[index].totalStock = Math.max(
              0,
              oldData[index].totalStock - deductItem.quantity
            );
          }
        });
      }

      console.log(res.data);
      console.log(oldData);

      if (res.data) {
        set({
          data: oldData,
          dataStorage: oldData,
          productInfo: {
            totalPages: res.totalPages,
            currentPage: res.currentPage,
            minimumStock: res.minimumStock,
            totalNumberItems: res.totalNumberItems,
            outStock: res.outStock,
          },
          message: res.message,
          isSuccess: res.success,
          isLoading: false,
        });
      } else {
        get().getProducts(token);
      }
    } catch (error) {
      set({
        message: error,
        isSuccess: false,
        isLoading: false,
      });
    }
  },

  getPublicProducts: async (data = "") => {
    set({ isLoading: true, message: "", isSuccess: false });

    try {
      const res = await axiosTools.getData("products/getPublicProducts", data);
      set({
        data: res.data,
        isSuccess: res.success,
        isLoading: false,
      });
    } catch (error) {
      set({
        message: error,
        isSuccess: false,
        isLoading: false,
      });
    }
  },

  reset: () => {
    set({
      message: "",
      isSuccess: false,
      isLoading: false,
    });
  },

  hardReset: () => {
    set({
      message: "",
      isSuccess: false,
      isLoading: false,
      product: {},
      data: [],
    });
  },
}));

export default useProductsStore;
