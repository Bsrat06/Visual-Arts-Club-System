import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const { Header, Content, Footer } = Layout;

const AppLayout = ({ children }) => {
    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Layout style={{ minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <Layout
                className="site-layout"
                style={{
                    transition: "margin-left 0.3s ease",
                    backgroundColor: "#FFFFFF",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                    marginLeft: isMobile ? 70 : collapsed ? 80 : 300,
                    
                }}
            >
                <Header
                    style={{
                        padding: 0,
                        background: "#fff",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)",
                        transition: "left 0.3s ease",
                        left: isMobile ? 0 : collapsed ? 80 : 300,
                        width: isMobile ? "100%" : `calc(100% - ${collapsed ? 80 : 300}px)`,
                    }}
                >
                    <Navbar onLogout={() => dispatch(logout())} collapsed={collapsed} setCollapsed={setCollapsed} />
                </Header>

                <Content style={{ margin: "0px", padding: 24, background: "#fff", borderRadius: "10px", boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)", flex: 1 }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default AppLayout;
