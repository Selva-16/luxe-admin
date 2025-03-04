import { useState } from "react";

const Orders = () => {

    // Sample Order Data (Replace with API Data)
    const ordersData = [
        { orderNumber: "#ORD-001", customerName: "John", product: "Sofa", status: "Delivered", amount: "Rs.3,000" },
        { orderNumber: "#ORD-002", customerName: "Emma", product: "Dining Table", status: "Processing", amount: "Rs.5,500" },
        { orderNumber: "#ORD-003", customerName: "Mike", product: "Chair", status: "Pending", amount: "Rs.1,200" },
        { orderNumber: "#ORD-004", customerName: "Sarah", product: "Bed", status: "Cancelled", amount: "Rs.8,000" },
    ];

    // State for search and filter
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // Filtered orders based on search and status
    const filteredOrders = ordersData.filter(order => 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (statusFilter === "" || order.status === statusFilter)
    );

    return (
        <div className="ml-64 p-6">

            {/* Search & Filter Section */}
            <div className="flex flex-wrap gap-4 my-10 mt-20">
                {/* Search Box */}
                <input
                    type="text"
                    placeholder="Search by Order Number"
                    className="p-2 border rounded-md shadow-sm w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Status Filter Dropdown */}
                <select
                    className="p-2 border rounded-md shadow-sm w-52"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Processing">Processing</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="p-3 text-left">Order Number</th>
                            <th className="p-3 text-left">Customer Name</th>
                            <th className="p-3 text-left">Product</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order, index) => (
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
                                    <td className="p-3">{order.amount}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-3 text-center text-gray-500">No matching orders found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;
