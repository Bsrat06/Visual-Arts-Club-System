import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

const Layout = ({ children }) => {
  const dispatch = useDispatch();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (Fixed on Large Screens) */}
      <Sidebar />

      {/* Right Section (Navbar & Content) */}
      <div className="flex flex-col flex-grow">
        {/* ✅ Navbar Stays Fixed at the Top */}
        <Navbar onLogout={() => dispatch(logout())} />

        {/* ✅ Page Content Adjusted to Avoid Overlapping */}
        <main className="flex-grow p-6 pt-24 md:ml-64">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
