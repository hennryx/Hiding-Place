import React, { useEffect, useRef, useState } from "react";
import useAuthStore from "../../../../services/stores/authStore";
import useProductsStore from "../../../../services/stores/products/productsStore";
import NoImage from "../../../../assets/No-Image.webp";
import { PiBeerBottleDuotone } from "react-icons/pi";
import { useDebounce } from "../../../../services/utilities/useDebounce";
import Cart from "./cart";
import { NAL } from "../../../../components/modalAlert";

const Dashboard = () => {
    const { token } = useAuthStore();
    const {
        getAllProducts,
        data,
        allCategories,
        productInfo,
        isLoading,
        message,
        isSuccess,
        reset,
    } = useProductsStore();

    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const sentinelRef = useRef(null);
    const limit = 10;

    const debounceSearch = useDebounce(searchTerm, 300);

    const fetchData = (params) => {
        if (!token || isLoading) return;

        getAllProducts(token, params);
    };

    // Reset when search or filter changes
    useEffect(() => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
        setIsFirstLoad(true);

        fetchData({
            page: 1,
            limit,
            search: debounceSearch,
            category: filterCategory === "all" ? "" : filterCategory,
        });
    }, [debounceSearch, filterCategory]);

    // Handle data updates
    useEffect(() => {
        if (!data || data.length === 0) {
            if (!isLoading) {
                setHasMore(false);
            }
            return;
        }

        const _hasMoreData = products.length !== productInfo.totalItems;
        const hasMoreData = data.length === limit;
        setHasMore(_hasMoreData);

        if (isFirstLoad || page === 1) {
            setProducts(data);
            setIsFirstLoad(false);
        } else {
            setProducts((prev) => {
                const newProducts = data.filter(
                    (newProduct) =>
                        !prev.some(
                            (existingProduct) =>
                                existingProduct._id === newProduct._id
                        )
                );
                return [...prev, ...newProducts];
            });
        }
        setCategories(allCategories);
    }, [data, page, isFirstLoad, isLoading]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];

                if (
                    entry.isIntersecting &&
                    hasMore &&
                    !isLoading &&
                    !isFirstLoad
                ) {
                    const nextPage = page + 1;
                    setPage(nextPage);

                    fetchData({
                        page: nextPage,
                        limit,
                        search: debounceSearch,
                        category:
                            filterCategory === "all" ? "" : filterCategory,
                    });
                }
            },
            {
                threshold: 0.1,
                rootMargin: "100px",
            }
        );

        const currentSentinel = sentinelRef.current;
        if (currentSentinel) {
            observer.observe(currentSentinel);
        }

        return () => {
            if (currentSentinel) {
                observer.unobserve(currentSentinel);
            }
        };
    }, [hasMore, isLoading, page, debounceSearch, filterCategory, isFirstLoad]);

    const addToCart = async (product) => {
        if (product.totalStock === 0) {
            await NAL({
                title: "No Stock",
                text: `${product.totalStock} stock ${product.productName} is not available`,
                icon: "warning",
                confirmText: "OK",
            });
            return;
        }

        const existingItem = cart.find((item) => item.id === product._id);
        if (existingItem) {
            if (existingItem.quantity >= product.totalStock) {
                await NAL({
                    title: "Stock Limit Reached",
                    text: `Only ${product.totalStock} item(s) available in stock`,
                    icon: "warning",
                    confirmText: "OK",
                });
                return;
            }

            setCart(
                cart.map((item) =>
                    item.id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            setCart([
                ...cart,
                {
                    id: product._id,
                    name: product.productName,
                    price: product.sellingPrice,
                    image: product.image,
                    quantity: 1,
                    maxQuantity: product.totalStock,
                },
            ]);
        }
    };

    useEffect(() => {
        const successHandler = async () => {
            if (isSuccess && message !== "") {
                await NAL({
                    title: "Success",
                    text: message,
                    icon: "success",
                    confirmText: "OK",
                });
                reset();

                setCart([]);
                setPage(1);
                setHasMore(true);
                setIsFirstLoad(true);
                return;
            }

            if (!isSuccess && message !== "") {
                await NAL({
                    title: "Error",
                    text: message,
                    icon: "error",
                    confirmText: "OK",
                });
            }
        };

        successHandler();
    }, [message, isSuccess]);

    return (
        <div className="container p-4 h-dvh overflow-hidden">
            <div className="mb-4">
                <h2 className="text-2xl text-[var(--primary-color)]">
                    Point of Sale
                </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-6 h-full overflow-hidden">
                <div className="w-full md:w-2/3 rounded-lg flex flex-col overflow-hidden">
                    <div className="mb-4 flex sm:flex-row justify-between gap-4 p-2">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-[var(--border-color)] rounded-md placeholder:text-[var(--secondary-color)]"
                        />
                    </div>
                    <div className="flex flex-row overflow-y-auto gap-2">
                        {categories.map((category, index) => (
                            <div key={index} value={category}>
                                {category}
                            </div>
                        ))}
                    </div>
                    {/* <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 border border-[var(--border-color)] bg-[var(--card-color)] rounded-md"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select> */}

                    {/* header component (Categories) */}
                    <div className="flex gap-4 mb-4 overflow-auto p-2 rounded-md flex-shrink-0">
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    setFilterCategory(category);
                                    setSelectedCategory(category);
                                }}
                                className={`flex gap-2 shadow-md items-center justify-center rounded-md cursor-pointer whitespace-nowrap p-2 hover:bg-[var(--primary-color)] hover:text-white ${
                                    selectedCategory === category
                                        ? "bg-[var(--primary-color)] text-white shadow-md"
                                        : "text-black/80 bg-gray-200"
                                }`}
                            >
                                <PiBeerBottleDuotone />
                                {category}
                            </div>
                        ))}
                    </div>

                    {/* Products container with scroll */}
                    <div className="bg-[var(--card-primary-color)] rounded-md shadow-md flex-1 overflow-hidden flex flex-col">
                        <div className="flex-1 overflow-y-auto p-2">
                            {products.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {products.map((product, i) => (
                                            <div
                                                key={`${product._id}-${i}`}
                                                className="border border-[var(--border-color)] rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                                onClick={() =>
                                                    addToCart(product)
                                                }
                                            >
                                                <div className="h-40 bg-[var(card-color)] flex items-center justify-center">
                                                    <img
                                                        src={
                                                            product.image
                                                                ?.url || NoImage
                                                        }
                                                        alt={
                                                            product.productName
                                                        }
                                                        className="h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror =
                                                                null;
                                                            e.target.src =
                                                                NoImage;
                                                        }}
                                                    />
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-semibold text-[var(--text-color)] truncate">
                                                        {product.productName}
                                                    </h3>
                                                    <p className="text-sm text-[var(--text-color)]">
                                                        {product.unitSize}{" "}
                                                        {product.unit}
                                                    </p>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <p className="font-bold text-[var(--primary-color)]">
                                                            ₱
                                                            {
                                                                product.sellingPrice
                                                            }
                                                        </p>
                                                        <p className="text-sm text-[var(--text-color)]">
                                                            Stock:{" "}
                                                            {product.totalStock ||
                                                                0}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Loading message */}
                                    {isLoading && (
                                        <div className="flex justify-center items-center py-8">
                                            <div className="text-lg text-gray-500">
                                                Loading more products...
                                            </div>
                                        </div>
                                    )}

                                    {/* No more products message */}
                                    {!hasMore &&
                                        !isLoading &&
                                        products.length > 0 && (
                                            <div className="flex justify-center items-center py-8">
                                                <div className="text-lg text-gray-500">
                                                    No more products to load
                                                </div>
                                            </div>
                                        )}

                                    {/* Sentinel for infinite scroll */}
                                    <div
                                        ref={sentinelRef}
                                        className="h-10 w-full"
                                        style={{ minHeight: "40px" }}
                                    />
                                </>
                            ) : isLoading ? (
                                <div className="flex justify-center items-center h-full">
                                    <div className="text-lg text-gray-500">
                                        Loading products...
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-center items-center h-full">
                                    <div className="text-lg text-gray-500">
                                        No products found
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Cart cart={cart} setCart={setCart} />
            </div>
        </div>
    );
};

export default Dashboard;
