import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Package, Users, LogOut, Menu, X } from "lucide-react";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const pageTitles = {
        "/admin/dashboard": "Dashboard Overview",
        "/admin/orders": "Order Management",
        "/admin/products": "Product Management",
        "/admin/users": "Customer Management",
        "/login": "Logout",
    };

    const currentPageTitle = pageTitles[location.pathname] || "Dashboard";

    useEffect(() => {
        if (location.pathname === "/") {
            navigate("/admin/dashboard", { replace: true });
        }
    }, [location.pathname, navigate]);

    return (
        <div className="flex">
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button onClick={() => setIsOpen(!isOpen)} className="text-white bg-gray-900 p-2 rounded">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <aside className={`fixed top-0 left-0 h-screen w-60 bg-gray-900 text-white p-6 shadow-lg transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:w-64 z-40` }>
                <h4 className="text-2xl font-bold mb-6">LuxeFurnish</h4>
                <ul className="space-y-4 mt-6">
                    <li>
                        <button className="w-full flex items-center gap-3 text-left text-white hover:bg-gray-700 p-2 rounded" onClick={() => navigate("/admin/dashboard")}>
                            <LayoutDashboard size={20} /> Dashboard
                        </button>
                    </li>
                    <li>
                        <button className="w-full flex items-center gap-3 text-left text-white hover:bg-gray-700 p-2 rounded" onClick={() => navigate("/admin/orders")}>
                            <ShoppingCart size={20} /> Orders
                        </button>
                    </li>
                    <li>
                        <button className="w-full flex items-center gap-3 text-left text-white hover:bg-gray-700 p-2 rounded" onClick={() => navigate("/admin/products")}>
                            <Package size={20} /> Products
                        </button>
                    </li>
                    <li>
                        <button className="w-full flex items-center gap-3 text-left text-white hover:bg-gray-700 p-2 rounded" onClick={() => navigate("/admin/users")}>
                            <Users size={20} /> Customers
                        </button>
                    </li>
                    <li>
                        <button className="w-full flex items-center gap-3 text-left text-red-400 hover:bg-gray-700 p-2 rounded" onClick={() => window.location.href = 'https://luxeuser.netlify.app/'}>
                            <LogOut size={20} /> Logout
                        </button>
                    </li>
                </ul>
            </aside>

            <div className="lg:ml-64 w-full">
                <nav className="bg-gray-900 text-white p-4 shadow-md fixed top-0 left-0 lg:left-64 right-0 flex items-center justify-center lg:justify-start">
                    <h1 className="text-xl font-semibold">{currentPageTitle}</h1>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
