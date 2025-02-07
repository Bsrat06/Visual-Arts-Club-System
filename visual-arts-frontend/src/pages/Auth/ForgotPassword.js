import React, { useState } from "react";
import API from "../../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("auth/password/reset/", { email });
      setMessage("Password reset email sent! Please check your inbox.");
    } catch (error) {
      setMessage("Error sending reset email. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
      {message && <p className="text-blue-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="border p-2 rounded w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">
          Send Reset Email
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
