import React from "react";
import RanksForDailyAndWeekly from "./RanksForDailyAndWeekly";

const WeeklyLeaderboard = ({ weeklyRanks }) => {
    return (
        <div className="bg-[#EAF8F1] p-6 rounded-lg shadow-lg w-full max-w-3xl mx-auto my-6">
            <h2 className="text-2xl font-bold text-center text-black mb-4">
                🏆 Weekly Leaderboard
            </h2>
            {weeklyRanks.slice(0, 5).map((rank) => (
                <RanksForDailyAndWeekly
                    key={rank.rank}
                    rank={rank.rank}
                    name={rank.name}
                    profilePicture={rank.profilePicture}
                    score={rank.score}
                    isWeekly={true}
                />
            ))}
        </div>
    );
};

export default WeeklyLeaderboard;
