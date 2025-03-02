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
    Table as AntTable, // Renamed to avoid conflicts
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
    const [projectStats, setProjectStats] = useState({});
    const [statsLoading, setStatsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState("allProjects");
    const [viewAsMember, setViewAsMember] = useState(false); // ✅ Switch state
    const [pageSize, setPageSize] = useState(8); // Added to manage page size

    useEffect(() => {
        dispatch(fetchProjects());
        fetchProjectStats();
    }, [dispatch]);

    useEffect(() => {
        fetchProjectStats();
    }, [selectedTab]);

    const fetchProjectStats = async () => {
        try {
            const response = await API.get("/project-stats/");
            setProjectStats(response.data);
            setStatsLoading(false);
        } catch (err) {
            message.error("Failed to load project statistics.");
            setStatsLoading(false);
        }
    };

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
        setPageSize(size); // Update pageSize state when the user changes the page size
    };

    // ✅ Filter projects based on the selected tab
    const myProjects = projects.filter((project) => project.creator === user?.pk);
    const displayedProjects = selectedTab === "allProjects" ? projects : myProjects;

    // ✅ Filter projects based on the search query
    const filteredProjects = displayedProjects.filter((project) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const statistics = [
        {
            title: "Total Projects",
            value:
                selectedTab === "allProjects"
                    ? projectStats.total_projects || 0
                    : myProjects.length,
            icon: <FaProjectDiagram className="text-[#FFA500] text-4xl" />,
        },
        {
            title: "Completed Projects",
            value:
                selectedTab === "allProjects"
                    ? projectStats.completed_projects || 0
                    : myProjects.filter((p) => p.is_completed).length,
            icon: <FaCheckCircle className="text-[#FFA500] text-4xl" />,
        },
        {
            title: "Ongoing Projects",
            value:
                selectedTab === "allProjects"
                    ? projectStats.ongoing_projects || 0
                    : myProjects.filter((p) => !p.is_completed).length,
            icon: <FaSpinner className="text-[#FFA500] text-4xl" />,
        },
    ];

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
            sorter: (a, b) => a.title.localeCompare(b.title), // Add sorter
        },
        {
            title: "Start Date",
            dataIndex: "start_date",
            key: "start_date",
            sorter: (a, b) => new Date(a.start_date) - new Date(b.start_date), // Add sorter
        },
        {
            title: "End Date",
            dataIndex: "end_date",
            key: "end_date",
            sorter: (a, b) => new Date(a.end_date) - new Date(b.end_date), // Add sorter
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
                    <Button className="custom-edit-btn" icon={<EyeOutlined />} onClick={() => navigate(`/projects/${record.id}`)}>View</Button>
                    <Button icon={<DeleteOutlined />} danger onClick={() => deleteProject(record.id)}>Delete</Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6 space-y-8">
            <h2 className="text-black text-[22px] font-semibold font-[Poppins]">Manage Projects</h2>
            <p className="text-green-500 text-sm font-[Poppins] mt-1">Projects &gt; Review & Manage</p>

            {/* ✅ Tabs & Switch */}
            <div className="flex justify-between items-center">
                <Tabs defaultActiveKey="allProjects" onChange={(key) => setSelectedTab(key)}>
                    <TabPane tab="All Projects" key="allProjects" />
                    <TabPane tab="My Projects" key="myProjects" />
                </Tabs>

                {/* ✅ Switch to toggle between Admin & Member View */}
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

            {/* ✅ Conditionally Render View */}
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
                <div className="overflow-x-auto"> {/* Added wrapper for All Projects/My Projects table */}
                    <AntTable
                        columns={columns}
                        dataSource={filteredProjects} // Use filteredProjects instead of displayedProjects
                        pagination={{
                            pageSize: pageSize, // Use pageSize state
                            showSizeChanger: true, // Enable page size changer
                            pageSizeOptions: ["8", "10", "15", "30", "50"], // Options for rows per page
                            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} items`, // Show total items
                            onShowSizeChange: handlePageSizeChange, // Handle page size change
                        }}
                        loading={loading}
                        rowKey="id"
                        scroll={{ x: "max-content" }} // Enable horizontal scroll
                        size="small" // Added for smaller padding
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