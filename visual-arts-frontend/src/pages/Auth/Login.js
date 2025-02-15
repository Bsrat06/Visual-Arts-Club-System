import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ Hook for redirection

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
      alert("Login failed. Check credentials.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      
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
            {...register("password", { required: "Password is required" })}
            className="w-full p-2 border rounded-md"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
