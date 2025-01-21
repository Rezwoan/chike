import React, { useState, useEffect } from "react";
import Navbar2 from "../components/Navbar2";

const ProfilePage = () => {
    const [user, setUser] = useState(null); // To hold the profile data
    const [isLoading, setIsLoading] = useState(true); // To handle loading state
    const [error, setError] = useState(null); // To handle errors
    const userId = 53; // Replace this with the actual logged-in user ID

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:5000/profile/profile/${userId}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch profile data");
                }

                const data = await response.json();
                setUser(data); // Set the profile data
            } catch (error) {
                console.error("Error fetching profile data:", error);
                setError("Unable to fetch profile data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [userId]);

    // Handle copy referral link
    const handleCopyLink = () => {
        if (user && user.referralLink) {
            navigator.clipboard.writeText(user.referralLink);
            alert("Referral link copied to clipboard!");
        }
    };

    // Handle trivia button click
    const handleTriviaClick = () => {
        alert("Feature coming soon!");
    };

    if (isLoading) {
        return <p className="text-center text-lg">Loading profile...</p>;
    }

    if (error) {
        return <p className="text-center text-lg text-red-500">{error}</p>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-200">
            {/* Navbar */}
            <Navbar2 />

            <div className="flex flex-col items-center p-6 max-w-4xl mx-auto shadow-lg rounded-lg bg-white mt-10 font-montserrat">
                {/* Profile Picture and User Info */}
                <div className="flex flex-col items-center mb-8">
                    <img
                        src={`https://avatar.iran.liara.run/public/${Math.floor(
                            Math.random() * 100 + 1
                        )}`}
                        alt="Profile Avatar"
                        className="h-32 w-32 rounded-full border-4 border-green-600 mb-4"
                    />
                    <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
                    <p className="text-gray-600">{user.email}</p>
                </div>

                {/* Highlight: Total Points */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[#67358E] mb-2">
                        Total Points
                    </h2>
                    <p className="text-5xl font-bold text-green-600">
                        {user.totalReferrals * 10}
                    </p>
                </div>

                {/* Referral Link Section */}
                <div className="flex flex-col items-center w-full mb-8">
                    <h2 className="text-xl font-bold text-center mb-4">
                        Share Your Referral Link
                    </h2>
                    <div className="flex items-center w-full max-w-md gap-3">
                        <input
                            type="text"
                            value={user.referralLink}
                            readOnly
                            className="flex-1 p-2 text-sm rounded-lg border border-gray-300 bg-gray-100 text-gray-600"
                        />
                        <button
                            onClick={handleCopyLink}
                            className="px-6 py-2 bg-[#67358E] text-white rounded-full hover:bg-[#8B5FBF] transition-all"
                        >
                            Copy
                        </button>
                    </div>
                </div>

                {/* Combined Statistics Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    {/* Total Referrals */}
                    <div className="p-4 bg-blue-100 rounded-lg shadow text-center">
                        <p className="text-lg font-bold">Total Referrals</p>
                        <p className="text-3xl font-bold text-green-600">
                            {user.totalReferrals}
                        </p>
                    </div>

                    {/* Daily Rank and Referrals */}
                    <div className="p-4 bg-blue-100 rounded-lg shadow text-center">
                        <p className="text-lg font-bold">Daily Stats</p>
                        <p className="text-sm text-gray-600">
                            Rank:{" "}
                            <span className="text-xl font-bold text-green-600">
                                #{user.dailyRank}
                            </span>
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            Referrals:{" "}
                            <span className="text-xl font-bold text-green-600">
                                {user.dailyReferrals}
                            </span>
                        </p>
                    </div>

                    {/* Weekly Rank and Referrals */}
                    <div className="p-4 bg-blue-100 rounded-lg shadow text-center">
                        <p className="text-lg font-bold">Weekly Stats</p>
                        <p className="text-sm text-gray-600">
                            Rank:{" "}
                            <span className="text-xl font-bold text-green-600">
                                #{user.weeklyRank}
                            </span>
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            Referrals:{" "}
                            <span className="text-xl font-bold text-green-600">
                                {user.weeklyReferrals}
                            </span>
                        </p>
                    </div>

                    {/* Trivia Points */}
                    <div className="p-4 bg-purple-100 rounded-lg shadow text-center">
                        <p className="text-lg font-bold">Trivia Points Today</p>
                        <p className="text-3xl font-bold text-[#67358E]">N/A</p>
                    </div>
                </div>

                {/* Trivia Button */}
                <button
                    onClick={handleTriviaClick}
                    className="mt-10 px-8 py-3 text-lg rounded-full bg-[#67358E] text-white hover:bg-[#8B5FBF] transition-all"
                >
                    Try Trivia Questions
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;
