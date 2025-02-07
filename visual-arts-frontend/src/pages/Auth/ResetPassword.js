import React, { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const { uid, token } = useParams(); // Get these from the URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      await API.post("auth/password/reset/confirm/", {
        uid,
        token,
        new_password1: newPassword,
        new_password2: confirmPassword,
      });
      setMessage("Password successfully reset! You can now log in.");
    } catch (error) {
      setMessage("Error resetting password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      {message && <p className="text-blue-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm New Password"
          required
          className="border p-2 rounded w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
