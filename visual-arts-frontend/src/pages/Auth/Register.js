import React from "react";
import { useForm } from "react-hook-form";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate(); // ✅ Redirect Hook

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log("Form Data:", data);
      await API.post("auth/registration/", data);
      alert("Registration successful! Please check your email.");
      navigate("/login"); // ✅ Redirect to Login
    } catch (error) {
      alert("Registration failed!");
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img className="w-12 h-12" src="/logo.svg" alt="Logo" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Create an account
        </h2>

        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              {...register("username", { required: "Username is required" })}
              className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
              placeholder="Your username"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
              placeholder="name@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              {...register("password1", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
              placeholder="••••••••"
            />
            {errors.password1 && <p className="text-red-500 text-sm">{errors.password1.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              {...register("password2", {
                validate: (value) => value === watch("password1") || "Passwords do not match",
              })}
              className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
              placeholder="••••••••"
            />
            {errors.password2 && <p className="text-red-500 text-sm">{errors.password2.message}</p>}
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              {...register("terms", { required: "You must accept the Terms & Conditions" })}
              className="w-4 h-4 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              I accept the{" "}
              <a href="#" className="text-orange-600 hover:underline">
                Terms & Conditions
              </a>
            </label>
          </div>
          {errors.terms && <p className="text-red-500 text-sm">{errors.terms.message}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-orange-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </section>
  );
};

export default Register;
