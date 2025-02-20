import React, { useState } from "react";
import { Tabs, Card, Switch, Input, Button, message, Radio } from "antd";
import { UserOutlined, BellOutlined, LockOutlined, SkinOutlined } from "@ant-design/icons";
import NotificationPreferences from "./NotificationPreferences";
import UserProfile from "../Auth/UserProfile";


const { TabPane } = Tabs;

/** ✅ Mocked User Profile Data **/
const mockUser = {
    first_name: "John",
    last_name: "Doe",
    email: "johndoe@example.com",
    profile_picture: "/default-avatar.png",
};

const Settings = () => {
    const [profile, setProfile] = useState(mockUser);
    const [darkMode, setDarkMode] = useState(false);
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState("light");

    /** ✅ Handle Profile Updates **/
    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    /** ✅ Handle Theme Mode Toggle **/
    const toggleDarkMode = (checked) => {
        setDarkMode(checked);
        message.success(`Dark Mode ${checked ? "Enabled" : "Disabled"}`);
    };

    /** ✅ Handle Two-Factor Authentication Toggle **/
    const toggleTwoFactorAuth = (checked) => {
        setTwoFactorAuth(checked);
        message.success(`Two-Factor Authentication ${checked ? "Enabled" : "Disabled"}`);
    };

    /** ✅ Handle Theme Selection **/
    const handleThemeChange = (e) => {
        setSelectedTheme(e.target.value);
        message.success(`Theme set to ${e.target.value === "light" ? "Light" : "Dark"} Mode`);
    };

    return (
        <div className="p-6 font-[Poppins]">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>

            {/* ✅ Tabs for Profile & Preferences */}
            <Tabs defaultActiveKey="1" className="custom-tabs">
                {/* ✅ Profile Settings Tab */}
                <TabPane tab="Profile" key="1">
                <UserProfile/>
                </TabPane>

                {/* ✅ Preferences Tab */}
                <TabPane tab="Preferences" key="2">
                    <Card className="max-w-3xl mx-auto shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                        <NotificationPreferences />
                    </Card>
                </TabPane>

                {/* ✅ Additional Settings Tab */}
                <TabPane tab="Additional Settings" key="3">
                    <Card className="max-w-3xl mx-auto shadow-lg">
                        {/* ✅ Dark Mode Toggle */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-lg flex items-center">
                                <SkinOutlined className="mr-2" /> Dark Mode
                            </span>
                            <Switch
                                checked={darkMode}
                                onChange={toggleDarkMode}
                                className="custom-switch"
                            />
                        </div>

                        {/* ✅ Theme Selection */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Theme Selection</h3>
                            <Radio.Group onChange={handleThemeChange} value={selectedTheme}>
                                <Radio value="light" className="custom-radio">
                                    Light Mode
                                </Radio>
                                <Radio value="dark" className="custom-radio">
                                    Dark Mode
                                </Radio>
                            </Radio.Group>
                        </div>

                        {/* ✅ Two-Factor Authentication */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-lg flex items-center">
                                <LockOutlined className="mr-2" /> Two-Factor Authentication
                            </span>
                            <Switch
                                checked={twoFactorAuth}
                                onChange={toggleTwoFactorAuth}
                                className="custom-switch"
                            />
                        </div>

                        {/* ✅ Manage Account Security */}
                        <Button danger icon={<LockOutlined />} className="orange-btn">
                            Reset Password
                        </Button>
                    </Card>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default Settings;
