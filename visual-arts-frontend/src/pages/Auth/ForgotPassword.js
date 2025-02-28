import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { message, Input, Button, Card, Typography } from "antd";
import API from "../../services/api";

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await API.post("auth/password/reset/", data);
      message.success("Password reset link sent! Check your email.");
    } catch (error) {
      message.error(error.response?.data?.error || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-lg">
        <Title level={2} className="text-center mb-4">Forgot Password</Title>
        <Text className="block text-center mb-4 text-gray-600">
          Enter your email, and we’ll send you a link to reset your password.
        </Text>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
            className="py-2 px-3 w-full"
          />
          {errors.email && <Text type="danger">{errors.email.message}</Text>}
          
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            className="mt-2"
          >
            Send Reset Link
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
