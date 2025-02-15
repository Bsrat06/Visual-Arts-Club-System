import React from "react";

const InputField = ({ label, type, name, register, error, placeholder }) => {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input
        type={type}
        {...register(name)}
        placeholder={placeholder}
        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
      />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
};

export default InputField;
