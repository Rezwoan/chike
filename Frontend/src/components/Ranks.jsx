import React from "react";

const Ranks = ({ rank, name, profilePicture, score, isWeekly }) => {
    // Generate a random number for the avatar ID (used only if profilePicture is not provided)
    const randomId = Math.floor(Math.random() * 100) + 1;
    const defaultImage = `https://avatar.iran.liara.run/public/${randomId}`;

    // Determine background and text classes based on rank and leaderboard type
    const getBackgroundClass = () => {
        if (rank === 1) return isWeekly ? "bg-blue-600" : "bg-[#67358E]";
        if (rank === 2) return "bg-green-500";
        return "bg-white border border-gray-800";
    };

    return (
        <div
            className={`flex items-center justify-between ${getBackgroundClass()} rounded-full my-2 px-4 py-3 w-full shadow-md`}
        >
            {/* Rank Section */}
            <div className="flex items-center gap-4">
                <span className="text-lg font-bold">{rank}</span>

                {/* Profile Picture */}
                <img
                    src={profilePicture || defaultImage}
                    alt={name}
                    className="h-10 w-10 rounded-full border-2 border-white"
                />

                {/* Name */}
                <span
                    className={`text-base font-medium ${
                        rank > 2 ? "text-black" : "text-white"
                    }`}
                >
                    {name}
                </span>
            </div>

            {/* Score Section */}
            <div className="flex items-center gap-2">
                <span
                    className={`text-lg ${
                        rank > 2 ? "text-black" : "text-yellow-400"
                    }`}
                >
                    ⭐
                </span>
                <span
                    className={`text-base font-bold ${
                        rank > 2 ? "text-black" : "text-white"
                    }`}
                >
                    {score}
                </span>
            </div>
        </div>
    );
};

export default Ranks;
