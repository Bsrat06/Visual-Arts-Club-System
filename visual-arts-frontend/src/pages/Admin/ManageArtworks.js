import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtworks } from "../../redux/slices/artworkSlice";
import { Table, Input, Select, Button, Tag, Space, Image } from "antd";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const ManageArtworks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { artworks, loading, error } = useSelector((state) => state.artwork);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  useEffect(() => {
    dispatch(fetchArtworks());
  }, [dispatch]);

  // ✅ Handle Table Sorting & Filtering
  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  // ✅ Handle Search & Filtering
  const filteredArtworks = artworks.filter(
    (art) =>
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterStatus === "" || art.approval_status === filterStatus)
  );

  // ✅ Define Table Columns
  const columns = [
    {
      title: "Preview",
      dataIndex: "image_url",
      key: "image_url",
      render: (image) => <Image width={50} height={50} src={image} alt="Artwork" />,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: [...new Set(artworks.map((art) => art.category))].map((category) => ({
        text: category,
        value: category,
      })),
      filteredValue: filteredInfo.category || null,
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Artist",
      dataIndex: "artist",
      key: "artist",
    },
    {
      title: "Status",
      dataIndex: "approval_status",
      key: "approval_status",
      filters: [
        { text: "Approved", value: "approved" },
        { text: "Pending", value: "pending" },
        { text: "Rejected", value: "rejected" },
      ],
      filteredValue: filteredInfo.approval_status || null,
      onFilter: (value, record) => record.approval_status === value,
      render: (status) => {
        const color = status === "approved" ? "green" : status === "pending" ? "orange" : "red";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<FaCheck />} type="primary" onClick={() => approveArtwork(record.id)}>
            Approve
          </Button>
          <Button icon={<FaTimes />} danger onClick={() => rejectArtwork(record.id)}>
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  // ✅ Transform Data for Ant Design Table
  const tableData = filteredArtworks.map((art) => ({
    key: art.id,
    image_url: art.image_url,
    title: art.title,
    category: art.category,
    artist: art.artist,
    approval_status: art.approval_status,
  }));

  // ✅ Action Handlers
  const approveArtwork = (id) => {
    console.log(`Approving artwork with ID: ${id}`);
  };

  const rejectArtwork = (id) => {
    console.log(`Rejecting artwork with ID: ${id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Artworks</h1>

      {/* ✅ Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Input
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:w-1/2"
        />
        <Select
          placeholder="Filter by status"
          onChange={(value) => setFilterStatus(value)}
          className="md:w-1/4"
          allowClear
        >
          <Option value="approved">Approved</Option>
          <Option value="pending">Pending</Option>
          <Option value="rejected">Rejected</Option>
        </Select>
      </div>

      {/* ✅ Add Artwork Button */}
      <Button
        type="primary"
        onClick={() => navigate("/member/new-artwork/")}
        className="mb-4"
      >
        Add New Artwork
      </Button>

      {/* ✅ Ant Design Table */}
      <Table
        columns={columns}
        dataSource={tableData}
        onChange={handleChange}
        pagination={{ pageSize: 8 }}
        loading={loading}
        bordered
      />
    </div>
  );
};

export default ManageArtworks;
