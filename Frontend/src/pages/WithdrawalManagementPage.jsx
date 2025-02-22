import React, { useEffect, useState } from "react";

const WithdrawalManagementPage = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [userIdFilter, setUserIdFilter] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState("");
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPaymentInfo, setSelectedPaymentInfo] = useState(null);

    const adminId = localStorage.getItem("adminId");

    const fetchWithdrawals = async (pageNumber = 1) => {
        setError("");
        try {
            let url = `http://127.0.0.1:5000/admin/withdrawals?page=${pageNumber}&limit=10&admin_id=${adminId}`;
            if (statusFilter) url += `&status=${statusFilter}`;
            if (userIdFilter) url += `&user_id=${userIdFilter}`;
            const res = await fetch(url);
            const data = await res.json();
            if (res.ok) {
                setWithdrawals(data.withdrawals);
                setPage(data.current_page);
                setTotalPages(data.pages);
            } else {
                setError(data.message || "Failed to fetch withdrawals.");
            }
        } catch (err) {
            setError("Error fetching withdrawals.");
        }
    };

    useEffect(() => {
        fetchWithdrawals();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, userIdFilter]);

    const handleAction = async (withdrawalId, action) => {
        let endpoint = "";
        if (action === "accept") {
            endpoint = `http://127.0.0.1:5000/admin/withdrawals/${withdrawalId}/accept?admin_id=${adminId}`;
        } else if (action === "complete") {
            endpoint = `http://127.0.0.1:5000/admin/withdrawals/${withdrawalId}/complete?admin_id=${adminId}`;
        } else if (action === "reject") {
            endpoint = `http://127.0.0.1:5000/admin/withdrawals/${withdrawalId}/reject?admin_id=${adminId}`;
        }
        try {
            const res = await fetch(endpoint, { method: "PUT" });
            const data = await res.json();
            if (res.ok) {
                fetchWithdrawals(page);
            } else {
                setError(data.message || "Action failed.");
            }
        } catch (err) {
            setError("Error performing action.");
        }
    };

    const handleViewPayment = (paymentInfo) => {
        setSelectedPaymentInfo(paymentInfo);
        setShowPaymentModal(true);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-[#67358E] mb-6">
                Withdrawal Management
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Filter by Status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="p-2 border rounded-lg"
                />
                <input
                    type="number"
                    placeholder="Filter by User ID"
                    value={userIdFilter}
                    onChange={(e) => setUserIdFilter(e.target.value)}
                    className="p-2 border rounded-lg"
                />
                <button
                    onClick={() => fetchWithdrawals(1)}
                    className="px-4 py-2 bg-[#67358E] text-white rounded-full hover:bg-[#8B5FBF] transition-all"
                >
                    Search
                </button>
            </div>
            <table className="table-auto w-full bg-white rounded-lg shadow overflow-hidden">
                <thead className="bg-[#67358E] text-white">
                    <tr>
                        <th className="p-2">ID</th>
                        <th className="p-2">User ID</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Requested At</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {withdrawals.map((w) => (
                        <tr key={w.id} className="text-center border-b">
                            <td className="p-2">{w.id}</td>
                            <td className="p-2">{w.user_id}</td>
                            <td className="p-2">${w.amount}</td>
                            <td className="p-2">{w.status}</td>
                            <td className="p-2">
                                {new Date(w.created_at).toLocaleString()}
                            </td>
                            <td className="p-2">
                                {/* 
                  Flex container that stacks buttons vertically on small screens
                  and horizontally on larger screens.
                */}
                                <div className="flex flex-col sm:flex-row sm:justify-center gap-2">
                                    {w.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    handleAction(w.id, "accept")
                                                }
                                                className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleAction(w.id, "reject")
                                                }
                                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {w.status === "processing" && (
                                        <button
                                            onClick={() =>
                                                handleAction(w.id, "complete")
                                            }
                                            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Complete
                                        </button>
                                    )}
                                    <button
                                        onClick={() =>
                                            handleViewPayment(
                                                w.user_payment_info
                                            )
                                        }
                                        className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                                    >
                                        View Payment Info
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4 flex justify-between">
                <button
                    disabled={page <= 1}
                    onClick={() => fetchWithdrawals(page - 1)}
                    className="px-4 py-2 bg-[#67358E] text-white rounded-full hover:bg-[#8B5FBF] transition-all"
                >
                    Prev
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <button
                    disabled={page >= totalPages}
                    onClick={() => fetchWithdrawals(page + 1)}
                    className="px-4 py-2 bg-[#67358E] text-white rounded-full hover:bg-[#8B5FBF] transition-all"
                >
                    Next
                </button>
            </div>

            {showPaymentModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
                        <h2 className="text-xl font-bold text-[#67358E] mb-4">
                            Payment Info
                        </h2>
                        {/* 
              Use whitespace-pre-wrap and break-words to ensure the text
              wraps properly within the modal.
            */}
                        <pre className="p-4 bg-gray-100 rounded whitespace-pre-wrap break-words text-sm">
                            {selectedPaymentInfo}
                        </pre>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="px-4 py-2 bg-[#67358E] text-white rounded hover:bg-[#8B5FBF] transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WithdrawalManagementPage;
