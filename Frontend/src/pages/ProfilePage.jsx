import React, { useState, useEffect } from "react";
import Navbar2 from "../components/Navbar2";

const ProfilePage = () => {
    // Dummy user data
    const [user, setUser] = useState({
        name: "John Doe",
        email: "johndoe@example.com",
        totalReferrals: 150,
        dailyReferrals: 10,
        weeklyReferrals: 35,
        totalRank: 5,
        dailyRank: 2,
        weeklyRank: 3,
        triviaPointsToday: 50,
        totalPoints: 500,
        referralLink: "https://example.com/signup?ref=XYZ123",
    });

    // Random avatar URL
    const [avatarUrl, setAvatarUrl] = useState("");

    useEffect(() => {
        // Generate a random avatar URL
        const randomId = Math.floor(Math.random() * 100) + 1;
        setAvatarUrl(`https://avatar.iran.liara.run/public/${randomId}`);
    }, []);

    // Handle trivia button click
    const handleTriviaClick = () => {
        alert("Feature coming soon!");
    };

    // Handle copy referral link
    const handleCopyLink = () => {
        navigator.clipboard.writeText(user.referralLink);
        alert("Referral link copied to clipboard!");
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-200">
            {/* Navbar */}
            <Navbar2 />

            <div className="flex flex-col items-center p-6 max-w-4xl mx-auto shadow-lg rounded-lg bg-white mt-10 font-montserrat">
                {/* Profile Picture and User Info */}
                <div className="flex flex-col items-center mb-8">
                    <img
                        src={avatarUrl}
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
                        {user.totalPoints}
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
                        <p className="text-3xl font-bold text-[#67358E]">
                            {user.triviaPointsToday}
                        </p>
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
