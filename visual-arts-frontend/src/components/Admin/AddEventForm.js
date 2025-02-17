import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, Button, Select, message } from "antd";
import { useDispatch } from "react-redux";
import { addEvent } from "../../redux/slices/eventsSlice";
import API from "../../services/api";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

const AddEventForm = ({ onEventAdded }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // ✅ Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await API.get("users/");
        setUsers(response.data.results || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // ✅ Handle form submission
  const onFinish = async (values) => {
    try {
      const eventData = {
        ...values,
        date: values.date.format("YYYY-MM-DD"), // ✅ Ensure correct date format
      };

      console.log("Submitting Event Data:", eventData);
      dispatch(addEvent(eventData));
      message.success("Event added successfully! 🎉");

      // ✅ Reset form & notify parent component
      form.resetFields();
      onEventAdded();
    } catch (error) {
      message.error("Failed to add event. Please try again.");
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      {/* Title */}
      <Form.Item
        label="Event Title"
        name="title"
        rules={[{ required: true, message: "Event title is required" }]}
      >
        <Input placeholder="Enter event title" />
      </Form.Item>

      {/* Description */}
      <Form.Item
        label="Event Description"
        name="description"
        rules={[{ required: true, message: "Description is required" }]}
      >
        <TextArea rows={3} placeholder="Enter event description" />
      </Form.Item>

      {/* Location */}
      <Form.Item
        label="Location"
        name="location"
        rules={[{ required: true, message: "Location is required" }]}
      >
        <Input placeholder="Enter event location" />
      </Form.Item>

      {/* Date Picker */}
      <Form.Item
        label="Event Date"
        name="date"
        rules={[{ required: true, message: "Please select a date" }]}
      >
        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
      </Form.Item>

      {/* Attendees (Select Users) */}
      <Form.Item label="Attendees" name="attendees">
        <Select
          mode="multiple"
          placeholder="Select attendees"
          loading={loadingUsers}
          allowClear
        >
          {users.map((user) => (
            <Option key={user.pk} value={user.pk}>
              {user.first_name} {user.last_name} ({user.email})
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Add Event
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddEventForm;
