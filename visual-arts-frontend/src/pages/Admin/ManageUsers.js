import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deactivateUser, updateUserRole } from "../../redux/slices/userSlice";
import Table from "../../components/Shared/Table";
import Pagination from "../../components/Shared/Pagination";
import { FaUserSlash, FaEye } from "react-icons/fa"; // Import icons
import { useNavigate } from "react-router-dom";



const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);


  const handleRoleChange = (id, role) => {
    dispatch(updateUserRole({ id, role }));
  };

  const handleDeactivateUser = (id) => {
    dispatch(deactivateUser(id));
  };

  const handleViewProfile = (pk) => {
    navigate(`/admin/user/${pk}`); // Navigate to /users/pk
  }; 

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <Table />
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Avatar</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center">
              {/* Avatar */}
              <td className="border px-4 py-2">
                <img
                  src={user.avatar || "/default-avatar.png"} // Default avatar if null
                  alt="Avatar"
                  className="w-10 h-10 rounded-full mx-auto"
                />
              </td>

              {/* Name */}
              <td className="border px-4 py-2">
                {user.first_name} {user.last_name}
              </td>

              {/* Email */}
              <td className="border px-4 py-2">{user.email}</td>

              {/* Role */}
              <td className="border px-4 py-2">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.pk, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                  <option value="visitor">Visitor</option>
                </select>
              </td>

              {/* Status */}
              <td className="border px-4 py-2">
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm ${
                    user.is_active ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {user.is_active ? "Active" : "Inactive"}
                </span>
              </td>

              {/* Actions */}
              <td className="border px-4 py-2 flex justify-center space-x-3">
                {/* View Profile */}
                <button onClick={() => handleViewProfile(user.pk)} // Call handleViewProfile
                                className="text-blue-500 hover:text-blue-700"
                            >
                  <FaEye size={18} />
                </button>

                {/* Deactivate User */}
                <button
                  onClick={() => handleDeactivateUser(user.pk)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaUserSlash size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      {/* Pagination */}
      <Pagination
        totalItems={users.length}
        itemsPerPage={10}
        currentPage={1}
        onPageChange={(page) => console.log("Go to page:", page)}
      />
    </div>
  );
};

export default ManageUsers;
