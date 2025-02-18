import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deactivateUser, updateUserRole } from "../../redux/slices/userSlice";
import { Table, Button, Space, Avatar, Select, Tag } from "antd";
import { FaUsers, FaUserCheck, FaUser, FaEye, FaUserSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRoleChange = (id, role) => {
    dispatch(updateUserRole({ id, role }));
  };

  const handleDeactivateUser = (id) => {
    dispatch(deactivateUser(id));
  };

  const handleViewProfile = (pk) => {
    navigate(`/admin/user/${pk}`);
  };

  const totalUsers = users.length;
  const totalMembers = users.filter((user) => user.role === "member").length;
  const totalActiveUsers = users.filter((user) => user.is_active).length;

  const statistics = [
    { title: "Total Users", value: totalUsers, icon: <FaUsers /> },
    { title: "Total Members", value: totalMembers, icon: <FaUser /> },
    { title: "Active Users", value: totalActiveUsers, icon: <FaUserCheck /> },
  ];

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
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
          <Button icon={<FaEye />} onClick={() => handleViewProfile(record.pk)} />
          <Button icon={<FaUserSlash />} danger onClick={() => handleDeactivateUser(record.pk)} />
        </Space>
      ),
    },
  ];

  const tableData = users.map((user) => ({
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
      <div className="flex justify-between items-center bg-white w-[840px] h-[151px] mx-auto p-16 shadow-lg"
           style={{ gap: "114px", border: "1px solid #F0F0F0" }}>
        {statistics.map((stat, index) => (
          <div key={index} className="flex items-center gap-4 relative h-[87px]">
            <div className="w-[84px] h-[84px] flex items-center justify-center rounded-full bg-orange-100">
              <div className="w-[42px] h-[42px] flex items-center justify-center text-orange-500">{stat.icon}</div>
            </div>
            <div>
              <p className="text-[#ACACAC] text-[14px] tracking-[-1%]">{stat.title}</p>
              <p className="text-[#333333] text-[32px] font-semibold tracking-[-1%]">{stat.value}</p>
            </div>
            {index < statistics.length - 1 && (
              <div className="absolute right-[-57px] top-1/2 transform -translate-y-1/2 w-[1px] h-[87px] bg-[#F0F0F0]"></div>
            )}
          </div>
        ))}
      </div>

      <Table
        columns={columns}
        dataSource={tableData}
        onChange={handleChange}
        pagination={{ pageSize: 10 }}
        loading={loading}
        bordered
      />
    </div>
  );
};

export default ManageUsers;
