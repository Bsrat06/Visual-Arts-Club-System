import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, removeProject } from "../../redux/slices/projectsSlice";
import { Input, Button, Space, Modal, message, Select, Card, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import AddProjectForm from "../../components/Admin/AddProjectForm";
import API from "../../services/api";
import Table from "../../components/Shared/Table";
import "../../styles/custom-ant.css";

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
                    <Button className="custom-view-btn" icon={<EyeOutlined />} onClick={() => viewProject(record)}>View</Button>
                    <Button className="custom-edit-btn" icon={<EditOutlined />} onClick={() => editProject(record)}>Edit</Button>
                    <Button icon={<DeleteOutlined />} danger onClick={() => deleteProject(record.id)}>Delete</Button>
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
        <div className="p-6">
            {/* ✅ Title Section */}
            <div>
                <h2 className="text-black text-[22px] font-semibold font-[Poppins]">
                    Manage Projects
                </h2>
                <p className="text-green-500 text-sm font-[Poppins] mt-1">
                    Projects &gt; Review & Manage
                </p>
            </div>

            {/* ✅ Project Statistics */}
            {statsLoading ? (
                <p>Loading project statistics...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <Card title="Total Projects">{projectStats.total_projects}</Card>
                    <Card title="Completed Projects">{projectStats.completed_projects}</Card>
                    <Card title="Ongoing Projects">{projectStats.ongoing_projects}</Card>
                </div>
            )}

            {/* ✅ Table with Drop-shadow */}
            <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-black text-[22px] font-semibold font-[Poppins]">All Projects</h2>
                {/* ✅ Search, Filter, and Add Button Inside Table */}
                <div className="flex flex-col md:flex-row md:justify-between items-center pb-4">
                    <div className="flex gap-4">
                        <Input
                            placeholder="Search by project title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-40"
                        />
                        <Select
                            placeholder="Filter by status"
                            onChange={(value) => setFilterStatus(value)}
                            className="w-40"
                            allowClear
                        >
                            <Option value="completed">Completed</Option>
                            <Option value="ongoing">Ongoing</Option>
                        </Select>
                    </div>
                    <Button className="add-artwork-btn" type="primary" icon={<PlusOutlined />} onClick={showModal}>
                        Add Project
                    </Button>
                </div>

                {/* ✅ Projects Table */}
                <Table
                    columns={columns}
                    dataSource={tableData}
                    pagination={{ pageSize: 8 }}
                    loading={loading}
                    bordered
                    rowKey="key"
                />
            </div>

            {/* ✅ Add / Edit Project Modal */}
            <Modal
                title={editingProject ? "Edit Project" : "Add New Project"}
                open={isModalVisible}
                onCancel={closeModal}
                footer={null}
            >
                <AddProjectForm project={editingProject} onClose={closeModal} />
            </Modal>

            {/* ✅ View Project Modal */}
            <Modal
                title="Project Details"
                open={isViewModalVisible}
                onCancel={() => setIsViewModalVisible(false)}
                footer={null}
            >
                {selectedProject && (
                    <div>
                        <p>
                            <strong>Title:</strong> {selectedProject.title}
                        </p>
                        <p>
                            <strong>Description:</strong> {selectedProject.description}
                        </p>
                        <p>
                            <strong>Start Date:</strong> {selectedProject.start_date}
                        </p>
                        <p>
                            <strong>End Date:</strong> {selectedProject.end_date}
                        </p>
                        <p>
                            <strong>Status:</strong>{" "}
                            <span className={selectedProject.status === "completed" ? "text-green-500" : "text-orange-500"}>
                                {selectedProject.status?.toUpperCase()}
                            </span>
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ManageProjects;
