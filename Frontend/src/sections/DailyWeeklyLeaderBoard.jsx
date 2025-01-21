import React, { useEffect, useState } from "react";
import DailyLeaderboard from "../components/DailyLeaderboard";
import WeeklyLeaderboard from "../components/WeeklyLeaderboard";

const DailyWeeklyLeaderBoard = () => {
    const [dailyRanks, setDailyRanks] = useState([]);
    const [weeklyRanks, setWeeklyRanks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data from the backend
    useEffect(() => {
        const fetchLeaderboards = async () => {
            try {
                // Fetch daily leaderboard
                const dailyResponse = await fetch(
                    "https://backend-python.playchike.com/referral/leaderboard/daily"
                );
                const dailyData = await dailyResponse.json();

                // Fetch weekly leaderboard
                const weeklyResponse = await fetch(
                    "https://backend-python.playchike.com/referral/leaderboard/weekly"
                );
                const weeklyData = await weeklyResponse.json();

                // Update state
                setDailyRanks(dailyData);
                setWeeklyRanks(weeklyData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching leaderboards:", error);
                setLoading(false); // Stop loading if there’s an error
            }
        };

        fetchLeaderboards();
    }, []);

    if (loading) {
        return (
            <div className="text-center text-xl p-6">
                Loading leaderboards...
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <DailyLeaderboard dailyRanks={dailyRanks} />
            <WeeklyLeaderboard weeklyRanks={weeklyRanks} />
        </div>
    );
};

export default DailyWeeklyLeaderBoard;
