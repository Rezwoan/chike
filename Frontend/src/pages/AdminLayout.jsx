import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const adminId = localStorage.getItem("adminId");
        if (!adminId) {
            navigate("/admin/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("adminId");
        navigate("/admin/login");
    };

    // When a link is clicked on mobile, collapse sidebar
    const handleLinkClick = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row font-montserrat">
            {/* Mobile Header */}
            <div className="md:hidden bg-[#67358E] text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Admin Panel</h2>
                <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                    {sidebarOpen ? "Close" : "Menu"}
                </button>
            </div>
            {/* Sidebar */}
            <div
                className={`bg-[#67358E] text-white p-6 md:w-64 w-full md:block ${
                    sidebarOpen ? "block" : "hidden"
                } md:static absolute top-0 left-0 z-50`}
            >
                <h2 className="text-3xl font-bold mb-8">Admin Panel</h2>
                <nav className="space-y-4">
                    <Link
                        to="/admin/dashboard"
                        onClick={handleLinkClick}
                        className="block hover:text-[#8B5FBF]"
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/admin/users"
                        onClick={handleLinkClick}
                        className="block hover:text-[#8B5FBF]"
                    >
                        Users
                    </Link>
                    <Link
                        to="/admin/referrals"
                        onClick={handleLinkClick}
                        className="block hover:text-[#8B5FBF]"
                    >
                        Referrals
                    </Link>
                    <Link
                        to="/admin/winners"
                        onClick={handleLinkClick}
                        className="block hover:text-[#8B5FBF]"
                    >
                        Winners
                    </Link>
                    <Link
                        to="/admin/withdrawals"
                        onClick={handleLinkClick}
                        className="block hover:text-[#8B5FBF]"
                    >
                        Withdrawals
                    </Link>
                </nav>
                <button
                    onClick={handleLogout}
                    className="mt-8 w-full py-2 bg-[#8B5FBF] rounded-full hover:bg-[#a678d0] transition-all"
                >
                    Logout
                </button>
            </div>
            {/* Main Content */}
            <div className="flex-1 p-6 bg-gradient-to-b from-gray-50 to-gray-200">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
