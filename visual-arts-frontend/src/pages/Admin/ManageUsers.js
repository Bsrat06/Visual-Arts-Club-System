import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deactivateUser, updateUserRole } from "../../redux/slices/userSlice";
import { Table, Button, Space, Avatar, Select, Tag, Input, message, Card } from "antd";
import { FaUsers, FaUserCheck, FaUser, FaEye, FaUserSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const ManageUsers = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector((state) => state.users);
    const navigate = useNavigate();
    const [filteredInfo, setFilteredInfo] = useState({});
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleRoleChange = (id, role) => {
        dispatch(updateUserRole({ id, role }));
        message.success(`User role updated to ${role}`);
    };

    const handleDeactivateUser = (id) => {
        dispatch(deactivateUser(id));
        message.success("User has been deactivated");
    };

    const handleViewProfile = (pk) => {
        navigate(`/admin/user/${pk}`);
    };

    const totalUsers = users.length;
    const totalMembers = users.filter((user) => user.role === "member").length;
    const totalActiveUsers = users.filter((user) => user.is_active).length;

    const statistics = [
        { title: "Total Users", value: totalUsers, icon: <FaUsers />, color: "bg-blue-100", textColor: "text-blue-500" },
        { title: "Total Members", value: totalMembers, icon: <FaUser />, color: "bg-green-100", textColor: "text-green-500" },
        { title: "Active Users", value: totalActiveUsers, icon: <FaUserCheck />, color: "bg-orange-100", textColor: "text-orange-500" },
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
                    <Button icon={<FaEye />} onClick={() => handleViewProfile(record.pk)}>
                        View
                    </Button>
                    <Button icon={<FaUserSlash />} danger onClick={() => handleDeactivateUser(record.pk)}>
                        Deactivate
                    </Button>
                </Space>
            ),
        },
    ];

    const filteredUsers = users.filter((user) =>
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
        <div className="p-6">
            <div>
                <h2 className="text-black text-[22px] font-semibold font-[Poppins]">Manage Users</h2>
                <p className="text-gray-500 text-sm font-[Poppins] mt-1">User Management &gt; View & Manage</p>
            </div>
          {/* ✅ User Statistics Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {statistics.map((stat, index) => (
                    <Card key={index} className="shadow-lg p-4 flex flex-col items-center text-center">
                        <div className={`w-16 h-16 flex items-center justify-center rounded-full ${stat.color}`}>
                            <div className={`w-8 h-8 flex items-center justify-center ${stat.textColor}`}>{stat.icon}</div>
                        </div>
                        <p className="text-[#ACACAC] text-[14px] tracking-[-1%] mt-2">{stat.title}</p>
                        <p className="text-[#333333] text-[32px] font-semibold tracking-[-1%]">{stat.value}</p>
                    </Card>
                ))}
            </div>
            <div className="w-full bg-white h-[130px] flex flex-col md:flex-row justify-between items-center px-6 shadow-md rounded-md mb-4">
                

                {/* ✅ Search Bar */}
                <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-60"
                />
            </div>

            

            {/* ✅ User Table */}
            <Table
                columns={columns}
                dataSource={tableData}
                onChange={handleChange}
                pagination={{ pageSize: 8 }}
                loading={loading}
                rowKey="key"
            />
        </div>
    );
};

export default ManageUsers;
