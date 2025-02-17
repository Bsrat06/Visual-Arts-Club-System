import React, { useState } from "react";
import { Form, Input, Upload, Select, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addArtwork } from "../../redux/slices/artworkSlice";
import { UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const AddArtworkForm = ({ onArtworkAdded }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const user = useSelector((state) => state.auth.user);
  const [preview, setPreview] = useState(null);

  // ✅ Handle Image Upload Preview
  const handleImageChange = (info) => {
    if (info.file.status === "done") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  // ✅ Handle Form Submission
  const onFinish = async (values) => {
    try {
      if (!user) {
        message.error("You must be logged in to submit artwork.");
        return;
      }

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("artist", user.pk);
      if (values.image.file.originFileObj) {
        formData.append("image", values.image.file.originFileObj);
      }

      console.log("Submitting Artwork Data:", Object.fromEntries(formData.entries()));

      dispatch(addArtwork(formData));
      message.success("Artwork added successfully! 🎨");

      // ✅ Reset form and clear preview
      form.resetFields();
      setPreview(null);
      onArtworkAdded();
    } catch (error) {
      message.error("Failed to add artwork. Please try again.");
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      {/* Title */}
      <Form.Item
        label="Artwork Title"
        name="title"
        rules={[{ required: true, message: "Artwork title is required" }]}
      >
        <Input placeholder="Enter artwork title" />
      </Form.Item>

      {/* Description */}
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Description is required" }]}
      >
        <TextArea rows={3} placeholder="Enter artwork description" />
      </Form.Item>

      {/* Category Selection */}
      <Form.Item
        label="Category"
        name="category"
        rules={[{ required: true, message: "Please select a category" }]}
      >
        <Select placeholder="Select artwork category">
          <Option value="sketch">Sketch</Option>
          <Option value="canvas">Canvas</Option>
          <Option value="wallart">Wall Art</Option>
          <Option value="digital">Digital</Option>
          <Option value="photography">Photography</Option>
        </Select>
      </Form.Item>

      {/* Image Upload */}
      <Form.Item
        label="Upload Artwork"
        name="image"
        rules={[{ required: true, message: "Please upload an artwork image" }]}
      >
        <Upload
          beforeUpload={() => false} // Prevent auto-upload
          onChange={handleImageChange}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
        {preview && <img src={preview} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded" />}
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Submit Artwork
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddArtworkForm;
