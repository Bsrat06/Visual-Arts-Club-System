import React, { useState } from "react";
import { Layout } from "antd";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { logout } from "../../redux/slices/authSlice";

const { Content, Footer } = Layout;

const AppLayout = ({ children }) => {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Right Section */}
      <Layout
        className="site-layout"
        style={{
          marginLeft: collapsed ? 80 : 200, // ✅ Adjust content width based on sidebar collapse
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Navbar */}
        <Navbar onLogout={() => dispatch(logout())} collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Content */}
        <Content
          style={{
            margin: "80px 16px 16px",
            padding: 24,
            background: "#fff",
            minHeight: "85vh",
          }}
        >
          {children}
        </Content>

        {/* Footer */}
        <Footer style={{ textAlign: "center" }}>
          © {new Date().getFullYear()} My Club Management System
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
