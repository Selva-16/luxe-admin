import { useState } from "react";
// import { useNavigate } from "react-router-dom";

const Users = () => {
    // const navigate = useNavigate();

    // Sample User Data (Replace with API Data)
    const usersData = [
        { userName: "John Durairaj", email: "john@gmail.com", password: "*****", loginDate: "20/03/2025" },
        { userName: "Emma Watson", email: "emma@gmail.com", password: "*****", loginDate: "18/03/2025" },
        { userName: "Mike Johnson", email: "mike@gmail.com", password: "*****", loginDate: "15/03/2025" },
        { userName: "Sarah Lee", email: "sarah@gmail.com", password: "*****", loginDate: "12/03/2025" },
    ];

    // State for search
    const [searchQuery, setSearchQuery] = useState("");

    // Filtered users based on search
    const filteredUsers = usersData.filter(user =>
        user.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="ml-64 p-6">

            {/* Search Box */}
            <div className="mt-20">
                <input
                    type="text"
                    placeholder="Search by Customer Name"
                    className="p-2 border rounded-md shadow-sm w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-5">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="p-3 text-left">User Name</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Password</th>
                            <th className="p-3 text-left">Login Date</th>
                            <th className="p-3 text-left">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user, index) => (
                                <tr key={index} className="border-b hover:bg-gray-100">
                                    <td className="p-3">{user.userName}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.password}</td>
                                    <td className="p-3">{user.loginDate}</td>
                                    <td className="p-3">
                                        <button className="px-3 py-1 mr-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                            Update
                                        </button>
                                        <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-3 text-center text-gray-500">No matching users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
