import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Input, Button, Card, Typography, message } from "antd";
import API from "../../services/api";

const { Title, Text } = Typography;

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { uid, token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      message.warning("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      message.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await API.post("auth/password/reset/confirm/", {
        uid,
        token,
        new_password1: newPassword,
        new_password2: confirmPassword,
      });
      message.success("Password successfully reset! You can now log in.");
    } catch (error) {
      message.error("Error resetting password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-lg">
        <Title level={2} className="text-center mb-4">Reset Password</Title>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input.Password
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="py-2 px-3 w-full"
          />
          <Input.Password
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="py-2 px-3 w-full"
          />
          
          <Button type="primary" htmlType="submit" block loading={loading}>
            Reset Password
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;
