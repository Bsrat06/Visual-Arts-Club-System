import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllUsers,
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
    Image,
    Modal,
    Card,
    Spin,
    Table as AntTable, // Renamed to avoid confusion with custom Table
} from "antd";
import {
    CheckOutlined,
    CloseOutlined,
    EyeOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
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
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statsLoading, setStatsLoading] = useState(true);
    const [pageSize, setPageSize] = useState(8); // Added to manage page size

    useEffect(() => {
        dispatch(fetchAllUsers());
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

    const handlePageSizeChange = (current, size) => {
        setPageSize(size); // Update pageSize state when the user changes the page size
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
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => {
                            setSelectedUser(record);
                            setIsViewModalVisible(true);
                        }}
                    >
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

            {/* ✅ Enhanced Users List */}
            <div className="bg-white shadow-md rounded-2xl p-6">
                

                <div className="flex flex-col md:flex-row md:justify-between items-center pb-4">
                    <Input placeholder="Search by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-40" />
                    <Select placeholder="Filter by role" onChange={(value) => setFilteredInfo({ role: [value] })} className="w-40" allowClear>
                        <Option value="admin">Admin</Option>
                        <Option value="member">Member</Option>
                        <Option value="visitor">Visitor</Option>
                    </Select>
                </div>

                <div className="overflow-x-auto"> {/* Added this wrapper */}
                    <AntTable
                        columns={columns}
                        dataSource={tableData}
                        onChange={handleChange}
                        pagination={{
                            pageSize: pageSize, // Use pageSize state
                            showSizeChanger: true, // Enable page size changer
                            pageSizeOptions: ["8", "10", "15", "30", "50"], // Options for rows per page
                            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} items`, // Show total items
                            onShowSizeChange: handlePageSizeChange, // Handle page size change
                        }}
                        loading={loading}
                        rowKey="key"
                        size="small" // Added for smaller padding
                        scroll={{ x: 'max-content' }} // Enable horizontal scroll
                    />
                </div>
            </div>

            <Modal
                title="User Details"
                visible={isViewModalVisible}
                onCancel={() => setIsViewModalVisible(false)}
                footer={null}
            >
                {selectedUser && (
                    <div>
                        <Image src={selectedUser.avatar} width={200} />
                        <p>Name: {selectedUser.name}</p>
                        <p>Email: {selectedUser.email}</p>
                        <p>Role: {selectedUser.role}</p>
                        <p>Account Status: {selectedUser.is_active}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ManageUsers;