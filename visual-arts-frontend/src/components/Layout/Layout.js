

// AppLayout.js
import React, { useState } from "react";
import { Layout } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const { Header, Content, Footer } = Layout;

const AppLayout = ({ children }) => {
    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{ minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>
            {/* Sidebar (Fixed) */}
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* Right Section (Main Layout - Flexbox with padding) */}
            <Layout
                className="site-layout"
                style={{
                    transition: "margin-left 0.3s ease",
                    backgroundColor: "#FFFFFF",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                    paddingLeft: collapsed ? 80 : 300, // Add left padding for content
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
                        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)",
                    }}
                >
                    <Navbar onLogout={() => dispatch(logout())} collapsed={collapsed} setCollapsed={setCollapsed} />
                </Header>

                {/* Content (Expandable with flex) */}
                <Content
                    style={{
                        margin: "0px",
                        padding: 24,
                        background: "#fff",
                        borderRadius: "10px",
                        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)",
                        flex: 1,
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
                        borderTop: "1px solid #E5E7EB",
                    }}
                >
                    © {new Date().getFullYear()} My Club Management System
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AppLayout;