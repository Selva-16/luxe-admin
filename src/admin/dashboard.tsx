import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ClipboardList, Box, DollarSign, TrendingUp, ShoppingBag } from "lucide-react";

const Dashboard = () => {
    const navigate = useNavigate();

    // Sample Summary Data (Replace with API Data)
    const totalSales = 500000;
    const totalOrders = 120;
    const totalProducts = 50;
    const totalRevenue = 1250000;

    // Sample Top Products Data (Replace with API Data)
    const topProducts = [
        { productName: "Sofa", sales: 50, revenue: 150000 },
        { productName: "Dining Table", sales: 30, revenue: 165000 },
        { productName: "Chair", sales: 75, revenue: 90000 },
        { productName: "Bed", sales: 20, revenue: 160000 },
    ];

    // Sample Order Data (Replace with API Data)
    const ordersData = [
        { orderNumber: "#ORD-001", customerName: "John", product: "Sofa", status: "Delivered", amount: 3000 },
        { orderNumber: "#ORD-002", customerName: "Emma", product: "Dining Table", status: "Processing", amount: 5500 },
        { orderNumber: "#ORD-003", customerName: "Mike", product: "Chair", status: "Pending", amount: 1200 },
        { orderNumber: "#ORD-004", customerName: "Sarah", product: "Bed", status: "Cancelled", amount: 8000 },
        { orderNumber: "#ORD-005", customerName: "Alex", product: "Sofa", status: "Delivered", amount: 3000 },
    ];

    return (
        <div className="ml-64 p-6">

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
                {[{ label: "Total Sales", value: totalSales, icon: ShoppingBag },
                  { label: "Total Orders", value: totalOrders, icon: ClipboardList },
                  { label: "Total Products", value: totalProducts, icon: Box },
                  { label: "Total Revenue", value: totalRevenue, icon: TrendingUp }]
                  .map(({ label, value, icon: Icon }, index) => (
                    <div key={index} className="bg-gray-200 shadow-md rounded-lg p-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold">{label}</h3>
                            <p className="text-2xl font-bold">{typeof value === 'number' ? `₹ ${value.toLocaleString()}` : value}</p>
                        </div>
                        <Icon className="w-10 h-10 text-gray-500" />
                    </div>
                ))}
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white shadow-md rounded-lg p-4 mt-5">
                <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="p-3 text-left">Order No</th>
                                <th className="p-3 text-left">Customer Name</th>
                                <th className="p-3 text-left">Product</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Amount (Rs)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordersData.map((order, index) => (
                                <tr key={index} className="border-b hover:bg-gray-100">
                                    <td className="p-3">{order.orderNumber}</td>
                                    <td className="p-3">{order.customerName}</td>
                                    <td className="p-3">{order.product}</td>
                                    <td className={`p-3 font-semibold ${order.status === "Delivered" ? "text-green-500" : 
                                        order.status === "Processing" ? "text-blue-500" : 
                                        order.status === "Pending" ? "text-yellow-500" : 
                                        "text-red-500"}`}>
                                        {order.status}
                                    </td>
                                    <td className="p-3">{order.amount.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Top Products Table */}
            <div className="bg-white shadow-md rounded-lg p-4 mt-5">
                <h3 className="text-xl font-semibold mb-4">Top Products</h3>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="p-3 text-left">Product Name</th>
                                <th className="p-3 text-left">Sales</th>
                                <th className="p-3 text-left">Revenue (Rs)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topProducts.map((product, index) => (
                                <tr key={index} className="border-b hover:bg-gray-100">
                                    <td className="p-3">{product.productName}</td>
                                    <td className="p-3">{product.sales}</td>
                                    <td className="p-3">{product.revenue.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;