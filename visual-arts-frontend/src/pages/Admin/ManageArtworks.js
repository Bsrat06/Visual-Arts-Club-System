import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllArtworks } from "../../redux/slices/artworkSlice";
import { Table, Input, Select, Button, Tag, Space, Image, Modal, message } from "antd";
import { CheckOutlined, CloseOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import AddArtworkForm from "../../components/Admin/AddArtworkForm";
import API from "../../services/api";

const { Option } = Select;

const ManageArtworks = () => {
  const dispatch = useDispatch();
  const { artworks, loading, error } = useSelector((state) => state.artwork);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    dispatch(fetchAllArtworks());
  }, [dispatch]);

  const showModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const viewArtwork = (artwork) => {
    setSelectedArtwork(artwork);
    setIsViewModalVisible(true);
  };

  const rejectArtwork = (artwork) => {
    setSelectedArtwork(artwork);
    setIsRejectModalVisible(true);
  };

  const approveArtwork = async (id) => {
    try {
      await API.patch(`artwork/${id}/approve/`);
      message.success("Artwork approved successfully!");
      dispatch(fetchAllArtworks());
    } catch (error) {
      message.error("Failed to approve artwork.");
    }
  };

  const handleRejectWithFeedback = async () => {
    try {
      await API.patch(`artwork/${selectedArtwork.id}/reject/`, { feedback });
      message.success("Artwork rejected with feedback!");
      setIsRejectModalVisible(false);
      setFeedback("");
      dispatch(fetchAllArtworks());
    } catch (error) {
      message.error("Failed to reject artwork.");
    }
  };

  const filteredArtworks = artworks.filter(
    (art) =>
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterStatus === "" || art.approval_status === filterStatus)
  );

  const columns = [
    {
      title: "Preview",
      dataIndex: "image",
      key: "image",
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
      filteredValue: filterStatus ? [filterStatus] : null,
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
          <Button icon={<EyeOutlined />} onClick={() => viewArtwork(record)}>
            View
          </Button>
          {(record.approval_status === "pending" || record.approval_status === "rejected") && (
            <Button icon={<CheckOutlined />} type="primary" onClick={() => approveArtwork(record.id)}>
              Approve
            </Button>
          )}
          {record.approval_status === "pending" && (
            <Button icon={<CloseOutlined />} danger onClick={() => rejectArtwork(record)}>
              Reject
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* ✅ Title Section Above the Table */}
      <div className="w-full bg-white h-[130px] flex flex-col md:flex-row justify-between items-center px-6 shadow-md rounded-md mb-4">
        <div>
          <h2 className="text-black text-[22px] font-semibold font-[Poppins]">
            Manage Artworks
          </h2>
          <p className="text-gray-500 text-sm font-[Poppins] mt-1">
            Artworks &gt; Review & Manage
          </p>
        </div>

        {/* ✅ Search & Filter Controls */}
        <div className="flex gap-4">
          <Input
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-40"
          />
          <Select
            placeholder="Filter by status"
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            className="w-40"
            allowClear
          >
            <Option value="approved">Approved</Option>
            <Option value="pending">Pending</Option>
            <Option value="rejected">Rejected</Option>
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Add Artwork
          </Button>
        </div>
      </div>

      {/* ✅ Artworks Table */}
      <Table
        columns={columns}
        dataSource={filteredArtworks}
        pagination={{ pageSize: 8 }}
        loading={loading}
        bordered
      />

      {/* ✅ Add Artwork Modal */}
      <Modal title="Add New Artwork" visible={isModalVisible} onCancel={closeModal} footer={null}>
        <AddArtworkForm onArtworkAdded={closeModal} />
      </Modal>

      {/* ✅ View Artwork Modal */}
      <Modal title="Artwork Details" visible={isViewModalVisible} onCancel={() => setIsViewModalVisible(false)} footer={null}>
        {selectedArtwork && (
          <div>
            <Image width={250} src={selectedArtwork.image_url} />
            <p><strong>Title:</strong> {selectedArtwork.title}</p>
            <p><strong>Category:</strong> {selectedArtwork.category}</p>
            <p><strong>Artist:</strong> {selectedArtwork.artist}</p>
            <p><strong>Description:</strong> {selectedArtwork.description}</p>
          </div>
        )}
      </Modal>

      {/* ✅ Reject Artwork Modal */}
      <Modal title="Reject Artwork" visible={isRejectModalVisible} onCancel={() => setIsRejectModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsRejectModalVisible(false)}>Cancel</Button>,
          <Button key="reject" type="primary" danger onClick={handleRejectWithFeedback}>Submit</Button>
        ]}
      >
        <textarea className="w-full p-2 border rounded" rows="3" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Enter feedback..."></textarea>
      </Modal>
    </div>
  );
};

export default ManageArtworks;
