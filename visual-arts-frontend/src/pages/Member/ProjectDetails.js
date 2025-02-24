import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectDetails, addProjectUpdate, completeProject } from "../../redux/slices/projectsSlice";
import { Card, Steps, Form, Input, Button, Upload, message, Spin, Modal } from "antd";
import { UploadOutlined, CheckCircleOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const ProjectDetails = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedProject, loading } = useSelector((state) => state.projects);
    const user = useSelector((state) => state.auth.user);

    const [form] = Form.useForm();
    const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);

    useEffect(() => {
        dispatch(fetchProjectDetails(projectId));
    }, [dispatch, projectId]);

    const handleAddUpdate = async (values) => {
        const formData = new FormData();
        formData.append("description", values.description);
        if (values.image?.file.originFileObj) {
            formData.append("image", values.image.file.originFileObj);
        }
        formData.append("project", projectId);

        try {
            await dispatch(addProjectUpdate({ projectId, data: formData })).unwrap();
            message.success("Progress update added successfully!");
            form.resetFields();
        } catch (error) {
            message.error("Failed to add progress update.");
        }
    };

    const handleCompleteProject = async () => {
        try {
            await dispatch(completeProject(projectId)).unwrap();
            message.success("Project marked as completed!");
            setIsCompleteModalVisible(false);
            navigate(`/member/new-artwork?fromProject=${projectId}`);
        } catch (error) {
            message.error("Failed to mark project as completed.");
        }
    };

    if (loading || !selectedProject) {
        return <Spin size="large" className="flex justify-center mt-10" />;
    }

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

            {!selectedProject.is_completed && (
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

            <Modal
                title="Confirm Completion"
                visible={isCompleteModalVisible}
                onCancel={() => setIsCompleteModalVisible(false)}
                onOk={handleCompleteProject}
                okText="Yes, Mark as Completed"
                okType="danger"
            >
                <p>Are you sure you want to mark this project as completed?</p>
            </Modal>
        </div>
    );
};

export default ProjectDetails;
