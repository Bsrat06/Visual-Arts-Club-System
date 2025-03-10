import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllArtworks } from "../../redux/slices/artworkSlice";
import {
    Input,
    Button,
    Tag,
    Space,
    Image,
    Modal,
    message,
    Table as AntTable,
} from "antd";
import {
    CheckOutlined,
    CloseOutlined,
    EyeOutlined,
    ExclamationCircleOutlined,
    FilterOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import API from "../../services/api";
import "../../styles/custom-ant.css";

const { confirm } = Modal;

const ManageArtworks = () => {
    const dispatch = useDispatch();
    const { artworks, loading } = useSelector((state) => state.artwork);
    const [searchQuery, setSearchQuery] = useState("");
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [filteredInfo, setFilteredInfo] = useState({});
    const [pageSize, setPageSize] = useState(8);

    useEffect(() => {
        dispatch(fetchAllArtworks());
    }, [dispatch]);

    // Calculate stats from artworks
    const calculateStats = () => {
        const totalArtworks = artworks.length;
        const pendingArtworks = artworks.filter((artwork) => artwork.approval_status === "pending").length;
        const approvedArtworks = artworks.filter((artwork) => artwork.approval_status === "approved").length;
        const rejectedArtworks = artworks.filter((artwork) => artwork.approval_status === "rejected").length;

        return {
            totalArtworks,
            pendingArtworks,
            approvedArtworks,
            rejectedArtworks,
        };
    };

    const stats = calculateStats();

    const handleApproveArtwork = async (id) => {
        try {
            await API.patch(`artwork/${id}/approve/`);
            message.success("Artwork approved successfully!");
            dispatch(fetchAllArtworks());
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
                } catch (error) {
                    message.error("Failed to reject artwork.");
                }
            },
        });
    };

    const handleTableChange = (pagination, filters) => {
        setFilteredInfo(filters);
    };

    const handlePageSizeChange = (current, size) => {
        setPageSize(size);
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
            filteredValue: filteredInfo.approval_status || null,
            onFilter: (value, record) => {
                if (!filteredInfo.approval_status) return true;
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

    if (filteredInfo.approval_status) {
        filteredArtworks = filteredArtworks.filter((artwork) =>
            filteredInfo.approval_status.includes(artwork.approval_status)
        );
    }

    return (
        <div className="p-6 space-y-8">
            <h2 className="text-black text-[22px] font-semibold font-[Poppins]">Manage Artworks</h2>
            <p className="text-green-500 text-sm font-[Poppins] mt-1">Artworks &gt; Review & Manage</p>

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
                        <div className="relative w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-red-100">
                            <span className="text-2xl text-red-500">❌</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-600 text-sm leading-4">Rejected Artworks</p>
                            <p className="text-gray-400 text-xs leading-4">Rejected</p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-2xl font-bold">{stats.rejectedArtworks}</p>
                    </div>
                </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-start">
                        <div className="relative w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-orange-100">
                            <span className="text-2xl text-orange-500">⏳</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-600 text-sm leading-4">Pending Artworks</p>
                            <p className="text-gray-400 text-xs leading-4">Awaiting Approval</p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-2xl font-bold">{stats.pendingArtworks}</p>
                    </div>
                </div>
            </div>


            {/* Table Section */}
            <div className="bg-white shadow-md rounded-2xl p-6">
                <div className="flex justify-between items-center pb-4">
                    <Input
                        placeholder="Search by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-40"
                        prefix={<SearchOutlined />}
                    />
                </div>
                <div className="overflow-x-auto">
                    <AntTable
                        columns={columns}
                        dataSource={filteredArtworks}
                        rowKey="id"
                        scroll={{ x: "max-content" }}
                        onChange={handleTableChange}
                        size="small"
                        pagination={{
                            pageSize: pageSize,
                            showSizeChanger: true,
                            pageSizeOptions: ["8", "10", "15", "30", "50"],
                            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} items`,
                            onShowSizeChange: handlePageSizeChange,
                        }}
                    />
                </div>
            </div>

            {/* Artwork Details Modal */}
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