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
  Spin,
  Table as AntTable,
} from "antd";
import {
  EyeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import {
  FaUsers,
  FaUserCheck,
  FaUserSlash,
  FaUserPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../styles/custom-ant.css";

const { Option } = Select;

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);
  const currentUserRole = useSelector((state) => state.auth.role); // Get the current user's role
  const navigate = useNavigate();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(8);
  const [previousMonthData, setPreviousMonthData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    dispatch(fetchAllUsers());
    fetchPreviousMonthData();
  }, [dispatch]);

  const fetchPreviousMonthData = () => {
    const previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 1);

    const previousMonthUsers = users.filter((user) => {
      const joinDate = new Date(user.date_joined);
      return joinDate.getMonth() === previousMonth.getMonth() && joinDate.getFullYear() === previousMonth.getFullYear();
    });

    const previousMonthActiveUsers = previousMonthUsers.filter((user) => user.is_active).length;
    const previousMonthInactiveUsers = previousMonthUsers.filter((user) => !user.is_active).length;
    const previousMonthPendingApprovals = previousMonthUsers.filter((user) => !user.is_active).length;

    setPreviousMonthData({
      totalUsers: previousMonthUsers.length,
      activeUsers: previousMonthActiveUsers,
      inactiveUsers: previousMonthInactiveUsers,
      pendingApprovals: previousMonthPendingApprovals,
    });
  };

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
    setPageSize(size);
  };

  const totalUsers = users.length;
  const totalActiveUsers = users.filter((user) => user.is_active).length;
  const totalInactiveUsers = totalUsers - totalActiveUsers;
  const pendingApprovals = users.filter((user) => !user.is_active).length;

  const getPercentageChange = (current, previous) => {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return Math.round(((current - previous) / previous) * 100);
  };

  const renderPercentageChange = (current, previous) => {
    const percentage = getPercentageChange(current, previous);
    const isIncrease = percentage > 0;

    return (
      <span className={`text-xs ${isIncrease ? "text-green-500" : "text-red-500"}`}>
        {percentage}% {isIncrease ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
      </span>
    );
  };

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: <FaUsers className="text-blue-500 text-2xl" />,
      color: "text-blue-500",
      previousValue: previousMonthData.totalUsers,
    },
    {
      title: "Active Users",
      value: totalActiveUsers,
      icon: <FaUserCheck className="text-green-500 text-2xl" />,
      color: "text-green-500",
      previousValue: previousMonthData.activeUsers,
    },
    {
      title: "Inactive Users",
      value: totalInactiveUsers,
      icon: <FaUserSlash className="text-red-500 text-2xl" />,
      color: "text-red-500",
      previousValue: previousMonthData.inactiveUsers,
    },
    {
      title: "Pending Approvals",
      value: pendingApprovals,
      icon: <FaUserPlus className="text-yellow-500 text-2xl" />,
      color: "text-yellow-500",
      previousValue: previousMonthData.pendingApprovals,
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
        { text: "Manager", value: "manager" },
        { text: "Member", value: "member" },
      ],
      filteredValue: filteredInfo.role || null,
      onFilter: (value, record) => record.role === value,
      render: (role, record) => {
        // If the current user is an admin, render a Select component
        if (currentUserRole === "admin") {
          return (
            <Select
              value={role}
              onChange={(newRole) => handleRoleChange(record.pk, newRole)}
            >
              <Option value="admin">Admin</Option>
              <Option value="manager">Manager</Option>
              <Option value="member">Member</Option>
            </Select>
          );
        } else {
          // If the current user is not an admin, render the role as plain text
          return <span>{role}</span>;
        }
      },
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
        <Tag color={is_active ? "green" : "red"}>
          {is_active ? "Active" : "Inactive"}
        </Tag>
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
            <Button
              icon={<FaUserSlash />}
              danger
              onClick={() => handleDeactivateUser(record.pk)}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              className="custom-activate-btn"
              icon={<FaUserPlus />}
              ghost
              type="primary"
              onClick={() => handleActivateUser(record.pk)}
            >
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

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-start">
              <div className={`relative w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-gray-100`}>
                {stat.icon}
              </div>
              <div className="flex-1">
                <p className="text-gray-600 text-sm leading-4">{stat.title}</p>
                <p className="text-gray-400 text-xs leading-4">This month</p>
              </div>
            </div>
            <div className="flex items-center">
              <p className="text-2xl font-bold mr-2">{stat.value}</p>
              {renderPercentageChange(stat.value, stat.previousValue)}
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Enhanced Users List */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:justify-between items-center pb-4">
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-40"
          />
          <Select
            placeholder="Filter by role"
            onChange={(value) => setFilteredInfo({ role: [value] })}
            className="w-40"
            allowClear
          >
            <Option value="admin">Admin</Option>
            <Option value="manager">Manager</Option>
            <Option value="member">Member</Option>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <AntTable
            columns={columns}
            dataSource={tableData}
            onChange={handleChange}
            pagination={{
              pageSize: pageSize,
              showSizeChanger: true,
              pageSizeOptions: ["8", "10", "15", "30", "50"],
              showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} items`,
              onShowSizeChange: handlePageSizeChange,
            }}
            loading={loading}
            rowKey="key"
            size="small"
            scroll={{ x: "max-content" }}
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