import React from "react";
import { useSelector } from "react-redux";
import AdminSidebar from "./AdminSidebar";
import MemberSidebar from "./MemberSidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const user = useSelector((state) => state.auth?.user || {});
  
  
  
  const role = useSelector((state) => state.auth.role); // Get the role from Redux
    
    
  
  
  
  
  console.log("Layout::User Role is: ", role);
  console.log("Local Storage User: ", JSON.parse(localStorage.getItem("user")));

  return (
    <div className="flex min-h-screen">
      {/* Sidebar: Show AdminSidebar for Admins & MemberSidebar for Members */}
      {role === "admin" ? <AdminSidebar /> : <MemberSidebar />}

      {/* Right Section (Navbar & Content) */}
      <div className="flex flex-col flex-grow">
        {/* ✅ Navbar Stays Fixed at the Top */}
        <Navbar />

        {/* ✅ Adjusted Content to Avoid Sidebar Overlapping */}
        <main className="flex-grow p-6 md:ml-64">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
