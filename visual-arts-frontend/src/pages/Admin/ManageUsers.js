import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deactivateUser, updateUserRole } from "../../redux/slices/userSlice";
import Table from "../../components/Shared/Table";
import Pagination from "../../components/Shared/Pagination";
import { FaUserSlash, FaEye } from "react-icons/fa";
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
    navigate(`/admin/user/${pk}`);
  };

  // Define the headers for the table
  const headers = ["Avatar", "Name", "Email", "Role", "Status", "Actions"];

  // Prepare the data for the table
  const tableData = users.map((user) => [
    <img
      src={user.avatar || "/default-avatar.png"}
      alt="Avatar"
      className="w-10 h-10 rounded-full mx-auto"
    />,
    `${user.first_name} ${user.last_name}`,
    user.email,
    <select
      value={user.role}
      onChange={(e) => handleRoleChange(user.pk, e.target.value)}
      className="border rounded px-2 py-1"
    >
      <option value="admin">Admin</option>
      <option value="member">Member</option>
      <option value="visitor">Visitor</option>
    </select>,
    <span
      className={`px-3 py-1 rounded-full text-white text-sm ${user.is_active ? "bg-green-500" : "bg-red-500"}`}
    >
      {user.is_active ? "Active" : "Inactive"}
    </span>,
    <div className="flex justify-center space-x-3">
      <button
        onClick={() => handleViewProfile(user.pk)}
        className="text-blue-500 hover:text-blue-700"
      >
        <FaEye size={18} />
      </button>
      <button
        onClick={() => handleDeactivateUser(user.pk)}
        className="text-red-500 hover:text-red-700"
      >
        <FaUserSlash size={18} />
      </button>
    </div>,
  ]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <Table headers={headers} data={tableData} />
      
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
