import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllArtworks } from "../../redux/slices/artworkSlice";
import {
    Input,
    Select,
    Button,
    Tag,
    Space,
    Image,
    Modal,
    message,
    Card,
    Spin,
    Table as AntTable,
} from "antd";
import {
    CheckOutlined,
    CloseOutlined,
    EyeOutlined,
    ExclamationCircleOutlined,
    FilterOutlined,
} from "@ant-design/icons";
import {
    FaImages,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
} from "react-icons/fa";
import API from "../../services/api";
import "../../styles/custom-ant.css";

const { Option } = Select;
const { confirm } = Modal;

const ManageArtworks = () => {
    const dispatch = useDispatch();
    const { artworks, loading } = useSelector((state) => state.artwork);
    const [searchQuery, setSearchQuery] = useState("");
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [artworkStats, setArtworkStats] = useState({});
    const [statsLoading, setStatsLoading] = useState(true);
    const [feedback, setFeedback] = useState("");
    const [filteredInfo, setFilteredInfo] = useState({}); // Added to manage column filters
    const [pageSize, setPageSize] = useState(8); // Added to manage page size

    useEffect(() => {
        dispatch(fetchAllArtworks());
        fetchArtworkStats();
    }, [dispatch]);

    const fetchArtworkStats = async () => {
        try {
            const response = await API.get("/artwork-stats/");
            setArtworkStats(response.data);
            setStatsLoading(false);
        } catch (err) {
            message.error("Failed to load artwork statistics.");
            setStatsLoading(false);
        }
    };

    const handleApproveArtwork = async (id) => {
        try {
            await API.patch(`artwork/${id}/approve/`);
            message.success("Artwork approved successfully!");
            dispatch(fetchAllArtworks());
            fetchArtworkStats();
        } catch (error) {
            message.error("Failed to approve artwork.");
        }
    };

    const handleRejectArtwork = async (id) => {
        confirm({
            title: "Are you sure you want to reject this artwork?",
            icon: <ExclamationCircleOutlined style={{ color: "red" }} />,
            content: (
                <Input.TextArea
                    placeholder="Provide rejection reason..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                />
            ),
            okText: "Reject",
            okType: "danger",
            cancelText: "Cancel",
            onOk: async () => {
                try {
                    await API.patch(`artwork/${id}/reject/`, { feedback });
                    message.success("Artwork rejected successfully!");
                    setFeedback("");
                    dispatch(fetchAllArtworks());
                    fetchArtworkStats();
                } catch (error) {
                    message.error("Failed to reject artwork.");
                }
            },
        });
    };

    const handleTableChange = (pagination, filters) => {
        setFilteredInfo(filters); // Update filteredInfo state when filters change
    };

    const handlePageSizeChange = (current, size) => {
        setPageSize(size); // Update pageSize state when the user changes the page size
    };

    const columns = [
        {
            title: "Preview",
            dataIndex: "image",
            key: "image",
            render: (image) => <Image width={50} height={50} src={image} />,
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
        },
        {
            title: "Artist",
            dataIndex: "artist_name",
            key: "artist_name",
            sorter: (a, b) => a.artist_name.localeCompare(b.artist_name),
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
            filteredValue: filteredInfo.approval_status || null, // Use filteredInfo state
            onFilter: (value, record) => {
                // Handle multiple filter values
                if (!filteredInfo.approval_status) return true; // No filter applied
                return filteredInfo.approval_status.includes(record.approval_status);
            },
            render: (status) => {
                const color =
                    status === "approved"
                        ? "green"
                        : status === "pending"
                        ? "orange"
                        : "red";
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
            filterIcon: (filtered) => (
                <FilterOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
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
                            setSelectedArtwork(record);
                            setIsViewModalVisible(true);
                        }}
                    >
                        View
                    </Button>
                    {record.approval_status === "pending" && (
                        <>
                            <Button
                                className="custom-activate-btn"
                                icon={<CheckOutlined />}
                                type="primary"
                                onClick={() => handleApproveArtwork(record.id)}
                            >
                                Approve
                            </Button>
                            <Button
                                icon={<CloseOutlined />}
                                danger
                                onClick={() => handleRejectArtwork(record.id)}
                            >
                                Reject
                            </Button>
                        </>
                    )}
                    {record.approval_status === "approved" && (
                        <Button
                            icon={<CloseOutlined />}
                            danger
                            onClick={() => handleRejectArtwork(record.id)}
                        >
                            Reject
                        </Button>
                    )}
                    {record.approval_status === "rejected" && (
                        <Button
                            className="custom-activate-btn"
                            icon={<CheckOutlined />}
                            type="primary"
                            onClick={() => handleApproveArtwork(record.id)}
                        >
                            Approve
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    let filteredArtworks = artworks.filter((artwork) =>
        artwork.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply column filters
    if (filteredInfo.approval_status) {
        filteredArtworks = filteredArtworks.filter((artwork) =>
            filteredInfo.approval_status.includes(artwork.approval_status)
        );
    }

    return (
        <div className="p-6 space-y-8">
            <p className="text-green-500 text-sm font-[Poppins] mt-1">Artworks &gt; Review & Manage</p>

            <div className="bg-white shadow-md rounded-2xl p-6">
                <div className="flex justify-between items-center pb-4">
                    <div className="flex items-center gap-4">
                        <h2>All Artworks</h2>
                        <Input
                            placeholder="Search by title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-40"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <AntTable
                        columns={columns}
                        dataSource={filteredArtworks}
                        rowKey="id"
                        scroll={{ x: "max-content" }}
                        onChange={handleTableChange} // Handle table changes (e.g., filtering)
                        size="small"
                        pagination={{
                            pageSize: pageSize, // Use pageSize state
                            showSizeChanger: true, // Enable page size changer
                            pageSizeOptions: ["8", "10", "15", "30", "50"], // Options for rows per page
                            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} items`, // Show total items
                            onShowSizeChange: handlePageSizeChange, // Handle page size change
                        }}
                    />
                </div>
            </div>

            <Modal
                title="Artwork Details"
                visible={isViewModalVisible}
                onCancel={() => setIsViewModalVisible(false)}
                footer={null}
            >
                {selectedArtwork && (
                    <div>
                        <Image src={selectedArtwork.image} width={200} />
                        <h3>{selectedArtwork.title}</h3>
                        <p>{selectedArtwork.description}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ManageArtworks;