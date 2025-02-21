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
    Skeleton,
} from "antd";
import {
    CheckOutlined,
    CloseOutlined,
    EyeOutlined,
    PlusOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import {
    FaImages,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
} from "react-icons/fa";
import AddArtworkForm from "../../components/Admin/AddArtworkForm";
import API from "../../services/api";
import Table from "../../components/Shared/Table";
import "../../styles/custom-ant.css";

const { Option } = Select;

const ManageArtworks = () => {
    const dispatch = useDispatch();
    const { artworks, loading } = useSelector((state) => state.artwork);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [artworkStats, setArtworkStats] = useState({});
    const [statsLoading, setStatsLoading] = useState(true);

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

    const showModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);

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

    const handleRejectArtwork = async () => {
        try {
            await API.patch(`artwork/${selectedArtwork.id}/reject/`, { feedback });
            message.success("Artwork rejected with feedback!");
            setIsRejectModalVisible(false);
            setFeedback("");
            dispatch(fetchAllArtworks());
            fetchArtworkStats();
        } catch (error) {
            message.error("Failed to reject artwork.");
        }
    };

    const statistics = [
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
    ];

    const columns = [
        {
            title: "Preview",
            dataIndex: "image",
            key: "image",
            render: (image) => (
                <Image width={50} height={50} src={image} alt="Artwork" />
            ),
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
                        className="custom-view-btn"
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
                                onClick={() => {
                                    setSelectedArtwork(record);
                                    setIsRejectModalVisible(true);
                                }}
                            >
                                Reject
                            </Button>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6 space-y-8">
            <h2 className="text-black text-[22px] font-semibold font-[Poppins]">
                Manage Artworks
            </h2>
            <p className="text-green-500 text-sm font-[Poppins] mt-1">
                Artworks &gt; Review & Manage
            </p>

            <div className="bg-white rounded-2xl shadow p-8 flex items-center justify-between mb-6">
                {statsLoading ? (
                    <Spin size="large" />
                ) : (
                    statistics.map((stat, index) => (
                        <div key={index} className="flex items-start space-x-6">
                            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#FFA5001F]">
                                {stat.icon}
                            </div>

                            <div className="text-left">
                                <p className="text-[#ACACAC] text-[14px] font-[Poppins]">
                                    {stat.title}
                                </p>
                                <p className="text-[#333333] text-[34px] font-semibold font-[Poppins]">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="bg-white shadow-md rounded-2xl p-6">
                <div className="flex justify-between items-center pb-4">
                    <h2 className="text-black text-[22px] font-semibold font-[Poppins]">
                        All Artworks
                    </h2>
                    <div className="flex gap-4">
                        <Input
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            prefix={<SearchOutlined />}
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

                <Table
                    columns={columns}
                    dataSource={artworks}
                    pagination={{ pageSize: 8 }}
                    loading={loading}
                    rowKey="id"
                />
            </div>
        </div>
    );
};

export default ManageArtworks;
