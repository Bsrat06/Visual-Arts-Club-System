import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, removeProject } from "../../redux/slices/projectsSlice";
import { Table, Input, Button, Card, Space, Modal, message, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import AddProjectForm from "../../components/Admin/AddProjectForm";
import API from "../../services/api";

const { Option } = Select;

const ManageProjects = () => {
    const dispatch = useDispatch();
    const { projects, loading, error } = useSelector((state) => state.projects);
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
                    dispatch(fetchProjects()); // Refresh the project list
                } catch (error) {
                    message.error("Failed to delete project.");
                }
            },
        });
    };

    const editProject = (project) => {
        setEditingProject(project);
        showModal(); // Open the modal for editing
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
        },
        {
            title: "End Date",
            dataIndex: "end_date",
            key: "end_date",
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
            render: (status) => {
                return status ? (
                    <span className={status === "completed" ? "text-green-500" : "text-orange-500"}>
                        {status.toUpperCase()}
                    </span>
                ) : null;
            },
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button icon={<EyeOutlined />} onClick={() => viewProject(record)}>
                        View
                    </Button>
                    <Button icon={<EditOutlined />} onClick={() => editProject(record)}>
                        Edit
                    </Button>
                    <Button icon={<DeleteOutlined />} danger onClick={() => deleteProject(record.id)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const tableData = projects.map((project) => ({
        key: project.id,
        title: project.title,
        description: project.description,
        start_date: project.start_date,
        end_date: project.end_date,
        status: project.status || "", // Provide default if status is missing
    }));

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Manage Projects</h1>

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

            {/* ✅ Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <Input
                    placeholder="Search by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="md:w-1/2"
                />
                <Select
                    placeholder="Filter by status"
                    onChange={(value) => setFilterStatus(value)}
                    className="md:w-1/4"
                    allowClear
                >
                    <Option value="completed">Completed</Option>
                    <Option value="ongoing">Ongoing</Option>
                </Select>
            </div>

            {/* ✅ Add Project Button */}
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal} className="mb-4">
                Add New Project
            </Button>

            {/* ✅ Ant Design Table */}
            <Table
                columns={columns}
                dataSource={tableData}
                pagination={{ pageSize: 8 }}
                loading={loading}
                bordered
                rowKey="key"
            />

            {/* ✅ Add / Edit Project Modal */}
            <Modal
                title={editingProject ? "Edit Project" : "Add New Project"}
                visible={isModalVisible}
                onCancel={closeModal}
                footer={null}
            >
                <AddProjectForm project={editingProject} onClose={closeModal} />
            </Modal>

            {/* ✅ View Project Modal */}
            <Modal
                title="Project Details"
                visible={isViewModalVisible}
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
                            <span
                                className={selectedProject.status === "completed" ? "text-green-500" : "text-orange-500"}
                            >
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
