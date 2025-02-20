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
    Card,
    Tag,
    Spin,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import {
    FaProjectDiagram,
    FaCheckCircle,
    FaSpinner,
} from "react-icons/fa";
import AddProjectForm from "../../components/Admin/AddProjectForm";
import API from "../../services/api";
import Table from "../../components/Shared/Table";
import "../../styles/custom-ant.css";  // Make sure your custom styles are loaded here

const { Option } = Select;

const ManageProjects = () => {
    const dispatch = useDispatch();
    const { projects, loading } = useSelector((state) => state.projects);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectStats, setProjectStats] = useState({});
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        dispatch(fetchProjects());
        fetchProjectStats();
    }, [dispatch]);

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

    const statistics = [
        {
            title: "Total Projects",
            value: projectStats.total_projects || 0,
            icon: <FaProjectDiagram className="text-[#FFA500] text-4xl" />,
        },
        {
            title: "Completed Projects",
            value: projectStats.completed_projects || 0,
            icon: <FaCheckCircle className="text-[#FFA500] text-4xl" />,
        },
        {
            title: "Ongoing Projects",
            value: projectStats.ongoing_projects || 0,
            icon: <FaSpinner className="text-[#FFA500] text-4xl" />,
        },
    ];

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
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
            dataIndex: "status",
            key: "status",
            filters: [
                { text: "Completed", value: "completed" },
                { text: "Ongoing", value: "ongoing" },
            ],
            filteredValue: filterStatus ? [filterStatus] : null,
            onFilter: (value, record) => record.status === value,
            render: (status) => (
                <Tag color={status === "completed" ? "green" : "orange"}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        className="custom-view-btn"
                        icon={<EyeOutlined />}
                        onClick={() => viewProject(record)}
                    >
                        View
                    </Button>
                    <Button
                        className="custom-edit-btn"
                        icon={<EditOutlined />}
                        onClick={() => editProject(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => deleteProject(record.id)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const tableData = projects
        .filter((project) => project.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((project) => ({
            key: project.id,
            title: project.title,
            description: project.description,
            start_date: project.start_date,
            end_date: project.end_date,
            status: project.status || "",
        }));

    return (
        <div className="p-6 space-y-8">
            <h2 className="text-black text-[22px] font-semibold font-[Poppins]">
                Manage Projects
            </h2>
            <p className="text-green-500 text-sm font-[Poppins] mt-1">
                Projects &gt; Review & Manage
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

            <div className="bg-white shadow-md rounded-2xl p-6">
                <h2 className="text-black text-[22px] font-semibold font-[Poppins]">
                    All Projects
                </h2>
                <Table columns={columns} dataSource={tableData} pagination={{ pageSize: 8 }} loading={loading} rowKey="key" />
            </div>
        </div>
    );
};

export default ManageProjects;
