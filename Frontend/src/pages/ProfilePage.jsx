import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar2 from "../components/Navbar2";

const ProfilePage = ({ setUserId }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const userState = location.state?.user;

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userState) {
            navigate("/");
        } else {
            setUserId(userState.id); // Store userId globally in App.jsx
        }
    }, [userState, navigate, setUserId]);

    useEffect(() => {
        if (userState) {
            const fetchProfileData = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(
                        "http://127.0.0.1:5000/profile/profile",
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ userID: userState.id }),
                        }
                    );

                    if (!response.ok) {
                        throw new Error("Failed to fetch profile data");
                    }

                    const data = await response.json();
                    setUser(data);
                } catch (error) {
                    console.error("Error fetching profile data:", error);
                    setError("Unable to fetch profile data. Please try again.");
                } finally {
                    setIsLoading(false);
                }
            };

            fetchProfileData();
        }
    }, [userState]);

    const handleCopyLink = () => {
        if (user && user.referralLink) {
            navigator.clipboard.writeText(user.referralLink);
            alert("Referral link copied to clipboard!");
        }
    };

    const handleTriviaClick = () => {
        if (!user || !user.id) {
            alert("User data not available. Please try again.");
            return;
        }

        navigate("/trivia");
    };

    if (isLoading) {
        return <p className="text-center text-lg">Loading profile...</p>;
    }

    if (error) {
        return <p className="text-center text-lg text-red-500">{error}</p>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
            <Navbar2 />
            <div className="flex flex-col items-center p-6 max-w-4xl mx-auto shadow-lg rounded-lg bg-white mt-10 font-montserrat">
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

                {/* Total Earned */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[#67358E] mb-2">
                        Total Earned
                    </h2>
                    <p className="text-5xl font-bold text-green-600">
                        ${user.total_earned}
                    </p>
                </div>

                {/* Total Points */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[#67358E] mb-2">
                        Total Points
                    </h2>
                    <p className="text-5xl font-bold text-green-600">
                        {user.total_points}
                    </p>
                </div>

                {/* Referral Link */}
                <div className="flex flex-col items-center w-full mb-8">
                    <h2 className="text-xl font-bold text-center mb-4">
                        Share Your Referral Link
                    </h2>
                    <div className="flex items-center w-full max-w-md gap-3">
                        <input
                            type="text"
                            value={
                                user.referralLink ||
                                "No referral link available"
                            }
                            readOnly
                            className="flex-1 p-2 text-sm rounded-lg border border-gray-300 bg-gray-100 text-gray-600"
                        />
                        {user.referralLink && (
                            <button
                                onClick={handleCopyLink}
                                className="px-6 py-2 bg-[#67358E] text-white rounded-full hover:bg-[#8B5FBF] transition-all"
                            >
                                Copy
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    {/* Total Referrals */}
                    <div className="p-4 bg-white-100 rounded-lg shadow text-center border border-gray-300">
                        <p className="text-lg font-bold">Total Referrals</p>
                        <p className="text-3xl font-bold text-green-600">
                            {user.totalReferrals}
                        </p>
                    </div>

                    {/* Daily Stats */}
                    <div className="p-4 bg-white-100 rounded-lg shadow text-center border border-gray-300">
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

                    {/* Weekly Stats */}
                    <div className="p-4 bg-white-100 rounded-lg shadow text-center border border-gray-300">
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

                    {/* Next Trivia Attempt */}
                    <div className="p-4 bg-purple-100 rounded-lg shadow text-center border border-gray-300">
                        <p className="text-lg font-bold">Next Trivia Attempt</p>
                        <p className="text-3xl font-bold text-[#67358E]">
                            {user.remainingTriviaTime > 0
                                ? `Wait ${user.remainingTriviaTime} min`
                                : "You can play now!"}
                        </p>
                    </div>
                </div>

                {/* Trivia Button */}
                <button
                    onClick={handleTriviaClick}
                    className="mt-10 px-8 py-3 text-lg rounded-full bg-[#67358E] text-white hover:bg-[#8B5FBF] transition-all"
                >
                    Play Trivia Game
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;
