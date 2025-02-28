import React, { useState } from "react";
import { Form, Input, Button, Upload, message, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { addArtwork } from "../../redux/slices/artworkSlice";

const { TextArea } = Input;
const { Option } = Select;

const AddArtworkForm = ({ onArtworkAdded }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [fileList, setFileList] = useState([]); // State to hold the uploaded file
    const [loading, setLoading] = useState(false);

    // Handle file upload
    const handleFileChange = ({ fileList }) => {
        setFileList(fileList); // Update the file list when a file is selected
    };

    // Handle form submission
    const onFinish = async (values) => {
        try {
            setLoading(true);

            // Create a FormData object
            const formData = new FormData();

            // Append all form values to FormData
            for (const key in values) {
                formData.append(key, values[key]);
            }

            // Append the image file to FormData
            if (fileList.length > 0) {
                formData.append("image", fileList[0].originFileObj); // Append the actual file
            }

            // Dispatch the addArtwork action
            await dispatch(addArtwork(formData)).unwrap();

            // Show success message
            message.success("Artwork added successfully! 🎨");

            // Reset the form and close the modal
            form.resetFields();
            setFileList([]);
            onArtworkAdded();
        } catch (error) {
            message.error("Failed to add artwork. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form form={form} onFinish={onFinish} layout="vertical">
            {/* Title */}
            <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: "Please enter the title of the artwork!" }]}
            >
                <Input placeholder="Enter artwork title" />
            </Form.Item>

            {/* Description */}
            <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: "Please enter a description!" }]}
            >
                <TextArea rows={4} placeholder="Enter artwork description" />
            </Form.Item>

            {/* Category */}
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
                name="image"
                label="Artwork Image"
                rules={[{ required: true, message: "Please upload an image!" }]}
            >
                <Upload
                    fileList={fileList}
                    onChange={handleFileChange}
                    beforeUpload={() => false} // Prevent automatic upload
                    maxCount={1} // Allow only one file
                >
                    <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
                <Button className="add-artwork-btn" type="primary" htmlType="submit" block>
                    Submit Artwork
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AddArtworkForm;