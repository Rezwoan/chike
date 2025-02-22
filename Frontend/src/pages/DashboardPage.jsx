import React, { useEffect, useState } from "react";

const DashboardPage = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [statsData, setStatsData] = useState(null);
    const [pendingAmount, setPendingAmount] = useState(0);
    const [error, setError] = useState("");
    const adminId = localStorage.getItem("adminId");

    useEffect(() => {
        // 1. Fetch the "dashboard" data (if your /admin/dashboard still exists)
        fetch("http://127.0.0.1:5000/admin/dashboard")
            .then((res) => res.json())
            .then((data) => setDashboardData(data))
            .catch(() => setError("Failed to fetch dashboard data."));

        // 2. Fetch the NEW /admin/stats data
        fetch("http://127.0.0.1:5000/admin/stats")
            .then((res) => res.json())
            .then((data) => setStatsData(data))
            .catch(() => setError("Failed to fetch stats data."));

        // 3. Fetch pending withdrawals to sum amounts
        if (adminId) {
            fetch(
                `http://127.0.0.1:5000/admin/withdrawals?admin_id=${adminId}&status=pending&limit=1000`
            )
                .then((res) => res.json())
                .then((data) => {
                    if (data.withdrawals) {
                        const sum = data.withdrawals.reduce(
                            (acc, w) => acc + w.amount,
                            0
                        );
                        setPendingAmount(sum);
                    }
                })
                .catch(() => {
                    // Optional: setError("Failed to fetch pending withdrawals.");
                });
        }
    }, [adminId]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-[#67358E] mb-6">
                Dashboard
            </h1>
            {error && <p className="text-red-500">{error}</p>}

            {/* ---- Dashboard Data (from /admin/dashboard) ---- */}
            {dashboardData ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="p-4 bg-white rounded-lg shadow border">
                        <p className="font-bold text-lg">Total Users</p>
                        <p className="text-2xl text-green-600">
                            {dashboardData.total_users}
                        </p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow border">
                        <p className="font-bold text-lg">Total Referrals</p>
                        <p className="text-2xl text-green-600">
                            {dashboardData.total_referrals}
                        </p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow border">
                        <p className="font-bold text-lg">Total Earned</p>
                        <p className="text-2xl text-green-600">
                            ${dashboardData.total_earned}
                        </p>
                    </div>
                </div>
            ) : (
                <p>Loading dashboard data...</p>
            )}

            {/* ---- Pending Withdrawals ---- */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#67358E] mb-4">
                    Pending Withdrawals
                </h2>
                <div className="p-4 bg-white rounded-lg shadow border">
                    <p className="font-bold text-lg">Total Pending Amount</p>
                    <p className="text-2xl text-green-600">${pendingAmount}</p>
                </div>
            </div>

            {/* ---- New Stats (from /admin/stats) ---- */}
            {statsData ? (
                <div>
                    <h2 className="text-2xl font-bold text-[#67358E] mb-4">
                        Additional Stats
                    </h2>
                    <div className="mb-4 p-4 bg-white rounded-lg shadow border">
                        <p className="font-bold">Total Earned Sum</p>
                        <p className="text-green-600">
                            ${statsData.total_earned_sum}
                        </p>
                    </div>

                    <div className="p-4 bg-white rounded-lg shadow border">
                        <p className="font-bold">Top Earners</p>
                        {statsData.top_earners &&
                        statsData.top_earners.length > 0 ? (
                            <ul className="list-disc ml-5">
                                {statsData.top_earners.map((user) => (
                                    <li key={user.id}>
                                        {user.name} (${user.total_earned})
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No top earners found.</p>
                        )}
                    </div>
                </div>
            ) : (
                <p>Loading stats data...</p>
            )}
        </div>
    );
};

export default DashboardPage;
