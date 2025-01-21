import React from "react";
import Ranks from "../components/Ranks";
import { useState, useEffect } from "react";

const LeaderBoard = () => {
    const [data, setData] = useState([]); // State to hold leaderboard data
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch data from the Python backend
    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch(
                    "http://backend-python.playchike.com/referral/leaderboard"
                );
                const result = await response.json();
                setData(result); // Update state with fetched data
                setLoading(false); // Set loading to false
            } catch (error) {
                console.error("Error fetching leaderboard data:", error);
                setLoading(false); // Set loading to false even if there's an error
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return <p className="text-center">Loading...</p>;
    }

    return (
        <>
            {" "}
            <div
                id="LeaderBoard"
                className="bg-gradient-to-b from-white-100 to-white-200 p-8 rounded-2xl shadow-lg w-full max-w-4xl mx-auto"
            >
                {/* Title */}
                <h1 className="text-2xl font-bold text-center text-black mb-6">
                    See Who's Referring the Most
                </h1>

                {/* Leaderboard */}
                <div className="space-y-4">
                    {data.map((person) => (
                        <Ranks
                            key={person.rank}
                            rank={person.rank}
                            name={person.name}
                            profilePicture={person.profilePicture}
                            score={person.score}
                        />
                    ))}
                </div>
            </div>
            <div className="h-8 w-auto"></div>
        </>
    );
};

export default LeaderBoard;
