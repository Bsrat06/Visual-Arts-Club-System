import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllArtworks, removeArtwork } from "../../redux/slices/artworkSlice";
import {
    Input,
    Select,
    Button,
    Space,
    Image,
    Modal,
    message,
    Card,
    Pagination,
    Tag,
    Spin,
} from "antd";
import {
    FaPalette,
    FaPencilRuler,
    FaLaptopCode,
    FaEdit,
    FaTrashAlt,
    FaPlusCircle,
} from "react-icons/fa";
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
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        dispatch(fetchAllArtworks(selectedCategory ? { category: selectedCategory, artist: user?.pk } : { artist: user?.pk }));
        setTimeout(() => setStatsLoading(false), 1000);
    }, [dispatch, selectedCategory, user]);

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        setCurrentPage(1);
    };

    const userArtworks = artworks.filter((art) => art.approval_status === "approved");

    const statistics = [
        {
            title: "Total Artworks",
            value: userArtworks.length,
            icon: <FaPalette className="text-[#FFA500] text-4xl" />,
        },
        {
            title: "Sketch Artworks",
            value: userArtworks.filter((art) => art.category === "sketch").length,
            icon: <FaPencilRuler className="text-[#FFA500] text-4xl" />,
        },
        {
            title: "Digital Artworks",
            value: userArtworks.filter((art) => art.category === "digital").length,
            icon: <FaLaptopCode className="text-[#FFA500] text-4xl" />,
        },
    ];

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
                    <Button className="custom-edit-btn" icon={<FaEdit />} onClick={() => console.log("Edit", record)}>
                        Edit
                    </Button>
                    <Button icon={<FaTrashAlt />} danger onClick={() => confirmDelete(record)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6 space-y-8">
            <h2 className="text-black text-[22px] font-semibold font-[Poppins]">
                Portfolio
            </h2>
            <p className="text-green-500 text-sm font-[Poppins] mt-1">
                Portfolio &gt; My Artworks
            </p>

            {/* ✅ Enhanced Statistics Container */}
            <div className="bg-white rounded-2xl shadow-[0px_10px_60px_0px_rgba(226,236,249,0.5)] p-8 flex items-center justify-between mb-6">
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

                            {index < statistics.length - 1 && (
                                <div className="h-16 w-[1px] bg-[#F0F0F0] mx-8"></div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* ✅ Artworks Table Section */}
            <div className="bg-white shadow-md rounded-2xl p-6">
                <h2 className="text-black text-[22px] font-semibold font-[Poppins]">
                    My Artworks
                </h2>

                <Table
                    columns={columns}
                    dataSource={userArtworks}
                    pagination={{ pageSize: 8 }}
                    loading={loading}
                    rowKey="id"
                />
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
