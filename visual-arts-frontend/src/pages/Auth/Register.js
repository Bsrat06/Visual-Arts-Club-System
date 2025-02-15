import React from "react";
import { useForm } from "react-hook-form";
import API from "../../services/api";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ shouldUnregister: false });

  const onSubmit = async (data) => {
    try {
      await API.post("auth/registration/", data);
      alert("Registration successful! Please check your email.");
    } catch (error) {
      alert("Registration failed!");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      
        {/* Username */}
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            {...register("username", { required: "Username is required" })}
            className="w-full p-2 border rounded-md"
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full p-2 border rounded-md"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            {...register("password1", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            })}
            className="w-full p-2 border rounded-md"
          />
          {errors.password1 && <p className="text-red-500 text-sm">{errors.password1.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            {...register("password2", {
              validate: (value) => value === watch("password1") || "Passwords do not match",
            })}
            className="w-full p-2 border rounded-md"
          />
          {errors.password2 && <p className="text-red-500 text-sm">{errors.password2.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
