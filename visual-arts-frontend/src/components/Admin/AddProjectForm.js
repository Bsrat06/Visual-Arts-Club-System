import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProject } from "../../redux/slices/projectsSlice";
import { Form, Input, DatePicker, Select, Button, message } from "antd";
import API from "../../services/api";

const { Option } = Select;

const AddProjectForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      const response = await API.get("users/");
      const userMap = {};
      response.data.results.forEach((user) => {
        userMap[user.email] = user.pk;
      });

      const memberIds = values.members.split(",").map((email) => userMap[email.trim()]).filter(Boolean);

      const projectData = {
        title: values.title,
        description: values.description,
        start_date: values.start_date.format("YYYY-MM-DD"),
        end_date: values.end_date.format("YYYY-MM-DD"),
        members: memberIds,
      };

      await dispatch(addProject(projectData));
      message.success("Project added successfully!");
      form.resetFields();
      onClose();
    } catch (error) {
      message.error("Failed to add project.");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Project Title" name="title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Description" name="description" rules={[{ required: true }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Start Date" name="start_date" rules={[{ required: true }]}>
        <DatePicker />
      </Form.Item>
      <Form.Item label="End Date" name="end_date" rules={[{ required: true }]}>
        <DatePicker />
      </Form.Item>
      <Button type="primary" htmlType="submit">Submit</Button>
    </Form>
  );
};

export default AddProjectForm;
