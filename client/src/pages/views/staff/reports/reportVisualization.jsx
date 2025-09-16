import React, { useState, useEffect } from 'react';
import { 
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const ReportVisualization = ({ reportType, data }) => {
    const [chartData, setChartData] = useState([]);
    const [summaryData, setSummaryData] = useState({
        total: 0,
        average: 0,
        count: 0,
        min: 0,
        max: 0
    });

    // Colors for different chart types
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0084d1'];

    useEffect(() => {
        console.log(data);
        
        if (!data || data.length === 0) return;

        let processedData = [];
        let summary = { total: 0, count: data.length, min: Infinity, max: -Infinity };

        switch (reportType) {
            case 'SALE':
                const salesByDate = {};
                data.forEach(item => {
                    const date = new Date(item.createdAt).toLocaleDateString();
                    const amount = item.items.reduce((sum, p) => {
                        return sum + (p.quantity * (p.product?.sellingPrice || 0));
                    }, 0);

                    if (!salesByDate[date]) {
                        salesByDate[date] = 0;
                    }
                    salesByDate[date] += amount;

                    summary.total += amount;
                    summary.min = Math.min(summary.min, amount);
                    summary.max = Math.max(summary.max, amount);
                });

                processedData = Object.entries(salesByDate).map(([date, amount]) => ({
                    name: date,
                    value: amount,
                    sales: amount
                }));
                break;

            case 'PURCHASE':
                const purchasesBySupplier = {};
                data.forEach(item => {
                    const supplier = item.supplier?.companyName || 'Unknown';

                    if (!purchasesBySupplier[supplier]) {
                        purchasesBySupplier[supplier] = 0;
                    }

                    const itemCount = item.items?.length || 0;
                    purchasesBySupplier[supplier] += itemCount;

                    summary.total += itemCount;
                    summary.min = Math.min(summary.min, itemCount);
                    summary.max = Math.max(summary.max, itemCount);
                });

                processedData = Object.entries(purchasesBySupplier).map(([supplier, count]) => ({
                    name: supplier,
                    value: count,
                    items: count
                }));
                break;

            case 'INVENTORY':
                const sortedProducts = [...data]
                    .sort((a, b) => (b.totalStock || 0) - (a.totalStock || 0))
                    .slice(0, 10);

                    console.log(sortedProducts)

                processedData = sortedProducts.map(p => ({
                    name: p.productName.length > 15 ? p.productName.substring(0, 15) + '...' : p.productName,
                    value: p.totalStock || 0,
                    stock: p.totalStock || 0,
                    fullName: p.productName
                }));

                summary.total = sortedProducts.reduce((sum, p) => sum + (p.totalStock || 0), 0);
                sortedProducts.forEach(p => {
                    const stockLevel = p.totalStock || 0;
                    summary.min = Math.min(summary.min, stockLevel);
                    summary.max = Math.max(summary.max, stockLevel);
                });
                break;

            case 'RETURN':
                const returnsByReason = {};
                data.forEach(item => {
                    const reason = item.notes || 'No reason provided';
                    if (!returnsByReason[reason]) {
                        returnsByReason[reason] = 0;
                    }

                    const returnCount = item.items.reduce((sum, p) => Number(sum) + Number(p.quantity), 0);
                    returnsByReason[reason] += returnCount;

                    summary.total += returnCount;
                    summary.min = Math.min(summary.min, returnCount);
                    summary.max = Math.max(summary.max, returnCount);
                });

                processedData = Object.entries(returnsByReason).map(([reason, count]) => ({
                    name: reason.length > 20 ? reason.substring(0, 20) + '...' : reason,
                    value: count,
                    returns: count,
                    fullReason: reason
                }));
                break;

            default:
                break;
        }

        summary.average = summary.total / summary.count;
        if (summary.min === Infinity) summary.min = 0;

        setSummaryData(summary);
        setChartData(processedData);
    }, [reportType, data]);

    // Custom tooltips for different chart types
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                    <p className="font-medium text-gray-900">{data.payload.fullName || data.payload.fullReason || label}</p>
                    {reportType === 'sales' && (
                        <p className="text-blue-600 font-semibold">
                            Sales: ₱{data.value.toLocaleString()}
                        </p>
                    )}
                    {reportType === 'purchases' && (
                        <p className="text-green-600 font-semibold">
                            Items: {data.value.toLocaleString()}
                        </p>
                    )}
                    {reportType === 'inventory' && (
                        <p className="text-purple-600 font-semibold">
                            Stock: {data.value.toLocaleString()}
                        </p>
                    )}
                    {reportType === 'returns' && (
                        <p className="text-red-600 font-semibold">
                            Returns: {data.value.toLocaleString()}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    const renderChart = () => {
        if (!chartData.length) {
            return (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-lg">No data available for visualization</p>
                </div>
            );
        }

        switch (reportType) {
            case 'sales':
                return (
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="name" 
                            stroke="#64748b" 
                            fontSize={12}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis 
                            stroke="#64748b" 
                            fontSize={12}
                            tickFormatter={(value) => `₱${value.toLocaleString()}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#0088FE" 
                            strokeWidth={3}
                            dot={{ fill: '#0088FE', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                );

            case 'purchases':
                return (
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                );

            case 'inventory':
                return (
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="name" 
                            stroke="#64748b" 
                            fontSize={12}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis 
                            stroke="#64748b" 
                            fontSize={12}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                            dataKey="value" 
                            fill="#8884d8"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                );

            case 'returns':
                return (
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                );

            default:
                return (
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                );
        }
    };

    return (
        <div className="mb-6">
            {/* Summary Statistics */}
            <div className="flex flex-wrap justify-around mb-4 bg-gray-50 rounded-md p-4">
                <div className="text-center p-2">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-semibold">
                        {reportType === 'sales' ? '₱' : ''}{summaryData.total.toFixed(reportType === 'sales' ? 2 : 0)}
                    </p>
                </div>
                <div className="text-center p-2">
                    <p className="text-sm text-gray-500">Average</p>
                    <p className="text-xl font-semibold">
                        {reportType === 'sales' ? '₱' : ''}{summaryData.average.toFixed(reportType === 'sales' ? 2 : 0)}
                    </p>
                </div>
                <div className="text-center p-2">
                    <p className="text-sm text-gray-500">Count</p>
                    <p className="text-xl font-semibold">{summaryData.count}</p>
                </div>
                <div className="text-center p-2">
                    <p className="text-sm text-gray-500">Minimum</p>
                    <p className="text-xl font-semibold">
                        {reportType === 'sales' ? '₱' : ''}{summaryData.min.toFixed(reportType === 'sales' ? 2 : 0)}
                    </p>
                </div>
                <div className="text-center p-2">
                    <p className="text-sm text-gray-500">Maximum</p>
                    <p className="text-xl font-semibold">
                        {reportType === 'sales' ? '₱' : ''}{summaryData.max.toFixed(reportType === 'sales' ? 2 : 0)}
                    </p>
                </div>
            </div>

            {/* Chart Title */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 text-center">
                    {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report Visualization
                </h3>
            </div>

            {/* Chart Container */}
            <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ReportVisualization;