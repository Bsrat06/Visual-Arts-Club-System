import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllArtworks, removeArtwork } from "../../redux/slices/artworkSlice";
import { Table, Button, Select, Space, Image, Modal, message, Pagination } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Option } = Select;

const Portfolio = () => {
  const dispatch = useDispatch();
  const { artworks, loading, error } = useSelector((state) => state.artwork);
  const user = useSelector((state) => state.auth.user);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const artworksPerPage = 5;

  useEffect(() => {
    dispatch(
      fetchAllArtworks(selectedCategory ? { category: selectedCategory, artist: user?.pk } : { artist: user?.pk })
    );
  }, [dispatch, selectedCategory, user]);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const userArtworks = artworks.filter((art) => art.approval_status === "approved");

  // Pagination Logic
  const indexOfLastArtwork = currentPage * artworksPerPage;
  const indexOfFirstArtwork = indexOfLastArtwork - artworksPerPage;
  const currentArtworks = userArtworks.slice(indexOfFirstArtwork, indexOfLastArtwork);

  // Open Delete Confirmation Modal
  const confirmDelete = (artwork) => {
    setSelectedArtwork(artwork);
    setIsDeleteModalVisible(true);
  };

  // Handle Delete
  const deleteArtwork = async () => {
    try {
      await dispatch(removeArtwork(selectedArtwork.id));
      message.success("Artwork deleted successfully!");
      dispatch(fetchAllArtworks({ artist: user?.pk }));
      setIsDeleteModalVisible(false);
    } catch (error) {
      message.error("Failed to delete artwork.");
    }
  };

  // Define Table Columns
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
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Status",
      dataIndex: "approval_status",
      key: "approval_status",
      render: (status) => (
        <span className={status === "approved" ? "text-green-500" : "text-red-500"}>
          {status.toUpperCase()}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => console.log("Edit", record)}>
            Edit
          </Button>
          <Button icon={<DeleteOutlined />} danger onClick={() => confirmDelete(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Portfolio</h1>

      {/* ✅ Category Filter & Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <Select
          placeholder="Filter by category"
          onChange={handleCategoryChange}
          className="w-full md:w-1/3"
          allowClear
        >
          <Option value="sketch">Sketch</Option>
          <Option value="canvas">Canvas</Option>
          <Option value="wallart">Wall Art</Option>
          <Option value="digital">Digital</Option>
          <Option value="photography">Photography</Option>
        </Select>
        <Link to="/member/new-artwork">
          <Button type="primary" icon={<PlusOutlined />}>
            Add New Artwork
          </Button>
        </Link>
      </div>

      {/* ✅ Artwork Table */}
      {loading ? (
        <p>Loading artworks...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : currentArtworks.length > 0 ? (
        <Table columns={columns} dataSource={currentArtworks} pagination={false} rowKey="id" bordered />
      ) : (
        <p>You have no approved artworks yet for the selected category.</p>
      )}

      {/* ✅ Pagination */}
      {userArtworks.length > 0 && (
        <Pagination
          current={currentPage}
          total={userArtworks.length}
          pageSize={artworksPerPage}
          onChange={(page) => setCurrentPage(page)}
          className="mt-4 text-center"
        />
      )}

      {/* ✅ Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        visible={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={deleteArtwork}
        okText="Yes, Delete"
        okType="danger"
      >
        <p>Are you sure you want to delete this artwork?</p>
      </Modal>
    </div>
  );
};

export default Portfolio;
