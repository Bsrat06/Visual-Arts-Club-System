import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, updateUserRole, activateUser, deactivateUser } from "../../redux/slices/userSlice";
import { Link } from "react-router-dom";


const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRoleChange = (id, role) => {
    dispatch(updateUserRole({ id, role }));
  };

  const handleActivate = (id) => {
    dispatch(activateUser(id));
  };

  const handleDeactivate = (id) => {
    dispatch(deactivateUser(id));
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && user.is_active) ||
      (filterStatus === "inactive" && !user.is_active);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Users</h1>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name, email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-1/2"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* User Table */}
      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.pk}>
              <td className="border p-2">{`${user.first_name} ${user.last_name}`}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.pk, e.target.value)}
                  className="border p-1"
                >
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                  <option value="visitor">Visitor</option>
                </select>
              </td>
              <td className="border p-2">{user.is_active ? "Active" : "Inactive"}</td>
              <td className="border p-2">
                {user.is_active ? (
                  <button
                    onClick={() => handleDeactivate(user.pk)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => handleActivate(user.pk)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Activate
                  </button>
                )}
                <Link
                  to={`/admin/user/${user.pk}`}
                  className="text-blue-500 underline"
                >
                  View Profile
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
