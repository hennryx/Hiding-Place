import React, { useEffect, useState } from "react";
import Card from "./card";
import { BsBoxes } from "react-icons/bs";
import { FaCheckDouble, FaFire, FaPesoSign } from "react-icons/fa6";
import { FaBoxOpen } from "react-icons/fa";
import Table from "./table";
import SalesChart from "./salesChart";
import useProductsStore from "../../../../services/stores/products/productsStore";
import useTransactionsStore from "../../../../services/stores/transactions/transactionStore";
import useAuthStore from "../../../../services/stores/authStore";
import NoImage from "../../../../assets/No-Image.webp";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Package,
    Users,
    Clock,
} from "lucide-react";

const salesData = [
    { name: "Mon", sales: 2400, orders: 45 },
    { name: "Tue", sales: 1398, orders: 32 },
    { name: "Wed", sales: 9800, orders: 78 },
    { name: "Thu", sales: 3908, orders: 55 },
    { name: "Fri", sales: 4800, orders: 89 },
    { name: "Sat", sales: 3800, orders: 67 },
    { name: "Sun", sales: 4300, orders: 72 },
];

const categoryData = [
    { name: "Coffee", value: 45, color: "#f59e0b" },
    { name: "Food", value: 30, color: "#ea580c" },
    { name: "Beverages", value: 15, color: "#d97706" },
    { name: "Desserts", value: 10, color: "#b45309" },
];

const topProducts = [
    { name: "Cappuccino", sold: 156, revenue: "₱468.00" },
    { name: "Latte", sold: 143, revenue: "₱429.00" },
    { name: "Croissant", sold: 89, revenue: "₱267.00" },
    { name: "Americano", sold: 78, revenue: "₱234.00" },
    { name: "Sandwich", sold: 67, revenue: "₱335.00" },
];

const Dashboard = () => {
    const { token } = useAuthStore();
    const { getAllProducts, topProducts, allData, productInfo } =
        useProductsStore();
    const { getTransactionSales, salesData: transactionData } =
        useTransactionsStore();
    const [productState, setProductState] = useState({});
    const [topSelling, setTopSelling] = useState([]);
    const [recentlyAddedProducts, setRecentlyAddedProducts] = useState(0);
    const [timeFilter, setTimeFilter] = useState("week");
    const today = new Date().toISOString().split("T")[0];
    const [useDateRange, setUseDateRange] = useState(false);

    const [dateRange, setDateRange] = useState({
        startOfDate: today,
        endOfDate: today,
    });

    useEffect(() => {
        if (token) {
            getAllProducts(token);
            const startOfDate = new Date(today);
            startOfDate.setHours(0, 0, 0, 0);
            const endOfDate = new Date(today);
            endOfDate.setHours(23, 59, 59, 999);
            fetchTransactionSales({
                startOfDate: startOfDate.toISOString(),
                endOfDate: endOfDate.toISOString(),
                type: "SALE",
            });
        }
    }, [token]);

    const fetchTransactionSales = (params) => {
        getTransactionSales(params, token);
    };

    const fetchTransactionsWithFilters = () => {
        if (!token) {
            console.warn("No token available for fetching transactions");
            return;
        }

        const { startOfDate, endOfDate } = dateRange;

        if (useDateRange && startOfDate && endOfDate) {
            fetchTransactionSales({
                startOfDate: startOfDate,
                endOfDate: endOfDate,
                type: "SALE",
            });
        } else {
            const now = new Date();
            let startOfDate;

            if (timeFilter === "day") {
                startOfDate = new Date(now);
                startOfDate.setUTCHours(0, 0, 0, 0);
            } else if (timeFilter === "month") {
                startOfDate = new Date(now.getFullYear(), now.getMonth(), 1);
            } else if (timeFilter === "year") {
                startOfDate = new Date(now.getFullYear(), 0, 1);
            }

            const endOfDate = new Date();
            endOfDate.setUTCHours(23, 59, 59, 999);

            fetchTransactionSales({
                startOfDate: startOfDate,
                endOfDate: endOfDate,
                type: "SALE",
            });
        }
    };

    useEffect(() => {
        fetchTransactionsWithFilters();
    }, [dateRange, timeFilter, useDateRange]);

    useEffect(() => {
        if (topProducts) {
            setTopSelling(topProducts);
        }

        if (productInfo) {
            setProductState(productInfo);
        }

        if (allData && allData.length > 0) {
            const now = new Date();
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);

            const recentProducts = allData.filter((product) => {
                const createdAt = new Date(product.createdAt);
                return createdAt >= yesterday;
            });

            setRecentlyAddedProducts(recentProducts.length);
        }
    }, [allData, topProducts, productInfo, transactionData]);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange((prev) => ({
            ...prev,
            [name]: value,
        }));
        setUseDateRange(true);
    };

    const handleTimeFilterClick = (filter) => {
        setTimeFilter(filter);
        setUseDateRange(false);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Welcome back! Here's what's happening at Hidden Place
                        today.
                    </p>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">
                                    Today's Sales
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ₱2,847
                                </p>
                                <div className="flex items-center text-green-600 text-sm mt-1">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    +12.5%
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <FaPesoSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Orders</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    89
                                </p>
                                <div className="flex items-center text-blue-600 text-sm mt-1">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    +8.2%
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">
                                    Low Stock Items
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    7
                                </p>
                                <div className="flex items-center text-red-600 text-sm mt-1">
                                    <TrendingDown className="w-4 h-4 mr-1" />
                                    Action needed
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">
                                    Active Staff
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    5
                                </p>
                                <div className="flex items-center text-green-600 text-sm mt-1">
                                    <Clock className="w-4 h-4 mr-1" />
                                    On duty
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-6 pb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Weekly Sales Trend
                        </h3>
                    </div>
                    <div className="p-6 pt-2">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value, name) => [
                                        name === "sales" ? `₱${value}` : value,
                                        name === "sales" ? "Sales" : "Orders",
                                    ]}
                                />
                                <Bar dataKey="sales" fill="#f59e0b" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-6 pb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Sales by Category
                        </h3>
                    </div>
                    <div className="p-6 pt-2">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    label={({ name, value }) =>
                                        `${name}: ${value}%`
                                    }
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Products Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Top Selling Products
                    </h3>
                </div>
                <div className="p-6 pt-2">
                    <div className="space-y-4">
                        {topProducts.map((product, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                        <span className="text-amber-600 font-semibold">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {product.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {product.sold} sold today
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">
                                        {product.revenue}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Revenue
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
