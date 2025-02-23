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
} from "antd";
import { UploadOutlined, HeartFilled, DownloadOutlined } from "@ant-design/icons";
import { FaEdit, FaTrashAlt, FaPlusCircle, FaHeart } from "react-icons/fa";
import "../../styles/mansory-layout.css";
import Table from "../../components/Shared/Table";


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

    useEffect(() => {
        if (user?.pk) {
            dispatch(fetchAllArtworks());
            dispatch(fetchLikedArtworks());
        }
    }, [dispatch, user]);

    const userArtworks = artworks.filter((art) => art.artist === user?.pk);

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
                    <Button icon={<FaEdit />} onClick={() => {
                        setSelectedArtwork(record);
                        form.setFieldsValue(record);
                        setIsEditModalVisible(true);
                    }}>
                        Edit
                    </Button>
                    <Button icon={<FaTrashAlt />} danger onClick={() => {
                        setSelectedArtwork(record);
                        setIsDeleteModalVisible(true);
                    }}>
                        Delete
                    </Button>
                </Space>
            ),
        });
    }

    return (
        <div className="p-6 space-y-8">
            <h2 className="text-black text-[22px] font-semibold font-[Poppins]">Portfolio</h2>
            <p className="text-green-500 text-sm font-[Poppins] mt-1">Portfolio &gt; My Artworks</p>

            <Tabs defaultActiveKey="myArtworks" onChange={setSelectedTab}>
                {/* My Artworks Tab */}
                <TabPane tab="My Artworks" key="myArtworks">
                    <div className="flex justify-between items-center mb-4">
                        <Input placeholder="Search artworks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-60" />
                        <Button className="add-artwork-btn" type="primary" icon={<FaPlusCircle />} onClick={() => setIsAddModalVisible(true)}>
                            Add New Artwork
                        </Button>
                    </div>
                    {loading ? <Spin size="large" /> : <Table columns={columns} dataSource={filteredArtworks} pagination={{ pageSize: 8 }} rowKey="id" />}
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
                                            <HeartFilled className="text-red-500" /> {/* Unlike button */}
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
        </div>
    );
};

export default Portfolio;
