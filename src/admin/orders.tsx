import { useState, useEffect } from "react";
import axios from "axios";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // Fetch orders from backend API
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/orders");
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    // Function to update order status
    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus });
            setOrders(orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    // Filter orders based on search and status
    const filteredOrders = orders.filter(order =>
        order.orderNumber.toString().includes(searchQuery) &&
        (statusFilter === "" || order.status === statusFilter)
    );

    return (
        <div className="ml-64 p-6">
            {/* Search & Filter Section */}
            <div className="flex flex-wrap gap-4 my-10 mt-20">
                <input
                    type="text"
                    placeholder="Search by Order Number"
                    className="p-2 border rounded-md shadow-sm w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <select
                    className="p-2 border rounded-md shadow-sm w-52"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="p-3 text-left">Order #</th>
                            <th className="p-3 text-left">Customer Name</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Address</th>
                            <th className="p-3 text-left">Product</th>
                            <th className="p-3 text-left">Quantity</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <tr key={order._id} className="border-b hover:bg-gray-100">
                                    <td className="p-3">#{order.orderNumber}</td>
                                    <td className="p-3">{order.userId?.name || "Guest"}</td>
                                    <td className="p-3">{order.userId?.email || "N/A"}</td>
                                    <td className="p-3">{order.shippingDetails.address}</td>
                                    <td className="p-3">{order.items.map(item => item.name).join(", ")}</td>
                                    <td className="p-3">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                                    <td className="p-3">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            className={`border p-2 rounded-md w-full ${
                                                order.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                                                order.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                                                order.status === "Delivered" ? "bg-green-100 text-green-700" :
                                                order.status === "Cancelled" ? "bg-red-100 text-red-700" :
                                                "bg-gray-100"
                                            }`}
                                        >
                                            <option value="Pending" className="text-black">Pending</option>
                                            <option value="In Progress" className="text-black">In Progress</option>
                                            <option value="Delivered" className="text-black">Delivered</option>
                                            <option value="Cancelled" className="text-black">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="p-3">Rs.{order.totalAmount}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="p-3 text-center text-gray-500">No matching orders found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;
