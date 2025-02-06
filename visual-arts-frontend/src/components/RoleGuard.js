import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleGuard = ({ allowedRoles, children }) => {
  const role = useSelector((state) => state.auth.role); // Get the role from Redux
  
  console.log("User Role in RoleGuard:", role); // Debug log

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default RoleGuard;
