import React, { useEffect, useState } from "react";

const WinnerManagementPage = () => {
    const [winners, setWinners] = useState([]);
    const [userIdFilter, setUserIdFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState("");

    const fetchWinners = async (pageNumber = 1) => {
        setError("");
        try {
            let url = `http://127.0.0.1:5000/admin/winners?page=${pageNumber}&limit=10`;
            if (userIdFilter) url += `&user_id=${userIdFilter}`;
            if (typeFilter) url += `&type=${encodeURIComponent(typeFilter)}`;
            const res = await fetch(url);
            const data = await res.json();
            if (res.ok) {
                setWinners(data.winners);
                setPage(data.current_page);
                setTotalPages(data.pages);
            } else {
                setError(data.message || "Failed to fetch winners.");
            }
        } catch (err) {
            setError("Error fetching winners.");
        }
    };

    useEffect(() => {
        fetchWinners();
    }, [userIdFilter, typeFilter]);

    const handleDelete = async (winnerId) => {
        if (!window.confirm("Are you sure you want to delete this winner?"))
            return;
        try {
            const res = await fetch(
                `http://127.0.0.1:5000/admin/winners/${winnerId}`,
                {
                    method: "DELETE",
                }
            );
            const data = await res.json();
            if (res.ok) {
                fetchWinners(page);
            } else {
                setError(data.message || "Failed to delete winner.");
            }
        } catch (err) {
            setError("Error deleting winner.");
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-[#67358E] mb-6">
                Winner Management
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4 flex gap-4 flex-col sm:flex-row">
                <input
                    type="number"
                    placeholder="Filter by User ID"
                    value={userIdFilter}
                    onChange={(e) => setUserIdFilter(e.target.value)}
                    className="p-2 border rounded-lg flex-1"
                />
                <input
                    type="text"
                    placeholder="Filter by Type"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="p-2 border rounded-lg flex-1"
                />
                <button
                    onClick={() => fetchWinners(1)}
                    className="px-4 py-2 bg-[#67358E] text-white rounded-full hover:bg-[#8B5FBF] transition-all"
                >
                    Search
                </button>
            </div>
            <table className="w-full bg-white rounded-lg shadow overflow-hidden">
                <thead className="bg-[#67358E] text-white">
                    <tr>
                        <th className="p-2">ID</th>
                        <th className="p-2">User ID</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {winners.map((winner) => (
                        <tr key={winner.id} className="text-center border-b">
                            <td className="p-2">{winner.id}</td>
                            <td className="p-2">{winner.user_id}</td>
                            <td className="p-2">
                                {new Date(winner.date).toLocaleString()}
                            </td>
                            <td className="p-2">{winner.type}</td>
                            <td className="p-2">${winner.amount}</td>
                            <td className="p-2">
                                <button
                                    onClick={() => handleDelete(winner.id)}
                                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4 flex justify-between">
                <button
                    disabled={page <= 1}
                    onClick={() => fetchWinners(page - 1)}
                    className="px-4 py-2 bg-[#67358E] text-white rounded-full hover:bg-[#8B5FBF] transition-all"
                >
                    Prev
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <button
                    disabled={page >= totalPages}
                    onClick={() => fetchWinners(page + 1)}
                    className="px-4 py-2 bg-[#67358E] text-white rounded-full hover:bg-[#8B5FBF] transition-all"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default WinnerManagementPage;
