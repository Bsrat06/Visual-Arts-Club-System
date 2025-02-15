import React from "react";
import { useForm } from "react-hook-form";
import FormInput from "../../components/Shared/FormInput";
import API from "../../services/api";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await API.post("auth/login/", data);
      dispatch(loginUser(response.data));
      alert("Login successful!");
    } catch (error) {
      alert("Login failed: " + error.response?.data?.error || "Unknown error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label="Email"
          type="email"
          {...register("email", { required: "Email is required" })}
          error={errors.email?.message}
        />
        <FormInput
          label="Password"
          type="password"
          {...register("password", { required: "Password is required" })}
          error={errors.password?.message}
        />
        <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
