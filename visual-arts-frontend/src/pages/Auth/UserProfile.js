import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, updateProfile } from "../../redux/slices/profileSlice";
import { Form, Input, Button, Avatar, Upload, Card, Row, Col, Switch } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "../../styles/userprofile.css";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.profile) || {};
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState(user?.profile_picture || "/default-avatar.png");

  // ✅ Fetch user data when component loads
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // ✅ Pre-fill form when user data is available
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      });
      setProfilePicPreview(user.profile_picture || "/default-avatar.png");
    }
  }, [user, form]);

  // ✅ Handle Profile Update
  const handleUpdateProfile = async (values) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      await dispatch(updateProfile(formData)).unwrap();
      alert("Profile updated successfully!");
      setIsEditing(false); // Disable editing after successful update
    } catch (error) {
      alert("Profile update failed.");
    }
  };

  // ✅ Handle Profile Picture Change
  const handleFileChange = ({ file }) => {
    if (file) {
      setProfilePicPreview(URL.createObjectURL(file)); // Preview selected image
    }
  };

  return (
    <Card className="user-profile-card max-w-lg mx-auto mt-6 shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">My Profile</h2>

      {loading ? (
        <p>Loading profile...</p>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProfile}
        >
          {/* Profile Picture & Edit Toggle */}
          <Row align="middle" justify="center" className="mb-4">
            <Avatar size={80} src={profilePicPreview} />
          </Row>

          <Row justify="center">
            <Switch
              checked={isEditing}
              onChange={(checked) => setIsEditing(checked)}
              className="mb-4"
            />
            <span className="ml-2 text-gray-600">
              {isEditing ? "Editing Enabled" : "Editing Disabled"}
            </span>
          </Row>

          {/* Profile Picture Upload */}
          <Form.Item label="Profile Picture" name="profile_picture">
            <Upload beforeUpload={() => false} onChange={handleFileChange}>
              <Button icon={<UploadOutlined />} disabled={!isEditing}>
                Upload New Picture
              </Button>
            </Upload>
          </Form.Item>

          <Row gutter={16}>
            {/* Username */}
            <Col span={12}>
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Please enter your username" }]}
              >
                <Input disabled={!isEditing} />
              </Form.Item>
            </Col>

            {/* Email */}
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please enter your email" }]}
              >
                <Input disabled={!isEditing} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            {/* First Name */}
            <Col span={12}>
              <Form.Item label="First Name" name="first_name">
                <Input disabled={!isEditing} />
              </Form.Item>
            </Col>

            {/* Last Name */}
            <Col span={12}>
              <Form.Item label="Last Name" name="last_name">
                <Input disabled={!isEditing} />
              </Form.Item>
            </Col>
          </Row>

          {/* Password (Optional) */}
          <Form.Item label="New Password (optional)" name="password">
            <Input.Password disabled={!isEditing} />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button className="add-artwork-btn" type="primary" htmlType="submit" block disabled={!isEditing}>
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default UserProfile;
