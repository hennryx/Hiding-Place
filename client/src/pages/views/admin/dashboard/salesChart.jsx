import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesChart = ({ timeFilter, transactionData, dateRange }) => {
    const [chartData, setChartData] = useState([]);
    const [chartTitle, setChartTitle] = useState('');

    useEffect(() => {
        const processChartData = () => {
            const now = new Date();
            let data = [];
            let title = '';

            if (dateRange && dateRange.startOfDate && dateRange.endOfDate) {
                const startDate = new Date(dateRange.startOfDate);
                const endDate = new Date(dateRange.endOfDate);
                endDate.setHours(23, 59, 59, 999);

                const dayDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                const labels = Array.from({ length: dayDiff + 1 }, (_, i) => {
                    const date = new Date(startDate);
                    date.setDate(startDate.getDate() + i);
                    return {
                        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        fullDate: date.toISOString().split('T')[0]
                    };
                });

                const salesData = Array(labels.length).fill(0);
                transactionData.forEach(({ createdAt, items }) => {
                    const txDate = new Date(createdAt);
                    if (txDate >= startDate && txDate <= endDate) {
                        const dayIndex = Math.floor((txDate - startDate) / (1000 * 60 * 60 * 24));
                        const total = items.reduce((sum, p) => sum + (p.quantity * (p.product?.sellingPrice || 0)), 0);
                        if (dayIndex >= 0 && dayIndex < salesData.length) {
                            salesData[dayIndex] += total;
                        }
                    }
                });

                data = labels.map((labelObj, index) => ({
                    name: labelObj.label,
                    sales: salesData[index],
                    fullDate: labelObj.fullDate
                }));

                title = `Sales from ${new Date(dateRange.startOfDate).toLocaleDateString()} to ${new Date(dateRange.endOfDate).toLocaleDateString()}`;
            } else if (timeFilter === 'week') {
                const today = new Date();
                const currentDay = today.getDay();
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - currentDay); // Start from Sunday
                startOfWeek.setHours(0, 0, 0, 0);

                const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const salesData = Array(7).fill(0);

                transactionData.forEach(({ createdAt, items }) => {
                    const txDate = new Date(createdAt);
                    if (txDate >= startOfWeek) {
                        const daysSinceStart = Math.floor((txDate - startOfWeek) / (1000 * 60 * 60 * 24));
                        if (daysSinceStart >= 0 && daysSinceStart < 7) {
                            const total = items.reduce((sum, p) => sum + (p.quantity * (p.product?.sellingPrice || 0)), 0);
                            salesData[daysSinceStart] += total;
                        }
                    }
                });

                data = labels.map((label, index) => ({
                    name: label,
                    sales: salesData[index]
                }));

                title = `Sales Overview - This Week`;
            } else if (timeFilter === 'month') {
                const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                const labels = Array.from({ length: days }, (_, i) => `${i + 1}`);
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

                const salesData = Array(days).fill(0);
                transactionData.forEach(({ createdAt, items }) => {
                    const txDate = new Date(createdAt);
                    if (txDate >= monthStart) {
                        const day = txDate.getDate() - 1;
                        const total = items.reduce((sum, p) => sum + (p.quantity * (p.product?.sellingPrice || 0)), 0);
                        salesData[day] += total;
                    }
                });

                data = labels.map((label, index) => ({
                    name: label,
                    sales: salesData[index]
                }));

                title = `Sales Overview - This Month`;
            } else if (timeFilter === 'year') {
                const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const yearStart = new Date(now.getFullYear(), 0, 1);

                const salesData = Array(12).fill(0);
                transactionData.forEach(({ createdAt, items }) => {
                    const txDate = new Date(createdAt);
                    if (txDate >= yearStart) {
                        const month = txDate.getMonth();
                        const total = items.reduce((sum, p) => sum + (p.quantity * (p.product?.sellingPrice || 0)), 0);
                        salesData[month] += total;
                    }
                });

                data = labels.map((label, index) => ({
                    name: label,
                    sales: salesData[index]
                }));

                title = `Sales Overview - This Year`;
            }

            setChartData(data);
            setChartTitle(title);
        };

        processChartData();
    }, [transactionData, timeFilter, dateRange]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                    <p className="font-medium text-gray-900">{`${label}`}</p>
                    <p className="text-[var(--primary-color)] font-semibold">
                        {`Sales: ₱${data.value.toLocaleString()}`}
                    </p>
                    {data.payload.fullDate && (
                        <p className="text-sm text-gray-500">{data.payload.fullDate}</p>
                    )}
                </div>
            );
        }
        return null;
    };

    // Format Y-axis ticks to show peso symbol
    const formatYAxisTick = (value) => {
        if (value >= 1000000) {
            return `₱${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `₱${(value / 1000).toFixed(1)}K`;
        }
        return `₱${value}`;
    };

    return (
        <div className="h-96 w-full pb-4">
            {chartTitle && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 text-center">
                        {chartTitle}
                    </h3>
                </div>
            )}
            
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#616974" />
                    <XAxis 
                        dataKey="name" 
                        stroke="#64748b" 
                        fontSize={12}
                        tick={{ fill: '#64748b' }}
                    />
                    <YAxis 
                        stroke="#64748b" 
                        fontSize={12}
                        tickFormatter={formatYAxisTick}
                        tick={{ fill: '#64748b' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                        dataKey="sales" 
                        fill="#5A12FF"
                        radius={[4, 4, 0, 0]}
                        name="Sales"
                    />
                </BarChart>
            </ResponsiveContainer>
            
            {chartData.length === 0 && (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-lg">No sales data available</p>
                </div>
            )}
        </div>
    );
};

export default SalesChart;