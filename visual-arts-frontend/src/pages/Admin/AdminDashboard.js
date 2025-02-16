import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtworks } from "../../redux/slices/artworkSlice";
import { fetchUsers } from "../../redux/slices/userSlice";
import { Card, Tabs } from "antd";
import AnalyticsDashboard from "./AnalyticsDashboard";

const { TabPane } = Tabs;

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const { artworks } = useSelector((state) => state.artwork);
  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchArtworks());
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="p-6"> {/* ✅ Remove <AppLayout> to prevent duplication */}
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card title="Total Artworks">{artworks.length}</Card>
        <Card title="Total Users">{users.length}</Card>
        <Card title="Pending Artworks">{artworks.filter((a) => a.approval_status === "pending").length}</Card>
        <Card title="Rejected Artworks">{artworks.filter((a) => a.approval_status === "rejected").length}</Card>
      </div>

      {/* Tabs for Overview & Analytics */}
      <Tabs defaultActiveKey="1">
        <TabPane tab="Overview" key="1">
          <p>Overview content goes here...</p>
        </TabPane>
        <TabPane tab="Analytics" key="2">
          <AnalyticsDashboard />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
