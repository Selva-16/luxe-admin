import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Package, Users, LogOut } from "lucide-react";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Define page titles based on routes
    const pageTitles: Record<string, string> = {
        "/admin/dashboard": "Dashboard Overview",
        "/admin/orders": "Order Management",
        "/admin/products": "Product Management",
        "/admin/users": "Customer Management",
        "/login": "Logout",
    };

    // Get the current page title, default to "Dashboard"
    const currentPageTitle = pageTitles[location.pathname] || "Dashboard";

    // Redirect to dashboard by default if on root "/"
    useEffect(() => {
        if (location.pathname === "/") {
            navigate("/admin/dashboard", { replace: true });
        }
    }, [location.pathname, navigate]);

    return (
        <div className="flex">
            {/* Sidebar */}
            <aside className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0 p-6 shadow-lg">
                <h4 className="text-2xl font-bold mb-6">LuxeFurnish</h4>

                {/* Sidebar Links */}
                <ul className="space-y-4 mt-6">
                    <li>
                        <button 
                            className="w-full flex items-center gap-3 text-left text-white hover:bg-gray-700 p-2 rounded" 
                            onClick={() => navigate("/admin/dashboard")}
                        >
                            <LayoutDashboard size={20} />
                            Dashboard
                        </button>
                    </li>
                    <li>
                        <button 
                            className="w-full flex items-center gap-3 text-left text-white hover:bg-gray-700 p-2 rounded" 
                            onClick={() => navigate("/admin/orders")}
                        >
                            <ShoppingCart size={20} />
                            Orders
                        </button>
                    </li>
                    <li>
                        <button 
                            className="w-full flex items-center gap-3 text-left text-white hover:bg-gray-700 p-2 rounded" 
                            onClick={() => navigate("/admin/products")}
                        >
                            <Package size={20} />
                            Products
                        </button>
                    </li>
                    <li>
                        <button 
                            className="w-full flex items-center gap-3 text-left text-white hover:bg-gray-700 p-2 rounded" 
                            onClick={() => navigate("/admin/users")}
                        >
                            <Users size={20} />
                            Customers
                        </button>
                    </li>
                    <li>
                        <button 
                            className="w-full flex items-center gap-3 text-left text-red-400 hover:bg-gray-700 p-2 rounded" 
                            onClick={() => window.location.href = 'https://luxeuser.netlify.app/'}
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </li>
                </ul>
            </aside>

            {/* Main Content */}
            <div className="ml-64 w-full">
                {/* Navbar with Page Title */}
                <nav className="bg-gray-900 text-white p-4 shadow-md fixed top-0 left-64 right-0">
                    <h1 className="text-xl font-semibold">{currentPageTitle}</h1>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
