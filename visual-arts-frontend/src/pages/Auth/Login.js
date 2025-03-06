import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom"; // ✅ Navigation Hook
import { Modal } from "antd"; // Import Ant Design Modal
import logo from '../../assets/images/logo.png';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ Redirect Hook

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(loginUser(data)).unwrap();
      alert("Login successful!");

      // ✅ Redirect based on user role
      if (response.role === "admin") {
        navigate("/admin/dashboard"); // Redirect Admins
      } else if (response.role === "member") {
        navigate("/member/dashboard"); // Redirect Members
      } else {
        navigate("/"); // Redirect Visitors or Defaults
      }
    } catch (error) {
      if (error.message === "Your account is pending approval. Please contact an admin.") {
        // Show Ant Design modal for inactive users
        Modal.info({
          title: "Account Inactive",
          content: "Your account is pending approval. Please contact an admin.",
          okText: "OK",
          onOk: () => {
            // Redirect to the home page or any other page
            navigate("/");
          },
        });
      } else {
        alert("Login failed. Check credentials.");
      }
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img className="w-24 h-24" src={logo} alt="Logo" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Sign in to your account
        </h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
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

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <a href="/forgot-password" className="text-sm text-orange-600 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
          >
            {isSubmitting ? "Logging in..." : "Sign In"}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-sm text-center text-gray-600 mt-4">
          Don’t have an account yet?{" "}
          <a href="/register" className="text-orange-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </section>
  );
};

export default Login;