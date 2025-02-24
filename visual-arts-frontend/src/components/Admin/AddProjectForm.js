import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProject } from "../../redux/slices/projectsSlice";
import { Form, Input, DatePicker, Select, Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import API from "../../services/api";
import "../../styles/custom-ant.css";


const { Option } = Select;

const AddProjectForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [preview, setPreview] = useState(null);

  // ✅ Handle Image Upload Preview
  const handleImageChange = (info) => {
    if (info.file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target.result);
        };
        reader.readAsDataURL(info.file);
    }
};

const handleSubmit = async (values) => {
  console.log("Submitting form with values:", values);

  try {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("start_date", values.start_date.format("YYYY-MM-DD"));
    formData.append("end_date", values.end_date.format("YYYY-MM-DD"));

    // Append image if uploaded
    if (values.image && values.image.file) {
      formData.append("image", values.image.file);
    }

    const response = await API.post("projects/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Project added:", response.data);
    message.success("Project added successfully!");
    form.resetFields();
    setPreview(null);
    onClose();
  } catch (error) {
    console.error("Error adding project:", error);
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
      {/* Image Upload */}
      <Form.Item
                label="Upload Image"
                name="image"
                rules={[{ required: true, message: "Please upload a project image" }]}
            >
                <Upload beforeUpload={() => false} onChange={handleImageChange} showUploadList={false}>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
                {preview && <img src={preview} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded" />}
            </Form.Item>
      <Form.Item label="Start Date" name="start_date" rules={[{ required: true }]}>
        <DatePicker />
      </Form.Item>
      <Form.Item label="End Date" name="end_date" rules={[{ required: true }]}>
        <DatePicker />
      </Form.Item>
      <Button className="add-artwork-btn" type="primary" htmlType="submit">Submit</Button>
    </Form>
  );
};

export default AddProjectForm;
