import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllArtworks,
    removeArtwork,
    editArtwork,
    addArtwork,
    fetchLikedArtworks,
    unlikeArtwork,
} from "../../redux/slices/artworkSlice";
import {
    Input,
    Select,
    Button,
    Space,
    Image,
    Modal,
    message,
    Tag,
    Spin,
    Form,
    Upload,
    Tabs,
    Empty,
    Table as AntTable,
} from "antd";
import { UploadOutlined, HeartFilled, DownloadOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { FaEdit, FaTrashAlt, FaPlusCircle, FaHeart } from "react-icons/fa";
import AddArtworkForm from "../../components/Admin/AddArtworkForm";
import EditArtworkForm from "../../components/Admin/EditArtworkForm";
import "../../styles/mansory-layout.css";
import "../../styles/tabs.css";

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const Portfolio = () => {
    const dispatch = useDispatch();
    const { artworks, likedArtworks, loading, error } = useSelector((state) => state.artwork);
    const user = useSelector((state) => state.auth.user);

    const [selectedTab, setSelectedTab] = useState("myArtworks");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [form] = Form.useForm();
    const [pageSize, setPageSize] = useState(8);

    useEffect(() => {
        if (user?.pk) {
            dispatch(fetchAllArtworks());
            dispatch(fetchLikedArtworks());
        }
    }, [dispatch, user]);

    const userArtworks = artworks.filter((art) => art.artist === user?.pk);

    // Calculate stats from artworks
    const calculateStats = () => {
        const totalArtworks = userArtworks.length;
        const approvedArtworks = userArtworks.filter((art) => art.approval_status === "approved").length;
        const pendingArtworks = userArtworks.filter((art) => art.approval_status === "pending").length;
        const likedArtworksCount = likedArtworks.length;

        return {
            totalArtworks,
            approvedArtworks,
            pendingArtworks,
            likedArtworksCount,
        };
    };

    const stats = calculateStats();

    // Sorting function
    const sortedArtworks = [...userArtworks].sort((a, b) => {
        if (sortOrder === "newest") return new Date(b.created_at) - new Date(a.created_at);
        if (sortOrder === "oldest") return new Date(a.created_at) - new Date(b.created_at);
        return a.title.localeCompare(b.title);
    });

    const filteredArtworks = useMemo(() => {
        return sortedArtworks.filter((art) =>
            art.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [sortedArtworks, searchQuery]);

    const filteredLikedArtworks = likedArtworks.filter((art) =>
        art.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isLikedArtworksTab = selectedTab === "liked";

    // Add Artwork
    const handleAddArtwork = async (values) => {
        try {
            const formData = new FormData();
            for (const key in values) {
                formData.append(key, values[key]);
            }
            formData.append("artist", user?.pk);

            await dispatch(addArtwork(formData)).unwrap();
            message.success("Artwork added successfully!");
            dispatch(fetchAllArtworks());
            setIsAddModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error("Failed to add artwork.");
        }
    };

    // Edit Artwork
    const handleEditSubmit = async (values) => {
        try {
            const updatedData = new FormData();
            for (const key in values) {
                updatedData.append(key, values[key]);
            }
            updatedData.append("artist", user?.pk);

            await dispatch(editArtwork({ id: selectedArtwork.id, data: updatedData })).unwrap();
            message.success("Artwork updated successfully!");
            dispatch(fetchAllArtworks());
            setIsEditModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error("Failed to update artwork.");
        }
    };

    // Delete Artwork
    const deleteArtwork = async () => {
        try {
            await dispatch(removeArtwork(selectedArtwork.id)).unwrap();
            message.success("Artwork deleted successfully!");
            dispatch(fetchAllArtworks());
            setIsDeleteModalVisible(false);
        } catch (error) {
            message.error("Failed to delete artwork.");
        }
    };

    const handleDownload = (imageUrl) => {
        const a = document.createElement("a");
        a.href = imageUrl;
        a.download = "artwork-image.jpg";
        a.click();
    };

    const handlePageSizeChange = (current, size) => {
        setPageSize(size);
    };

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
            sorter: (a, b) => a.category.localeCompare(b.category),
            filters: artworks
                .map((art) => art.category)
                .filter((value, index, self) => self.indexOf(value) === index)
                .map((category) => ({ text: category, value: category })),
            onFilter: (value, record) => record.category === value,
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
            onFilter: (value, record) => record.approval_status === value,
            render: (status) => (
                <Tag color={status === "approved" ? "green" : "red"}>{status.toUpperCase()}</Tag>
            ),
        },
    ];

    // Hide admin actions in liked artworks tab
    if (!isLikedArtworksTab) {
        columns.push({
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        className="custom-edit-btn"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setSelectedArtwork(record);
                            setIsEditModalVisible(true);
                        }}
                    >
                        Edit
                    </Button>

                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => {
                            setSelectedArtwork(record);
                            setIsDeleteModalVisible(true);
                        }}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        });
    }

    return (
        <div className="p-6 space-y-8">
            <p className="text-green-500 text-sm font-[Poppins] mt-1">Portfolio &gt; My Artworks</p>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-start">
                        <div className="relative w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-blue-100">
                            <span className="text-2xl text-blue-500">🎨</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-600 text-sm leading-4">Total Artworks</p>
                            <p className="text-gray-400 text-xs leading-4">All Time</p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-2xl font-bold">{stats.totalArtworks}</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-start">
                        <div className="relative w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-green-100">
                            <span className="text-2xl text-green-500">✅</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-600 text-sm leading-4">Approved Artworks</p>
                            <p className="text-gray-400 text-xs leading-4">Approved</p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-2xl font-bold">{stats.approvedArtworks}</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-start">
                        <div className="relative w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-orange-100">
                            <span className="text-2xl text-orange-500">⏳</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-600 text-sm leading-4">Pending Artworks</p>
                            <p className="text-gray-400 text-xs leading-4">Pending</p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-2xl font-bold">{stats.pendingArtworks}</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-start">
                        <div className="relative w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-purple-100">
                            <span className="text-2xl text-purple-500">❤️</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-600 text-sm leading-4">Likes</p>
                            <p className="text-gray-400 text-xs leading-4">All Time</p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-2xl font-bold">{stats.likedArtworksCount}</p>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <Tabs defaultActiveKey="myArtworks" onChange={setSelectedTab}>
                {/* My Artworks Tab */}
                <TabPane tab="My Artworks" key="myArtworks">
                    <div className="flex justify-end gap-4 mb-4">
                        <Input
                            placeholder="Search artworks by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-60"
                            prefix={<SearchOutlined />}
                        />
                        <Button
                            className="add-artwork-btn"
                            type="primary"
                            icon={<FaPlusCircle />}
                            onClick={() => setIsAddModalVisible(true)}
                        >
                            Add New Artwork
                        </Button>
                    </div>

                    {loading ? (
                        <Spin size="large" />
                    ) : (
                        <div className="overflow-x-auto">
                            <AntTable
                                columns={columns}
                                dataSource={filteredArtworks}
                                pagination={{
                                    pageSize: pageSize,
                                    showSizeChanger: true,
                                    pageSizeOptions: ["8", "15", "30", "50"],
                                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                                    onShowSizeChange: handlePageSizeChange,
                                }}
                                rowKey="id"
                                scroll={{ x: "max-content" }}
                                size="small"
                            />
                        </div>
                    )}
                </TabPane>

                {/* Liked Artworks Tab */}
                <TabPane tab="Liked Artworks" key="liked">
                    <div className="masonry">
                        {filteredLikedArtworks.length > 0 ? (
                            filteredLikedArtworks.map((artwork) => (
                                <div key={artwork.id} className="masonry-item">
                                    <div className="artwork-container">
                                        {artwork.image ? (
                                            <Image alt={artwork.title} src={`http://127.0.0.1:8000/${artwork.image}`} className="w-full h-auto rounded-lg" />
                                        ) : (
                                            <div className="bg-gray-200 w-full h-40 flex items-center justify-center text-gray-500">
                                                No Image Available
                                            </div>
                                        )}
                                        <div className="artwork-hover">
                                            <Button shape="circle" className="icon-button" onClick={() => handleDownload(artwork.image)}>
                                                <DownloadOutlined />
                                            </Button>
                                            <Button shape="circle" className="icon-button" onClick={() => dispatch(unlikeArtwork(artwork.id))}>
                                                <HeartFilled className="text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <Empty description="No liked artworks yet." />
                        )}
                    </div>
                </TabPane>
            </Tabs>

            {/* Add Artwork Modal */}
            <Modal
                title="Add New Artwork"
                visible={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                footer={null}
            >
                <AddArtworkForm
                    onArtworkAdded={() => {
                        setIsAddModalVisible(false);
                        dispatch(fetchAllArtworks());
                    }}
                />
            </Modal>

            {/* Edit Artwork Modal */}
            <Modal
                title="Edit Artwork"
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
            >
                {selectedArtwork && (
                    <EditArtworkForm
                        artwork={selectedArtwork}
                        onClose={() => {
                            setIsEditModalVisible(false);
                            dispatch(fetchAllArtworks());
                        }}
                    />
                )}
            </Modal>

            {/* Delete Artwork Modal */}
            <Modal
                title="Confirm Delete"
                okText="Yes, Delete"
                okType="danger"
                visible={isDeleteModalVisible}
                onOk={deleteArtwork}
                onCancel={() => setIsDeleteModalVisible(false)}
            >
                <p>Are you sure you want to delete this artwork?</p>
            </Modal>
        </div>
    );
};

export default Portfolio;