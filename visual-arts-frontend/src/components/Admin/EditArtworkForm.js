import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editArtwork } from "../../redux/slices/artworkSlice";
import { Form, Input, Upload, Select, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "../../styles/custom-ant.css";

const { TextArea } = Input;
const { Option } = Select;

const EditArtworkForm = ({ artwork, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const user = useSelector((state) => state.auth.user);

    const [previewImage, setPreviewImage] = useState(artwork?.image || null);

    useEffect(() => {
        if (artwork) {
            form.setFieldsValue({
                title: artwork.title,
                description: artwork.description,
                category: artwork.category,
            });
            setPreviewImage(artwork.image);
        }
    }, [artwork, form]);

    // ✅ Handle Image Upload Preview
    const handleImageChange = (info) => {
        if (info.file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(info.file);
        }
    };

    // ✅ Handle Form Submission
    const onFinish = async (values) => {
        try {
            if (!user) {
                message.error("You must be logged in to update artwork.");
                return;
            }

            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("category", values.category);
            formData.append("artist", user.pk);

            if (values.image?.file?.originFileObj) {
                formData.append("image", values.image.file.originFileObj);
            }

            console.log("Updating Artwork ID:", artwork.id);
            console.log("Data being sent:", Object.fromEntries(formData.entries()));

            await dispatch(editArtwork({ id: artwork.id, data: formData })).unwrap();
            message.success("Artwork updated successfully!");
            onClose();
        } catch (error) {
            message.error("Failed to update artwork. Please try again.");
        }
    };

    return (
        <Form layout="vertical" form={form} onFinish={onFinish}>
            {/* Title */}
            <Form.Item
                label="Artwork Title"
                name="title"
                rules={[{ required: true, message: "Title is required" }]}
            >
                <Input />
            </Form.Item>

            {/* Description */}
            <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: "Description is required" }]}
            >
                <TextArea rows={3} />
            </Form.Item>

            {/* Category */}
            <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: "Please select a category" }]}
            >
                <Select>
                    <Option value="sketch">Sketch</Option>
                    <Option value="canvas">Canvas</Option>
                    <Option value="wallart">Wall Art</Option>
                    <Option value="digital">Digital</Option>
                    <Option value="photography">Photography</Option>
                </Select>
            </Form.Item>

            {/* Image Upload */}
            <Form.Item label="Upload New Artwork" name="image">
                <Upload beforeUpload={() => false} onChange={handleImageChange} showUploadList={false}>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
                {previewImage && (
                    <img src={previewImage} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded" />
                )}
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
                <Button className="add-artwork-btn" type="primary" htmlType="submit" block>
                    Save Changes
                </Button>
            </Form.Item>
        </Form>
    );
};

export default EditArtworkForm;
