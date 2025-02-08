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
import Portfolio from "./pages/Member/Portfolio";
import EventRegistration from "./pages/Member/EventRegistration";
import VisitorHome from "./pages/Visitor/VisitorHome";
import Unauthorized from "./pages/Other/Unauthorized";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import UserProfile from "./pages/Auth/UserProfile";
import ArtworkApprovals from "./pages/Admin/ArtworkApprovals"; // Added new route
import ManageArtworks from "./pages/Admin/ManageArtworks";
import ManageEvents from "./pages/Admin/ManageEvents";
import ManageProjects from "./pages/Admin/ManageProjects";
import UserManagement from "./pages/Admin/UserManagement";
import NotificationManagement from "./pages/Admin/NotificationManagement";


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
          
          {/* New Route: Admin Artwork Approvals */}
          <Route
            path="/admin/artwork-approvals"
            element={
              <RoleGuard allowedRoles={["admin"]}>
                <ArtworkApprovals />
              </RoleGuard>
            }
          />

          <Route
            path="/admin/manage-artworks"
            element={
              <RoleGuard allowedRoles={["admin"]}>
                <ManageArtworks />
              </RoleGuard>
            }
          />



          <Route
            path="/admin/manage-events"
            element={
              <RoleGuard allowedRoles={["admin"]}>
                <ManageEvents />
              </RoleGuard>
            }
          />





          <Route
            path="/admin/project-management"
            element={
              <RoleGuard allowedRoles={["admin"]}>
                <ManageProjects />
              </RoleGuard>
            }
          />



          <Route
            path="/admin/notifications"
            element={
              <RoleGuard allowedRoles={["admin"]}>
                <NotificationManagement />
              </RoleGuard>
            }
          />



          <Route
            path="/admin/user-management"
            element={
              <RoleGuard allowedRoles={["admin"]}>
                <UserManagement />
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

          <Route
            path="/member/portfolio"
            element={
              <RoleGuard allowedRoles={["member", "admin"]}>
                <Portfolio />
              </RoleGuard>
            }
          />

          <Route
            path="/member/event-registration"
            element={
              <RoleGuard allowedRoles={["member", "admin"]}>
                <EventRegistration />
              </RoleGuard>
            }
          />

<Route
            path="/homepage"
            element={
              <RoleGuard allowedRoles={["member", "admin", "visitor"]}>
                <HomePage />
              </RoleGuard>
            }
          />


<Route
            path="/contactus"
            element={
              <RoleGuard allowedRoles={["member", "admin", "visitor"]}>
                <ContactUs />
              </RoleGuard>
            }
          />


<Route
            path="/about"
            element={
              <RoleGuard allowedRoles={["member", "admin", "visitor"]}>
                <AboutUs />
              </RoleGuard>
            }
          />


          <Route>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
          </Route>

          {/* Profile Page */}
          <Route>
            <Route path="/profile" element={<UserProfile />} />
          </Route>

          {/* Unauthorized Page */}
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
