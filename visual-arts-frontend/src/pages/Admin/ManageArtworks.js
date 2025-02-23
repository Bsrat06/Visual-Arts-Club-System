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
} from "antd";
import {
    CheckOutlined,
    CloseOutlined,
    EyeOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
    FaImages,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
} from "react-icons/fa";
import API from "../../services/api";
import Table from "../../components/Shared/Table";
import "../../styles/custom-ant.css";

const { Option } = Select;
const { confirm } = Modal;

const ManageArtworks = () => {
    const dispatch = useDispatch();
    const { artworks, loading } = useSelector((state) => state.artwork);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [artworkStats, setArtworkStats] = useState({});
    const [statsLoading, setStatsLoading] = useState(true);
    const [feedback, setFeedback] = useState("");

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
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
        },
        {
            title: "Artist",
            dataIndex: "artist_name",
            key: "artist_name",
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
                const color =
                    status === "approved"
                        ? "green"
                        : status === "pending"
                        ? "orange"
                        : "red";
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
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

    return (
        <div className="p-6 space-y-8">
           <h2 className="text-black text-[22px] font-semibold font-[Poppins]">Manage Artworks</h2>
            <p className="text-green-500 text-sm font-[Poppins] mt-1">Artworks &gt; Review & Manage</p>
            <div className="bg-white rounded-2xl shadow p-8 flex items-center justify-between mb-6">
                {statsLoading ? (
                    <Spin size="large" />
                ) : (
                    [
                        {
                            title: "Total Artworks",
                            value: artworkStats.total_artworks || 0,
                            icon: <FaImages className="text-[#FFA500] text-3xl" />,
                        },
                        {
                            title: "Approved Artworks",
                            value: artworkStats.approved_artworks || 0,
                            icon: <FaCheckCircle className="text-[#FFA500] text-3xl" />,
                        },
                        {
                            title: "Pending Artworks",
                            value: artworkStats.pending_artworks || 0,
                            icon: <FaClock className="text-[#FFA500] text-3xl" />,
                        },
                        {
                            title: "Rejected Artworks",
                            value: artworkStats.rejected_artworks || 0,
                            icon: <FaTimesCircle className="text-[#FFA500] text-3xl" />,
                        },
                    ].map((stat, index) => (
                        <div key={index} className="flex items-start space-x-6">
                            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#FFA5001F]">
                                {stat.icon}
                            </div>
                            <div className="text-left">
                                <p>{stat.title}</p>
                                <p className="text-xl font-semibold">{stat.value}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="bg-white shadow-md rounded-2xl p-6">
                <div className="flex justify-between items-center pb-4">
                    <h2>All Artworks</h2>
                    <div className="flex gap-4">
                        <Input
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Select
                            placeholder="Filter by status"
                            onChange={(value) => setFilterStatus(value)}
                            allowClear
                        >
                            <Option value="approved">Approved</Option>
                            <Option value="pending">Pending</Option>
                            <Option value="rejected">Rejected</Option>
                        </Select>
                    </div>
                </div>

                <Table columns={columns} dataSource={artworks} rowKey="id" />
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
