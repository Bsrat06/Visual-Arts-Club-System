import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchUsers,
    deactivateUser,
    activateUser,
    updateUserRole,
} from "../../redux/slices/userSlice";
import {
    Input,
    Select,
    Button,
    Space,
    Avatar,
    Tag,
    message,
    Card,
    Spin,
} from "antd";
import {
    FaUsers,
    FaUserCheck,
    FaUser,
    FaEye,
    FaUserSlash,
    FaUserPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Table from "../../components/Shared/Table";
import "../../styles/custom-ant.css";

const { Option } = Select;

const ManageUsers = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector((state) => state.users);
    const navigate = useNavigate();
    const [filteredInfo, setFilteredInfo] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        dispatch(fetchUsers());
        setTimeout(() => setStatsLoading(false), 1000);
    }, [dispatch]);

    const handleRoleChange = (id, role) => {
        dispatch(updateUserRole({ id, role }));
        message.success(`User role updated to ${role}`);
    };

    const handleDeactivateUser = (id) => {
        dispatch(deactivateUser(id));
        message.success("User has been deactivated");
    };

    const handleActivateUser = (id) => {
        dispatch(activateUser(id));
        message.success("User has been activated");
    };

    const handleViewProfile = (pk) => {
        navigate(`/admin/user/${pk}`);
    };

    const totalUsers = users.length;
    const totalMembers = users.filter((user) => user.role === "member").length;
    const totalActiveUsers = users.filter((user) => user.is_active).length;

    const statistics = [
        {
            title: "Total Users",
            value: totalUsers,
            icon: <FaUsers className="text-[#FFA500] text-4xl" />,
        },
        {
            title: "Total Members",
            value: totalMembers,
            icon: <FaUser className="text-[#FFA500] text-4xl" />,
        },
        {
            title: "Active Users",
            value: totalActiveUsers,
            icon: <FaUserCheck className="text-[#FFA500] text-4xl" />,
        },
    ];

    const handleChange = (pagination, filters) => {
        setFilteredInfo(filters);
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text, record) => (
                <Space>
                    <Avatar src={record.avatar || "/default-avatar.png"} alt="User Avatar" />
                    {text}
                </Space>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            filters: [
                { text: "Admin", value: "admin" },
                { text: "Member", value: "member" },
                { text: "Visitor", value: "visitor" },
            ],
            filteredValue: filteredInfo.role || null,
            onFilter: (value, record) => record.role === value,
            render: (role, record) => (
                <Select value={role} onChange={(newRole) => handleRoleChange(record.pk, newRole)}>
                    <Option value="admin">Admin</Option>
                    <Option value="member">Member</Option>
                    <Option value="visitor">Visitor</Option>
                </Select>
            ),
        },
        {
            title: "Status",
            dataIndex: "is_active",
            key: "is_active",
            filters: [
                { text: "Active", value: true },
                { text: "Inactive", value: false },
            ],
            filteredValue: filteredInfo.is_active || null,
            onFilter: (value, record) => record.is_active === value,
            render: (is_active) => (
                <Tag color={is_active ? "green" : "red"}>{is_active ? "Active" : "Inactive"}</Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button className="custom-view-btn" icon={<FaEye />} onClick={() => handleViewProfile(record.pk)}>
                        View
                    </Button>
                    {record.is_active ? (
                        <Button icon={<FaUserSlash />} danger onClick={() => handleDeactivateUser(record.pk)}>
                            Deactivate
                        </Button>
                    ) : (
                        <Button className="custom-activate-btn" icon={<FaUserPlus />} ghost type="primary" onClick={() => handleActivateUser(record.pk)}>
                            Activate
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    const filteredUsers = users.filter(
        (user) =>
            (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const tableData = filteredUsers.map((user) => ({
        key: user.pk,
        avatar: user.profile_picture,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        pk: user.pk,
    }));

    return (
        <div className="p-6 space-y-8">
            <h2 className="text-black text-[22px] font-semibold font-[Poppins]">Manage Users</h2>
            <p className="text-green-500 text-sm font-[Poppins] mt-1">User Management &gt; View & Manage</p>

            {/* ✅ Enhanced Statistics Container */}
            <div className="bg-white rounded-2xl shadow-[0px_10px_60px_0px_rgba(226,236,249,0.5)] p-8 flex items-center justify-between mb-6">
                {statsLoading ? (
                    <Spin size="large" />
                ) : (
                    statistics.map((stat, index) => (
                        <div key={index} className="flex items-start space-x-6">
                            {/* Background Circle Icon */}
                            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#FFA5001F]">
                                {stat.icon}
                            </div>

                            {/* Value & Title */}
                            <div className="text-left">
                                <p className="text-[#ACACAC] text-[14px] font-[Poppins]">{stat.title}</p>
                                <p className="text-[#333333] text-[34px] font-semibold font-[Poppins]">{stat.value}</p>
                            </div>

                            {/* Separator (except for last item) */}
                            {index < statistics.length - 1 && (
                                <div className="flex items-start space-x-6 h-20 w-[1px] bg-[#F1F1F1] mx-10"></div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* ✅ Enhanced Users List */}
            <div className="bg-white shadow-md rounded-2xl p-6">
                <h2 className="text-black text-[22px] font-semibold font-[Poppins]">All Users</h2>

                <div className="flex flex-col md:flex-row md:justify-between items-center pb-4">
                    <Input placeholder="Search by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-40" />
                    <Select placeholder="Filter by role" onChange={(value) => setFilteredInfo({ role: [value] })} className="w-40" allowClear>
                        <Option value="admin">Admin</Option>
                        <Option value="member">Member</Option>
                        <Option value="visitor">Visitor</Option>
                    </Select>
                </div>

                <Table columns={columns} dataSource={tableData} onChange={handleChange} pagination={{ pageSize: 8 }} loading={loading} rowKey="key" />
            </div>
        </div>
    );
};

export default ManageUsers;
