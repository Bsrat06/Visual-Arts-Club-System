import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllArtworks, removeArtwork } from "../../redux/slices/artworkSlice";
import { Input, Select, Button, Space, Image, Modal, message, Card, Pagination, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Table from "../../components/Shared/Table";
import "../../styles/custom-ant.css";

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
        dispatch(fetchAllArtworks(selectedCategory ? { category: selectedCategory, artist: user?.pk } : { artist: user?.pk }));
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
            title: "Status",
            dataIndex: "approval_status",
            key: "approval_status",
            render: (status) => (
                <Tag color={status === "approved" ? "green" : "red"}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button className="custom-edit-btn" icon={<EditOutlined />} onClick={() => console.log("Edit", record)}>Edit</Button>
                    <Button icon={<DeleteOutlined />} danger onClick={() => confirmDelete(record)}>Delete</Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            {/* ✅ Title Section */}
            <div>
                <h2 className="text-black text-[22px] font-semibold font-[Poppins]">Portfolio</h2>
                <p className="text-green-500 text-sm font-[Poppins] mt-1">Portfolio &gt; My Artworks</p>
            </div>

            {/* ✅ Portfolio Statistics Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <Card title="Total Artworks">{userArtworks.length}</Card>
                <Card title="Sketch Artworks">{userArtworks.filter(art => art.category === "sketch").length}</Card>
                <Card title="Digital Artworks">{userArtworks.filter(art => art.category === "digital").length}</Card>
            </div>

            {/* ✅ Table with Drop-shadow */}
            <div className="bg-white shadow-md rounded-lg p-4">
                {/* ✅ Search, Filter & Add Button Inside Table */}
                <div className="flex flex-col md:flex-row md:justify-between items-center pb-4">
                    <div className="flex gap-4">
                        <Input
                            placeholder="Search by title..."
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-40"
                        />
                        <Select
                            placeholder="Filter by category"
                            onChange={handleCategoryChange}
                            className="w-40"
                            allowClear
                        >
                            <Option value="sketch">Sketch</Option>
                            <Option value="canvas">Canvas</Option>
                            <Option value="wallart">Wall Art</Option>
                            <Option value="digital">Digital</Option>
                            <Option value="photography">Photography</Option>
                        </Select>
                    </div>
                    <Link to="/member/new-artwork">
                        <Button className="add-artwork-btn" type="primary" icon={<PlusOutlined /> }>
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
                    <Table columns={columns} dataSource={currentArtworks} pagination={false} rowKey="id" />
                ) : (
                    <p className="text-gray-500 text-center">No artworks available.</p>
                )}

                {/* ✅ Pagination */}
                {userArtworks.length > artworksPerPage && (
                    <Pagination
                        current={currentPage}
                        total={userArtworks.length}
                        pageSize={artworksPerPage}
                        onChange={(page) => setCurrentPage(page)}
                        className="mt-4 text-center "
                    />
                )}
            </div>

            {/* ✅ Delete Confirmation Modal */}
            <Modal
                title="Confirm Delete"
                open={isDeleteModalVisible}
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
