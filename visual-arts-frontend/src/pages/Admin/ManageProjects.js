import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, removeProject } from "../../redux/slices/projectsSlice";
import {
    Input,
    Button,
    Space,
    Modal,
    message,
    Select,
    Image,
    Card,
    Tag,
    Spin,
    Tabs,
    Badge,
    Switch,
    Table as AntTable,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import {
    FaProjectDiagram,
    FaCheckCircle,
    FaSpinner,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddProjectForm from "../../components/Admin/AddProjectForm";
import API from "../../services/api";
import "../../styles/custom-ant.css";

const { Option } = Select;
const { TabPane } = Tabs;

const ManageProjects = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { projects, loading } = useSelector((state) => state.projects);
    const user = useSelector((state) => state.auth.user);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedTab, setSelectedTab] = useState("allProjects");
    const [viewAsMember, setViewAsMember] = useState(false);
    const [pageSize, setPageSize] = useState(8);

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    // Calculate stats from projects
    const calculateStats = () => {
        const totalProjects = projects.length;
        const completedProjects = projects.filter((project) => project.is_completed).length;
        const ongoingProjects = projects.filter((project) => !project.is_completed).length;

        return {
            totalProjects,
            completedProjects,
            ongoingProjects,
        };
    };

    const stats = calculateStats();

    const showModal = () => setIsModalVisible(true);
    const closeModal = () => {
        setIsModalVisible(false);
        setEditingProject(null);
    };

    const deleteProject = (id) => {
        Modal.confirm({
            title: "Are you sure you want to delete this project?",
            okText: "Yes, Delete",
            okType: "danger",
            onOk: async () => {
                try {
                    await dispatch(removeProject(id));
                    message.success("Project deleted successfully!");
                    dispatch(fetchProjects());
                } catch (error) {
                    message.error("Failed to delete project.");
                }
            },
        });
    };

    const editProject = (project) => {
        setEditingProject(project);
        showModal();
    };

    const viewProject = (project) => {
        setSelectedProject(project);
        setIsViewModalVisible(true);
    };

    const handlePageSizeChange = (current, size) => {
        setPageSize(size);
    };

    // Filter projects based on the selected tab
    const myProjects = projects.filter((project) => project.creator === user?.pk);
    const displayedProjects = selectedTab === "allProjects" ? projects : myProjects;

    // Filter projects based on the search query
    const filteredProjects = displayedProjects.filter((project) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
            title: "Start Date",
            dataIndex: "start_date",
            key: "start_date",
            sorter: (a, b) => new Date(a.start_date) - new Date(b.start_date),
        },
        {
            title: "End Date",
            dataIndex: "end_date",
            key: "end_date",
            sorter: (a, b) => new Date(a.end_date) - new Date(b.end_date),
        },
        {
            title: "Status",
            dataIndex: "is_completed",
            key: "is_completed",
            filters: [
                { text: "Completed", value: true },
                { text: "Ongoing", value: false },
            ],
            onFilter: (value, record) => record.is_completed === value,
            render: (is_completed) => (
                <Tag color={is_completed ? "green" : "orange"}>
                    {is_completed ? "Completed" : "Ongoing"}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button className="custom-edit-btn" icon={<EyeOutlined />} onClick={() => navigate(`/projects/${record.id}`)}>
                        View
                    </Button>
                    <Button icon={<DeleteOutlined />} danger onClick={() => deleteProject(record.id)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6 space-y-8">
            <h2 className="text-black text-[22px] font-semibold font-[Poppins]">Manage Projects</h2>
            <p className="text-green-500 text-sm font-[Poppins] mt-1">Projects &gt; Review & Manage</p>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-start">
                        <div className="relative w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-blue-100">
                            <span className="text-2xl text-blue-500">📂</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-600 text-sm leading-4">Total Projects</p>
                            <p className="text-gray-400 text-xs leading-4">All Time</p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-2xl font-bold">{stats.totalProjects}</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-start">
                        <div className="relative w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-green-100">
                            <span className="text-2xl text-green-500">✅</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-600 text-sm leading-4">Completed Projects</p>
                            <p className="text-gray-400 text-xs leading-4">Completed</p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-2xl font-bold">{stats.completedProjects}</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-start">
                        <div className="relative w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-orange-100">
                            <span className="text-2xl text-orange-500">⏳</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-600 text-sm leading-4">Ongoing Projects</p>
                            <p className="text-gray-400 text-xs leading-4">In Progress</p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-2xl font-bold">{stats.ongoingProjects}</p>
                    </div>
                </div>
            </div>

            {/* Tabs & Switch */}
            <div className="flex justify-between items-center">
                <Tabs defaultActiveKey="allProjects" onChange={(key) => setSelectedTab(key)}>
                    <TabPane tab="All Projects" key="allProjects" />
                    <TabPane tab="My Projects" key="myProjects" />
                </Tabs>

                {/* Switch to toggle between Admin & Member View */}
                <div className="flex items-center space-x-2">
                    <span className="text-gray-600">View as Member</span>
                    <Switch checked={viewAsMember} onChange={() => setViewAsMember(!viewAsMember)} />
                </div>
            </div>

            <div className="flex gap-4 justify-end my-4">
                <Input
                    placeholder="Search by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-40"
                    prefix={<SearchOutlined />}
                />
            </div>

            {/* Conditionally Render View */}
            {viewAsMember ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <Badge.Ribbon
                            key={project.id}
                            text={project.is_completed ? "Completed" : "Ongoing"}
                            color={project.is_completed ? "green" : "orange"}
                        >
                            <Card
                                hoverable
                                onClick={() => navigate(`/projects/${project.id}`)}
                                cover={
                                    project.image ? (
                                        <Image
                                            alt={project.title}
                                            src={project.image}
                                            className="h-[200px] w-full object-cover rounded-lg"
                                        />
                                    ) : null
                                }
                                className="shadow-md transition duration-300 transform hover:scale-[1.02] cursor-pointer"
                            >
                                <Card.Meta
                                    title={<span className="text-lg font-semibold text-black">{project.title}</span>}
                                    description={<p className="text-gray-500">{project.description}</p>}
                                />
                            </Card>
                        </Badge.Ribbon>
                    ))}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <AntTable
                        columns={columns}
                        dataSource={filteredProjects}
                        pagination={{
                            pageSize: pageSize,
                            showSizeChanger: true,
                            pageSizeOptions: ["8", "10", "15", "30", "50"],
                            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} items`,
                            onShowSizeChange: handlePageSizeChange,
                        }}
                        loading={loading}
                        rowKey="id"
                        scroll={{ x: "max-content" }}
                        size="small"
                    />
                </div>
            )}

            <Modal title="Add New Project" open={isModalVisible} onCancel={closeModal} footer={null}>
                <AddProjectForm onClose={closeModal} />
            </Modal>
        </div>
    );
};

export default ManageProjects;