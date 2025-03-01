import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const { Header, Content } = Layout;

const AppLayout = ({ children }) => {
    const [selectedMenu, setSelectedMenu] = useState("Home");
    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState(true); // default to true
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const user = useSelector((state) => state.auth?.user);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Layout style={{ minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>
            {/* Sidebar (only if user is logged in) */}
            {user && <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} onMenuSelect={setSelectedMenu} />}

            <Layout
                className="site-layout"
                style={{
                    transition: "margin-left 0.3s ease",
                    backgroundColor: "#FFFFFF",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                    marginLeft: user && !isMobile ? (collapsed ? 80 : 300) : 0, // Adjust margin for non-mobile screens
                }}
            >
                {/* Navbar at the top */}
                <Header
                    style={{
                        padding: 0,
                        background: "#fff",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)",
                        transition: "left 0.3s ease",
                        left: 0,
                        width: "100%", // Ensure 100% width on mobile
                        zIndex: 98, // Ensure navbar is below the sidebar overlay
                    }}
                >
                    <Navbar selectedMenu={selectedMenu} onLogout={() => dispatch(logout())} collapsed={collapsed} setCollapsed={setCollapsed} />
                </Header>

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
            </Layout>
        </Layout>
    );
};

export default AppLayout;