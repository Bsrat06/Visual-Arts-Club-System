import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectDetails, addProjectUpdate, completeProject, removeProject } from "../../redux/slices/projectsSlice";
import { Card, Steps, Form, Input, Button, Upload, message, Spin, Modal, Typography } from "antd";
import { UploadOutlined, CheckCircleOutlined, ExclamationCircleOutlined, DeleteOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { confirm } = Modal;

const ProjectDetails = () => {
    const { projectId } = useParams();
        const navigate = useNavigate();
        const dispatch = useDispatch();
        const { selectedProject, loading } = useSelector((state) => state.projects);
        const user = useSelector((state) => state.auth.user);
    
        const [form] = Form.useForm();
        const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);
        const [progressImage, setProgressImage] = useState(null);
    
        useEffect(() => {
            dispatch(fetchProjectDetails(projectId));
        }, [dispatch, projectId]);
    
        if (loading || !selectedProject) {
            return <Spin size="large" className="flex justify-center mt-10" />;
        }
    
        const isOwner = user?.pk === selectedProject.creator; // Check if user is project owner
    
        // Handle progress image upload
        const handleUpload = ({ file }) => {
            setProgressImage(file);
        };
    
        // Submit new progress
        const handleAddUpdate = async (values) => {
            if (!progressImage) {
                message.warning("Please upload an image for progress.");
                return;
            }
    
            const formData = new FormData();
            formData.append("description", values.description);
            formData.append("image", progressImage);
            formData.append("project", projectId);
    
            try {
                await dispatch(addProjectUpdate({ projectId, data: formData })).unwrap();
                message.success("Progress update added successfully!");
                dispatch(fetchProjectDetails(projectId)); // Refresh project data
                form.resetFields();
                setProgressImage(null);
            } catch (error) {
                message.error("Failed to add progress update.");
            }
        };
    
        // Confirm project deletion
        const confirmDelete = () => {
            confirm({
                title: "Are you sure you want to delete this project?",
                icon: <ExclamationCircleOutlined />,
                content: "This action cannot be undone!",
                okText: "Delete",
                okType: "danger",
                cancelText: "Cancel",
                onOk() {
                    dispatch(removeProject(projectId))
                        .unwrap()
                        .then(() => {
                            message.success("Project deleted successfully!");
                            navigate("/projects");
                        })
                        .catch(() => message.error("Failed to delete project."));
                },
            });
        };

    return (
        <div className="p-6 max-w-[1000px] mx-auto font-poppins">
            <h2 className="text-black text-[22px] font-semibold">{selectedProject.title}</h2>
            <p className="text-gray-500">{selectedProject.description}</p>

            <Card className="mt-4">
                <Steps direction="vertical" current={selectedProject.updates.length}>
                    {selectedProject.updates.map((update, index) => (
                        <Steps.Step
                            key={index}
                            title={`Update ${index + 1}`}
                            description={update.description}
                            icon={update.image ? <img src={update.image} alt="Progress" className="w-10 h-10 object-cover rounded" /> : null}
                        />
                    ))}
                </Steps>
            </Card>

            {user?.pk === selectedProject.creator && !selectedProject.is_completed && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Add Progress Update</h3>
                    <Form form={form} layout="vertical" onFinish={handleAddUpdate}>
                        <Form.Item label="Description" name="description" rules={[{ required: true, message: "Please enter a description" }]}>
                            <TextArea rows={3} />
                        </Form.Item>
                        <Form.Item label="Upload Image" name="image">
                            <Upload beforeUpload={() => false} maxCount={1}>
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                            </Upload>
                        </Form.Item>
                        <Button type="primary" htmlType="submit">Add Update</Button>
                    </Form>
                </div>
            )}

            {user?.pk === selectedProject.creator && !selectedProject.is_completed && (
                <Button className="mt-6" type="danger" icon={<CheckCircleOutlined />} onClick={() => setIsCompleteModalVisible(true)}>
                    Mark as Completed
                </Button>
            )}

            {/* Danger Zone: Delete Project (Only for Owner) */}
            {isOwner && (
                <div className="mt-10 p-6 bg-red-50 border border-red-400 rounded-lg">
                    <Title level={4} type="danger">Caution!</Title>
                    <Text type="danger">Deleting this project is irreversible.</Text>
                    <Button danger icon={<DeleteOutlined />} className="mt-2" onClick={confirmDelete}>
                        Delete Project
                    </Button>
                </div>
            )}

            {/* Modal for Confirming Completion */}
                        <Modal
                            title="Confirm Completion"
                            open={isCompleteModalVisible}
                            onCancel={() => setIsCompleteModalVisible(false)}
                            onOk={async () => {
                                try {
                                    await dispatch(completeProject(projectId)).unwrap();
                                    message.success("Project marked as completed!");
                                    setIsCompleteModalVisible(false);
                                    navigate(`/member/new-artwork?fromProject=${projectId}`);
                                } catch (error) {
                                    message.error("Failed to mark project as completed.");
                                }
                            }}
                            okText="Yes, Mark as Completed"
                            okType="danger"
                        >
                            <p>Are you sure you want to mark this project as completed?</p>
                        </Modal>
        </div>
    );
};

export default ProjectDetails;
