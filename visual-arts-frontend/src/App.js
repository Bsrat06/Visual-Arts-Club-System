import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/General/HomePage";
import AboutUs from "./pages/General/AboutUs";
import ContactUs from "./pages/General/ContactUs";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import NotificationsList from "./pages/General/NotificationsList";
import RoleGuard from "./components/Admin/RoleGuard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import MemberDashboard from "./pages/Member/MemberDashboard";
import NewArtworkForm from "./pages/Member/NewArtworkForm";
import Portfolio from "./pages/Member/Portfolio";
import EventRegistration from "./pages/Member/EventRegistration";
import MemberAnalytics from "./pages/Member/MemberAnalytics";
import ProjectDetails from "./pages/Member/ProjectDetails";
import EventStats from "./pages/Admin/EventStats";
import EventAnalytics from "./pages/Admin/EventAnalytics";
import ProjectAnalytics from "./pages/Admin/ProjectAnalytics";
import DetailedUserProfile from "./pages/Admin/DetailedUserProfile";
import VisitorHome from "./pages/Visitor/VisitorHome";
import Unauthorized from "./pages/Other/Unauthorized";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import UserProfile from "./pages/Auth/UserProfile";
import ProfileActivities from "./pages/Member/ProfileActivities";
import ArtworkApprovals from "./pages/Admin/ArtworkApprovals"; // Added new route
import ManageArtworks from "./pages/Admin/ManageArtworks";
import ManageEvents from "./pages/Admin/ManageEvents";
import ManageProjects from "./pages/Admin/ManageProjects";
import ManageUsers from "./pages/Admin/ManageUsers";
import NotificationManagement from "./pages/Admin/NotificationManagement";
import NotificationPreferences from "./pages/General/NotificationPreferences";
import AddArtworkForm from "./components/Admin/AddArtworkForm";
import VisitorGallery from "./pages/Visitor/VisitorGallery";
import VisitorEvents from "./pages/Visitor/VisitorEvents";
import VisitorProjects from "./pages/Visitor/VisitorProjects";
import VisitorContact from "./pages/Visitor/VisitorContact";
import AnalyticsDashboard from "./pages/Admin/AnalyticsDashboard";
import Settings from "./pages/General/Settings";
// import "./styles/styles.css";
import "./index.css";





const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes (Accessible by Anyone) */}
          <Route path="/" element={<VisitorHome />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/notifications" element={<NotificationsList />} />

          {/* Visitor-Only Route */}
          <Route path="/homepage" element={<VisitorHome />} />

          {/* Role-Restricted Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <RoleGuard allowedRoles={["admin", "manager"]}>
                <AdminDashboard />
              </RoleGuard>
            }
          />
          
          {/* New Route: Admin Artwork Approvals */}
          <Route
            path="/admin/artwork-approvals"
            element={
              <RoleGuard allowedRoles={["admin", "manager"]}>
                <ArtworkApprovals />
              </RoleGuard>
            }
          />

          <Route
            path="/admin/manage-artworks"
            element={
              <RoleGuard allowedRoles={["admin", "manager"]}>
                <ManageArtworks />
              </RoleGuard>
            }
          />



          <Route
            path="/admin/manage-events"
            element={
              <RoleGuard allowedRoles={["admin", "manager"]}>
                <ManageEvents />
              </RoleGuard>
            }
          />





          <Route
            path="/admin/project-management"
            element={
              <RoleGuard allowedRoles={["admin", "manager"]}>
                <ManageProjects />
              </RoleGuard>
            }
          />



          <Route
            path="/admin/notifications"
            element={
              <RoleGuard allowedRoles={["admin", "manager"]}>
                <NotificationManagement />
              </RoleGuard>
            }
          />



          <Route
            path="/admin/user-management"
            element={
              <RoleGuard allowedRoles={["admin", "manager"]}>
                <ManageUsers />
              </RoleGuard>
            }
          />


          
<Route
            path="/admin/analytics"
            element={
              <RoleGuard allowedRoles={["admin", "manager"]}>
                <AnalyticsDashboard />
              </RoleGuard>
            }
          />


          <Route
            path="/admin/event-analytics"
            element={
              <RoleGuard allowedRoles={["admin", "manager"]}>
                <EventAnalytics />
              </RoleGuard>
            }
          />


          <Route
            path="/admin/event-stats"
            element={
              <RoleGuard allowedRoles={["admin", "manager"]}>
                <EventStats />
              </RoleGuard>
            }
          />


          <Route
            path="/admin/project-analytics"
            element={
              <RoleGuard allowedRoles={["admin", "manager"]}>
                <ProjectAnalytics />
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
            path="/member/new-artwork"
            element={
              <RoleGuard allowedRoles={["member", "admin"]}>
                <NewArtworkForm />
              </RoleGuard>
            }
          />

          <Route
            path="/member/portfolio"
            element={
              <RoleGuard allowedRoles={["member", "admin", "visitor"]}>
                <Portfolio />
              </RoleGuard>
            }
          />

          <Route
            path="/member/add-artwork"
            element={
              <RoleGuard allowedRoles={["member", "admin"]}>
                <AddArtworkForm />
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
            path="/member/analytics"
            element={
              <RoleGuard allowedRoles={["member", "admin"]}>
                <MemberAnalytics />
              </RoleGuard>
            }
          />


          <Route
            path="/projects/:projectId"
            element={
              <RoleGuard allowedRoles={["member", "admin"]}>
                <ProjectDetails />
              </RoleGuard>
            }
          />


          <Route
            path="/notification-preferences"
            element={
              <RoleGuard allowedRoles={["member", "admin"]}>
                <NotificationPreferences />
              </RoleGuard>
            }
          />


          
<Route
            path="/settings"
            element={
              <RoleGuard allowedRoles={["member", "admin", "visitor"]}>
                <Settings />
              </RoleGuard>
            }
          />



<Route
            path="/home"
            element={
                <VisitorHome />
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


          <Route
            path="/admin/user/:id"
            element={
              <RoleGuard allowedRoles={["admin"]}>
                <DetailedUserProfile />
              </RoleGuard>
            }
          />


          <Route
            path="/profile-activities"
            element={
              <RoleGuard allowedRoles={["member", "admin"]}>
                <ProfileActivities />
              </RoleGuard>
            }
          />


          <Route path="/visitor/gallery" element={<VisitorGallery />} />
          <Route path="/visitor/events" element={<VisitorEvents />} />
          <Route path="/visitor/projects" element={<VisitorProjects />} />
          <Route path="/visitor/contact" element={<VisitorContact />} />



          {/* Unauthorized Page */}
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
