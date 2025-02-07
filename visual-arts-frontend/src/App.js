import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "./components/Layout";
import HomePage from "./pages/General/HomePage";
import AboutUs from "./pages/General/AboutUs";
import ContactUs from "./pages/General/ContactUs";
import Login from "./pages/General/Login";
import Register from "./pages/General/Register";
import NotificationsList from "./pages/General/NotificationsList";
import RoleGuard from "./components/RoleGuard";
import AdminDashboard from "./pages/Admin/Dashboard";
import MemberDashboard from "./pages/Member/MemberDashboard";
import VisitorHome from "./pages/Visitor/VisitorHome";
import Unauthorized from "./pages/Other/Unauthorized";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";



const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes (Accessible by Anyone) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/notifications" element={<NotificationsList />} />

          {/* Visitor-Only Route */}
          <Route path="/visitor" element={<VisitorHome />} />

          {/* Role-Restricted Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <RoleGuard allowedRoles={["admin"]}>
                <AdminDashboard />
              </RoleGuard>
            }
          />

          <Route
            path="/member/dashboard"
            element={
              <RoleGuard allowedRoles={["member", "admin"]}>
                <MemberDashboard />
              </RoleGuard>
            }
          />

          <Route>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
          </Route>


          {/* Unauthorized Page */}
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
