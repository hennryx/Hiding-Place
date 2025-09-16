import React, { useState, useEffect, useRef } from 'react';
import 'jspdf-autotable';
import useAuthStore from '../../../../services/stores/authStore';
import useProductsStore from '../../../../services/stores/products/productsStore';
import useTransactionsStore from '../../../../services/stores/transactions/transactionStore';
import ReportFilter from './reportFilter';
import ReportVisualization from './reportVisualization';
import { FaFilePdf, FaFileExcel, FaRegListAlt, FaChartBar } from 'react-icons/fa';

const tableHeader = [
    {
        key: "SALE",
        header: [
            "Date",
            "Product",
            "Quantity",
            "Total",
            "Staff"
        ]
    },
    {
        key: "PURCHASE",
        header: [
            "Date",
            "Supplier",
            "Products",
            "Total Items",
            "Staff"
        ]
    },
    {
        key: "RETURN",
        header: [
            "Date",
            "Product",
            "Quantity",
            "Reason",
            "Staff"
        ]
    },
    {
        key: "INVENTORY",
        header: [
            "#",
            "Product Name",
            "Size",
            "Price",
            "Stock",
        ]
    },
]

const Reports = () => {
    const { token } = useAuthStore();
    const { allData: productsData, getAllProducts } = useProductsStore();
    const { salesData: transactionsData, getTransactionSales } = useTransactionsStore();
    const [reportType, setReportType] = useState('SALE');
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const [dateRange, setDateRange] = useState({
        startDate: today.toISOString().split('T')[0],
        endDate: tomorrow.toISOString().split('T')[0]
    });
    const [filteredData, setFilteredData] = useState([]);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    const reportTableRef = useRef(null);
    const reportHeaderRef = useRef(null);

    useEffect(() => {
        if (token) {
            const { startDate, endDate } = dateRange
            getTransactionSales({ startOfDate: startDate, endOfDate: endDate, type: 'SALE' }, token);
        }
    }, [token]);

    useEffect(() => {
        filterReportData();
    }, [reportType, dateRange]);

    const filterReportData = () => {
        if (reportType === "INVENTORY" && token) {
            getAllProducts(token);
            return
        }

        const { startDate, endDate } = dateRange
        getTransactionSales({
            startOfDate: startDate,
            endOfDate: endDate,
            type: reportType
        }, token);
    };

    useEffect(() => {
        if (reportType === 'INVENTORY' && productsData.length > 0) {
            setFilteredData(productsData);
        } else if (transactionsData) {
            setFilteredData(transactionsData);
        }

    }, [transactionsData, productsData, reportType])

    const visualizationRef = useRef(null);

    const generatePDF = async () => {
        if (!reportTableRef.current || !reportHeaderRef.current) return;

        setIsGeneratingReport(true);

        try {
            const pdfUtils = await import('../../../../services/utilities/pdfUtils');

            const title = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`;

            const elements = [
                {
                    element: reportHeaderRef.current,
                    config: { scale: 2 }
                }
            ];

            if (showVisualization && visualizationRef.current) {
                elements.push({
                    element: visualizationRef.current,
                    config: { scale: 2 }
                });
            }

            elements.push({
                element: reportTableRef.current,
                config: { scale: 2 }
            });

            await pdfUtils.generatePDFFromElements({
                elements,
                filename: `${reportType}_report_${new Date().toISOString().slice(0, 10)}.pdf`,
                format: 'a4',
                orientation: 'portrait'
            });
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setIsGeneratingReport(false);
        }
    };

    const exportToCSV = async () => {
        try {
            const pdfUtils = await import('../../../../services/utilities/pdfUtils');

            let headerConfig = [];
            let formattedData = [];

            if (reportType === 'sales') {
                headerConfig = [
                    { key: 'date', label: 'Date' },
                    { key: 'product', label: 'Product' },
                    { key: 'quantity', label: 'Quantity' },
                    { key: 'total', label: 'Total' }
                ];

                formattedData = filteredData.map(item => ({
                    date: new Date(item.createdAt).toLocaleDateString(),
                    product: item.products.map(p => p.product?.productName).join(' | '),
                    quantity: item.products.map(p => p.quantity).reduce((a, b) => Number(a) + Number(b), 0),
                    total: item.products.map(p => p.quantity * (p.product?.sellingPrice || 0)).reduce((a, b) => Number(a) + Number(b), 0)
                }));
            } else if (reportType === 'purchases') {
                headerConfig = [
                    { key: 'date', label: 'Date' },
                    { key: 'supplier', label: 'Supplier' },
                    { key: 'products', label: 'Products' },
                    { key: 'totalItems', label: 'Total Items' }
                ];

                formattedData = filteredData.map(item => ({
                    date: new Date(item.purchaseDate).toLocaleDateString(),
                    supplier: item.supplier?.companyName || 'N/A',
                    products: item.products?.map(p => p.product?.productName).join(' | '),
                    totalItems: item.products?.length || 0
                }));
            } else if (reportType === 'inventory') {
                headerConfig = [
                    { key: 'productName', label: 'Product Name' },
                    { key: 'size', label: 'Size' },
                    { key: 'price', label: 'Price' },
                    { key: 'totalStock', label: 'In Stock' }
                ];

                formattedData = filteredData.map(item => ({
                    productName: item.productName,
                    size: `${item.unitSize} ${item.unit}`,
                    price: item.sellingPrice,
                    totalStock: item.totalStock || 0
                }));
            } else if (reportType === 'returns') {
                headerConfig = [
                    { key: 'date', label: 'Date' },
                    { key: 'product', label: 'Product' },
                    { key: 'quantity', label: 'Quantity' },
                    { key: 'reason', label: 'Reason' }
                ];

                formattedData = filteredData.map(item => ({
                    date: new Date(item.createdAt).toLocaleDateString(),
                    product: item.products.map(p => p.product?.productName).join(' | '),
                    quantity: item.products.map(p => p.quantity).reduce((a, b) => Number(a) + Number(b), 0),
                    reason: item.notes || 'N/A'
                }));
            }

            pdfUtils.exportToCSV(
                formattedData,
                headerConfig,
                `${reportType}_report_${new Date().toISOString().slice(0, 10)}.csv`
            );
        } catch (error) {
            console.error('Error exporting CSV:', error);
        }
    };

    const renderReportHeader = () => {
        const title = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`;
        const dateStr = `Date Range: ${dateRange.startDate} to ${dateRange.endDate}`;

        return (
            <div ref={reportHeaderRef} className="mb-4 py-4 bg-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-blue-600 mb-2">{title}</h1>
                    <p className="text-gray-600">{dateStr}</p>
                </div>
            </div>
        );
    };

    const [showVisualization, setShowVisualization] = useState(true);

    return (
        <div className='container p-4'>
            <div className="flex flex-col gap-5 pt-4">
                <div className=''>
                    <h2 className='text-xl text-[var(--primary-color)]'>Reports</h2>
                    <p className='text-sm text-[#989797]'>Generate Reports</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-lg font-semibold mb-4">Generate Reports</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Report Type
                            </label>
                            <select
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            >
                                <option value="SALE">Sales Report</option>
                                <option value="PURCHASE">Purchases Report</option>
                                <option value="RETURN">Returns Report</option>
                                <option value="INVENTORY">Inventory Report</option>
                            </select>
                        </div>

                        <ReportFilter dateRange={dateRange} setDateRange={setDateRange} />
                    </div>

                    <div className="flex flex-wrap space-x-4 mb-6">
                        <button
                            onClick={generatePDF}
                            disabled={isGeneratingReport}
                            className="inline-flex items-center px-4 py-2 bg-red-100 border border-transparent rounded-md font-semibold text-xs text-red-700 uppercase tracking-widest hover:bg-red-200 active:bg-red-300 focus:outline-none focus:border-red-300 focus:ring ring-red-200 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            <FaFilePdf className="mr-2" />
                            {isGeneratingReport ? 'Generating...' : 'Export as PDF'}
                        </button>

                        <button
                            onClick={exportToCSV}
                            className="inline-flex items-center px-4 py-2 bg-green-100 border border-transparent rounded-md font-semibold text-xs text-green-700 uppercase tracking-widest hover:bg-green-200 active:bg-green-300 focus:outline-none focus:border-green-300 focus:ring ring-green-200 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            <FaFileExcel className="mr-2" />
                            Export as CSV
                        </button>

                        {/* <button
                            onClick={() => setShowVisualization(!showVisualization)}
                            className="inline-flex items-center px-4 py-2 bg-purple-100 border border-transparent rounded-md font-semibold text-xs text-purple-700 uppercase tracking-widest hover:bg-purple-200 active:bg-purple-300 focus:outline-none focus:border-purple-300 focus:ring ring-purple-200 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            <FaChartBar className="mr-2" />
                            {showVisualization ? 'Hide Visualization' : 'Show Visualization'}
                        </button> */}
                    </div>

                    {showVisualization && (
                        <div ref={visualizationRef}>
                            <ReportVisualization
                                reportType={reportType}
                                data={filteredData}
                            />
                        </div>
                    )}

                    {renderReportHeader()}

                    <div ref={reportTableRef} className="overflow-x-auto bg-white shadow-inner rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {
                                        tableHeader.map((item) => {
                                            if (item.key === reportType) {
                                                return item.header.map((title, i) => (
                                                    <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</th>
                                                ))

                                            }
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredData.length > 0 ?
                                    filteredData.map((item, index) => {
                                        let productNames = [];
                                        let totalQty = 0;
                                        let totalPrice = 0;

                                        item.items?.forEach(p => {
                                            productNames.push(p.product?.productName);
                                            totalQty += Number(p.quantity);
                                            totalPrice += Number(p.quantity) * (p.product?.unitPrice || 0);
                                        });

                                        return (
                                            <tr key={index}>
                                                {reportType === 'SALE' && (
                                                    <>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {productNames.join(', ')}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {totalQty}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            ₱{totalPrice}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {item.createdBy.firstname} {item.createdBy.middlename} {item.createdBy.lastname}
                                                        </td>
                                                    </>
                                                )}

                                                {reportType === 'PURCHASE' && (
                                                    <>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.purchaseDate).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.supplier?.companyName || 'N/A'}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {productNames.join(', ')}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.items?.length || 0}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {item.createdBy.firstname} {item.createdBy.middlename} {item.createdBy.lastname}
                                                        </td>
                                                    </>
                                                )}

                                                {reportType === 'RETURN' && (
                                                    <>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {productNames.join(', ')}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {totalQty}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.notes || 'N/A'}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {item.createdBy.firstname} {item.createdBy.middlename} {item.createdBy.lastname}
                                                        </td>
                                                    </>
                                                )}

                                                {reportType === 'INVENTORY' && (
                                                    <>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index+1}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.productName}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unitSize} {item.unit}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₱{item.sellingPrice}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.totalStock || 0}</td>
                                                    </>
                                                )}
                                            </tr>
                                        )
                                    }) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No data available for the selected criteria
                                            </td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;