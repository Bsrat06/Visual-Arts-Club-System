import React from "react";
import { useForm } from "react-hook-form";
import FormInput from "../../components/Shared/FormInput";
import API from "../../services/api";

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await API.post("auth/password/reset/", data);
      alert("Password reset link sent!");
    } catch (error) {
      alert("Error: " + error.response?.data?.error || "Failed to send reset link.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput label="Email" type="email" {...register("email", { required: "Email is required" })} error={errors.email?.message} />
        <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
