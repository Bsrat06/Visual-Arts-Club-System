import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  updateUserRole,
  deactivateUser,
} from "../../redux/slices/userSlice";
import Table from "../../components/Shared/Table";
import Pagination from "../../components/Shared/Pagination";

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRoleChange = (id, role) => {
    dispatch(updateUserRole({ id, role }));
  };

  const handleDeactivateUser = (id) => {
    dispatch(deactivateUser(id));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <Table>
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{`${user.first_name} ${user.last_name}`}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                  <option value="visitor">Visitor</option>
                </select>
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDeactivateUser(user.pk)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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
