import { useState, useEffect } from "react";
import axios from "axios";

const Users = () => {
    interface User {
        _id: string;
        name: string;
        email: string;
        loginDate: string;
    }

    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/users");
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Function to handle user deletion
    const handleDelete = async (userId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/users/${userId}`);
            // Remove user from the state after successful deletion
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const filteredUsers = users.filter(user =>
        user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 mt-20 w-full lg:ml-64 lg:w-[calc(100%-16rem)] md:ml-56 md:w-[calc(100%-14rem)] sm:ml-0 sm:w-full overflow-x-auto">
            <div>
                <input
                    type="text"
                    placeholder="Search by User Name"
                    className="p-2 border rounded-md shadow-sm w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {loading ? (
                <p className="text-center mt-5">Loading users...</p>
            ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-5">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="p-3 text-left">User Name</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Login Date</th>
                                <th className="p-3 text-left">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="border-b hover:bg-gray-100">
                                        <td className="p-3">{user.name}</td>
                                        <td className="p-3">{user.email}</td>
                                        <td className="p-3">{new Date(user.loginDate).toLocaleDateString()}</td>
                                        <td className="p-3">
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-3 text-center text-gray-500">No matching users found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Users;
