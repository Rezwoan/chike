import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg"; // Import the logo image

const Navbar = ({ leaderboardRef }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    // Handle scroll to leaderboard
    const scrollToLeaderboard = () => {
        if (leaderboardRef && leaderboardRef.current) {
            leaderboardRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="px-4 sm:px-6 md:px-8 lg:px-32 flex justify-between items-center p-6">
                {/* Logo Section */}
                <div
                    onClick={() => navigate("/")}
                    className="flex items-center space-x-2"
                >
                    <img src={logo} alt="Chi.ke Logo" className="h-8" />
                </div>

                {/* Hamburger Menu */}
                <div className="lg:hidden">
                    <button
                        onClick={toggleMenu}
                        className="text-black focus:outline-none"
                    >
                        {/* Hamburger Icon */}
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M3 6h18M3 12h18M3 18h18" />
                        </svg>
                    </button>
                </div>

                {/* Buttons Section - Hidden on Mobile */}
                <div className="hidden lg:flex items-center space-x-6">
                    {/* Leaderboard Button */}
                    <button
                        //onClick={() => navigate("/")} // <-- Navigate to /leaderboard
                        onClick={() => navigate("/")}
                        className="text-[#67358E] border-2 border-[#67358E] rounded-full hover:bg-[#67358E] hover:text-white transition duration-200"
                        style={{ width: "127px", height: "37px" }}
                    >
                        Leaderboard
                    </button>

                    {/* Join Waitlist Button */}
                    <button
                        onClick={() => navigate("/")}
                        className="bg-[#67358E] text-white rounded-full hover:bg-[#542C71] transition duration-200"
                        style={{ width: "121px", height: "40px" }}
                    >
                        Home
                    </button>
                </div>
            </div>

            {/* Dropdown Menu - Mobile View */}
            {menuOpen && (
                <div className="lg:hidden bg-white px-4 sm:px-6 md:px-8 lg:px-32 shadow-md">
                    <div className="flex flex-col space-y-4 py-4">
                        <button
                            onClick={() => navigate("/")}
                            className="text-[#67358E] border-2 border-[#67358E] rounded-full hover:bg-[#67358E] hover:text-white transition duration-200 px-6 py-2"
                        >
                            Leaderboard
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="bg-[#67358E] text-white rounded-full hover:bg-[#542C71] transition duration-200 px-6 py-2"
                        >
                            Home
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
