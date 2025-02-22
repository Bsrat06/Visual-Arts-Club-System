import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllArtworks,
    removeArtwork,
    editArtwork,
    addArtwork,
    fetchLikedArtworks,
} from "../../redux/slices/artworkSlice";
import {
    Input,
    Select,
    Button,
    Space,
    Image,
    Modal,
    message,
    Table,
    Tag,
    Spin,
    Form,
    Upload,
    Tabs
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { FaEdit, FaTrashAlt, FaPlusCircle } from "react-icons/fa";
import "../../styles/custom-ant.css";

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const Portfolio = () => {
    const dispatch = useDispatch();
    const { artworks, likedArtworks, loading, error } = useSelector((state) => state.artwork);
    const user = useSelector((state) => state.auth.user);
    const [selectedCategory, setSelectedCategory] = useState("");
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

    // Sorting Function
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

    // Columns for Table
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
        {
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
        },
    ];

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

    return (
        <div className="p-6 space-y-8">
            <h2 className="text-black text-[22px] font-semibold font-[Poppins]">Portfolio</h2>
            <p className="text-green-500 text-sm font-[Poppins] mt-1">Portfolio &gt; My Artworks</p>

            {/* ✅ Tabs Section */}
            <Tabs defaultActiveKey="1">
                <TabPane tab="My Artworks" key="1">
                    <div className="flex justify-between items-center mb-4">
                        <Input
                            placeholder="Search artworks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-60"
                        />
                    </div>
                    {loading ? <Spin size="large" /> : <Table columns={columns} dataSource={filteredArtworks} pagination={{ pageSize: 8 }} rowKey="id" />}
                </TabPane>

                <TabPane tab="Liked Artworks" key="2">
                    <div className="flex justify-between items-center mb-4">
                        <Input
                            placeholder="Search liked artworks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-60"
                        />
                    </div>
                    {loading ? <Spin size="large" /> : <Table columns={columns} dataSource={filteredLikedArtworks} pagination={{ pageSize: 8 }} rowKey="id" />}
                </TabPane>
            </Tabs>

            {/* ✅ Delete Confirmation Modal */}
            <Modal title="Confirm Delete" open={isDeleteModalVisible} onCancel={() => setIsDeleteModalVisible(false)} onOk={deleteArtwork} okText="Yes, Delete" okType="danger">
                <p>Are you sure you want to delete this artwork?</p>
            </Modal>

            {/* ✅ Edit Artwork Modal */}
            <Modal title="Edit Artwork" open={isEditModalVisible} onCancel={() => setIsEditModalVisible(false)} onOk={() => form.submit()} okText="Save Changes">
                <Form layout="vertical" form={form} onFinish={handleEditSubmit}>
                    <Form.Item label="Artwork Title" name="title" rules={[{ required: true, message: "Title is required" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Description" name="description" rules={[{ required: true, message: "Description is required" }]}>
                        <TextArea rows={3} />
                    </Form.Item>
                    <Form.Item label="Category" name="category" rules={[{ required: true, message: "Category is required" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Image">
                        <Upload
                            listType="picture"
                            beforeUpload={() => false}
                            defaultFileList={selectedArtwork?.image ? [{ url: selectedArtwork.image }] : []}
                        >
                            <Button icon={<UploadOutlined />}>Upload New Image</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>

            {/* ✅ Add Artwork Modal */}
            <Modal title="Add New Artwork" open={isAddModalVisible} onCancel={() => setIsAddModalVisible(false)} onOk={() => form.submit()} okText="Add Artwork">
                <Form layout="vertical" form={form} onFinish={handleAddArtwork}>
                    <Form.Item label="Title" name="title" rules={[{ required: true, message: "Title is required" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Portfolio;
