import axios from "axios";

// Base URL for the backend
const BASE_URL = "https://backend-python.playchike.com/referral";

// Fetch daily leaderboard
export const fetchDailyLeaderboard = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/leaderboard/daily`);
        return response.data;
    } catch (error) {
        console.error("Error fetching daily leaderboard:", error);
        return [];
    }
};

// Fetch weekly leaderboard
export const fetchWeeklyLeaderboard = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/leaderboard/weekly`);
        return response.data;
    } catch (error) {
        console.error("Error fetching weekly leaderboard:", error);
        return [];
    }
};
