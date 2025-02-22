import React, { useEffect, useState } from "react";

const ReferralManagementPage = () => {
    const [referrals, setReferrals] = useState([]);
    const [referrerId, setReferrerId] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [editReferral, setEditReferral] = useState(null);

    const fetchReferrals = async (pageNumber = 1) => {
        setError("");
        try {
            let url = `http://127.0.0.1:5000/admin/referrals?page=${pageNumber}&limit=10`;
            if (referrerId) url += `&referrer_id=${referrerId}`;
            if (dateFrom) url += `&date_from=${dateFrom}`;
            if (dateTo) url += `&date_to=${dateTo}`;
            const res = await fetch(url);
            const data = await res.json();
            if (res.ok) {
                setReferrals(data.referrals);
                setPage(data.current_page);
                setTotalPages(data.pages);
            } else {
                setError(data.message || "Failed to fetch referrals.");
            }
        } catch (err) {
            setError("Error fetching referrals.");
        }
    };

    useEffect(() => {
        fetchReferrals();
    }, [referrerId, dateFrom, dateTo]);

    const handleDelete = async (referralId) => {
        if (!window.confirm("Are you sure you want to delete this referral?"))
            return;
        try {
            const res = await fetch(
                `http://127.0.0.1:5000/admin/referrals/${referralId}`,
                {
                    method: "DELETE",
                }
            );
            const data = await res.json();
            if (res.ok) {
                fetchReferrals(page);
            } else {
                setError(data.message || "Failed to delete referral.");
            }
        } catch (err) {
            setError("Error deleting referral.");
        }
    };

    const handleEdit = (referral) => {
        setEditReferral(referral);
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(
                `http://127.0.0.1:5000/admin/referrals/${editReferral.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        referred_email: editReferral.referred_email,
                    }),
                }
            );
            const data = await res.json();
            if (res.ok) {
                setShowEditModal(false);
                fetchReferrals(page);
            } else {
                setError(data.message || "Failed to update referral.");
            }
        } catch (err) {
            setError("Error updating referral.");
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-[#67358E] mb-6">
                Referral Management
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
                <input
                    type="number"
                    placeholder="Referrer ID"
                    value={referrerId}
                    onChange={(e) => setReferrerId(e.target.value)}
                    className="p-2 border rounded-lg flex-1"
                />
                <input
                    type="date"
                    placeholder="Date From"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="p-2 border rounded-lg flex-1"
                />
                <input
                    type="date"
                    placeholder="Date To"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="p-2 border rounded-lg flex-1"
                />
                <button
                    onClick={() => fetchReferrals(1)}
                    className="px-4 py-2 bg-[#67358E] text-white rounded-full hover:bg-[#8B5FBF] transition-all"
                >
                    Search
                </button>
            </div>
            <table className="w-full bg-white rounded-lg shadow overflow-hidden">
                <thead className="bg-[#67358E] text-white">
                    <tr>
                        <th className="p-2">ID</th>
                        <th className="p-2">Referrer ID</th>
                        <th className="p-2">Referred Email</th>
                        <th className="p-2">Created At</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {referrals.map((referral) => (
                        <tr key={referral.id} className="text-center border-b">
                            <td className="p-2">{referral.id}</td>
                            <td className="p-2">{referral.referrer_id}</td>
                            <td className="p-2">{referral.referred_email}</td>
                            <td className="p-2">
                                {new Date(referral.created_at).toLocaleString()}
                            </td>
                            <td className="p-2 space-x-2">
                                <button
                                    onClick={() => handleEdit(referral)}
                                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(referral.id)}
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
                    onClick={() => fetchReferrals(page - 1)}
                    className="px-4 py-2 bg-[#67358E] text-white rounded-full hover:bg-[#8B5FBF] transition-all"
                >
                    Prev
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <button
                    disabled={page >= totalPages}
                    onClick={() => fetchReferrals(page + 1)}
                    className="px-4 py-2 bg-[#67358E] text-white rounded-full hover:bg-[#8B5FBF] transition-all"
                >
                    Next
                </button>
            </div>

            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
                        <h2 className="text-xl font-bold text-[#67358E] mb-4">
                            Edit Referral
                        </h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label className="block text-[#67358E] font-bold mb-2">
                                    Referred Email
                                </label>
                                <input
                                    type="email"
                                    value={editReferral.referred_email}
                                    onChange={(e) =>
                                        setEditReferral({
                                            ...editReferral,
                                            referred_email: e.target.value,
                                        })
                                    }
                                    className="w-full p-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 mr-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#67358E] text-white rounded hover:bg-[#8B5FBF] transition-all"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReferralManagementPage;
