import React, { useState } from "react";
import { Layout, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { logout } from "../../redux/slices/authSlice";

const { Header, Content, Footer } = Layout;

const AppLayout = ({ children }) => {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Right Section */}
      <Layout
        className="site-layout"
        style={{
          transition: "margin-left 0.3s ease",
          backgroundColor: "#FFFFFF", // Full White Background
          minHeight: "100vh", // Ensures full height
        }}
      >
        {/* Navbar */}
        <Header
          style={{
            padding: 0,
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)", // Subtle shadow for depth
          }}
        >
          
          <Navbar onLogout={() => dispatch(logout())} collapsed={collapsed} setCollapsed={setCollapsed} />
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: "0px",
            padding: 24,
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)", // Soft shadow for depth
            minHeight: "calc(100vh - 130px)", // Dynamic height adjustment
            overflow: "hidden", // Prevent unwanted scrolling
          }}
        >
          {children}
        </Content>

        {/* Footer */}
        <Footer
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: "#6B7280",
            padding: "16px 24px",
            backgroundColor: "#fff",
            borderTop: "1px solid #E5E7EB", // Subtle divider for footer
          }}
        >
          © {new Date().getFullYear()} My Club Management System
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
