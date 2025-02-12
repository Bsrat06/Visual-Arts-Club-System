import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, updateUserRole, activateUser, deactivateUser } from "../../redux/slices/userSlice";

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Users</h1>
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
          {users.map((user) => (
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
