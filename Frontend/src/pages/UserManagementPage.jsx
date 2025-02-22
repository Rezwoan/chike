import React, { useEffect, useState } from "react";

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [nameFilter, setNameFilter] = useState("");
    const [emailFilter, setEmailFilter] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [editUser, setEditUser] = useState(null);

    const fetchUsers = async (pageNumber = 1) => {
        setError("");
        try {
            let url = `http://127.0.0.1:5000/admin/users?page=${pageNumber}&limit=10`;
            if (nameFilter) url += `&name=${encodeURIComponent(nameFilter)}`;
            if (emailFilter) url += `&email=${encodeURIComponent(emailFilter)}`;
            const res = await fetch(url);
            const data = await res.json();
            if (res.ok) {
                setUsers(data.users);
                setPage(data.current_page);
                setTotalPages(data.pages);
            } else {
                setError(data.message || "Failed to fetch users.");
            }
        } catch (err) {
            setError("Error fetching users.");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [nameFilter, emailFilter]);

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?"))
            return;
        try {
            const res = await fetch(
                `http://127.0.0.1:5000/admin/users/${userId}`,
                {
                    method: "DELETE",
                }
            );
            const data = await res.json();
            if (res.ok) {
                fetchUsers(page);
            } else {
                setError(data.message || "Failed to delete user.");
            }
        } catch (err) {
            setError("Error deleting user.");
        }
    };

    const handleEdit = (user) => {
        setEditUser(user);
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(
                `http://127.0.0.1:5000/admin/users/${editUser.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: editUser.name,
                        email: editUser.email,
                        profile_picture: editUser.profile_picture,
                        total_points: editUser.total_points,
                    }),
                }
            );
            const data = await res.json();
            if (res.ok) {
                setShowEditModal(false);
                fetchUsers(page);
            } else {
                setError(data.message || "Failed to update user.");
            }
        } catch (err) {
            setError("Error updating user.");
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-[#67358E] mb-6">
                User Management
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Filter by name"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    className="p-2 border rounded-lg flex-1"
                />
                <input
                    type="text"
                    placeholder="Filter by email"
                    value={emailFilter}
                    onChange={(e) => setEmailFilter(e.target.value)}
                    className="p-2 border rounded-lg flex-1"
                />
                <button
                    onClick={() => fetchUsers(1)}
                    className="px-4 py-2 bg-[#67358E] text-white rounded-full hover:bg-[#8B5FBF] transition-all"
                >
                    Search
                </button>
            </div>
            <table className="w-full bg-white rounded-lg shadow overflow-hidden">
                <thead className="bg-[#67358E] text-white">
                    <tr>
                        <th className="p-2">ID</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Total Earned</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="text-center border-b">
                            <td className="p-2">{user.id}</td>
                            <td className="p-2">{user.name}</td>
                            <td className="p-2">{user.email}</td>
                            <td className="p-2">${user.total_earned}</td>
                            <td className="p-2 space-x-2">
                                <button
                                    onClick={() => handleEdit(user)}
                                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(user.id)}
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
                    onClick={() => fetchUsers(page - 1)}
                    className="px-4 py-2 bg-[#67358E] text-white rounded-full hover:bg-[#8B5FBF] transition-all"
                >
                    Prev
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <button
                    disabled={page >= totalPages}
                    onClick={() => fetchUsers(page + 1)}
                    className="px-4 py-2 bg-[#67358E] text-white rounded-full hover:bg-[#8B5FBF] transition-all"
                >
                    Next
                </button>
            </div>

            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
                        <h2 className="text-xl font-bold text-[#67358E] mb-4">
                            Edit User
                        </h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label className="block text-[#67358E] font-bold mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={editUser.name}
                                    onChange={(e) =>
                                        setEditUser({
                                            ...editUser,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full p-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-[#67358E] font-bold mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={editUser.email}
                                    onChange={(e) =>
                                        setEditUser({
                                            ...editUser,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full p-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-[#67358E] font-bold mb-2">
                                    Profile Picture URL
                                </label>
                                <input
                                    type="text"
                                    value={editUser.profile_picture}
                                    onChange={(e) =>
                                        setEditUser({
                                            ...editUser,
                                            profile_picture: e.target.value,
                                        })
                                    }
                                    className="w-full p-2 border rounded-lg"
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

export default UserManagementPage;
