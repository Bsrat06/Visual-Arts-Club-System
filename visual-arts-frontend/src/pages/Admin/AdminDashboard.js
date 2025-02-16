import React, { useEffect } from "react";
import Card from "../../components/Shared/Card";
import AdminSidebar from "../../components/Layout/AdminSidebar";
import Tabs from "../../components/Shared/Tab";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtworks } from "../../redux/slices/artworkSlice";
import { fetchUsers } from "../../redux/slices/userSlice";
import AnalyticsDashboard from "./AnalyticsDashboard";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const { artworks } = useSelector((state) => state.artwork);
  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchArtworks());
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="flex">
      <div className="flex-grow p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Tabs */}
        <Tabs tabs={["Overview", "Analytics"]}>
          {/* Tab 1: Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card title="Total Artworks" value={artworks.length} bgColor="bg-blue-100" />
            <Card title="Total Users" value={users.length} bgColor="bg-green-100" />
            <Card
              title="Pending Artworks"
              value={artworks.filter((a) => a.approval_status === "pending").length}
              bgColor="bg-yellow-100"
            />
            <Card
              title="Rejected Artworks"
              value={artworks.filter((a) => a.approval_status === "rejected").length}
              bgColor="bg-red-100"
            />
          </div>

          {/* Tab 2: Analytics */}
          <AnalyticsDashboard />
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
