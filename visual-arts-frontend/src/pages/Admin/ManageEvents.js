import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents, removeEvent } from "../../redux/slices/eventsSlice";
import API from "../../services/api";
import { Card, Table, Button, Space, Modal, Spin, Alert, Typography, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AddEventForm from "../../components/Admin/AddEventForm";
import EditEventForm from "../../components/Admin/EditEventForm";

const { Title } = Typography;

const ManageEvents = () => {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);

  const [editingEvent, setEditingEvent] = useState(null);
  const [eventStats, setEventStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const [isAddEventModalVisible, setIsAddEventModalVisible] = useState(false);
  const [isEditEventModalVisible, setIsEditEventModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchEvents());
    fetchEventStats();
  }, [dispatch]);

  const fetchEventStats = async () => {
    try {
      const response = await API.get("/event-stats/");
      setEventStats(response.data);
      setStatsLoading(false);
    } catch (err) {
      setStatsError(err.response?.data || "Failed to load event statistics.");
      setStatsLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setIsEditEventModalVisible(true);
  };

  const handleDelete = (eventId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this event?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => dispatch(removeEvent(eventId)),
    });
  };

  // ✅ Handle Event Creation Success
  const handleEventAdded = () => {
    setIsAddEventModalVisible(false);
    message.success("Event added successfully! 🎉");
    dispatch(fetchEvents()); // Refresh events list
    fetchEventStats(); // Refresh stats
  };

  return (
    <div className="p-6">
      {/* ✅ Page Title */}
      <Title level={2}>Manage Events</Title>

      {/* ✅ Event Statistics */}
      <Title level={4} className="mt-4">Event Statistics</Title>
      {statsLoading ? (
        <Spin size="large" />
      ) : statsError ? (
        <Alert message={statsError} type="error" showIcon />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card title="Total Events" variant className="shadow-lg">
            <Title level={3}>{eventStats.total_events}</Title>
          </Card>
          <Card title="Completed Events" variant className="shadow-lg">
            <Title level={3}>{eventStats.completed_events}</Title>
          </Card>
          <Card title="Upcoming Events" variant className="shadow-lg">
            <Title level={3}>{eventStats.upcoming_events}</Title>
          </Card>
        </div>
      )}

      {/* ✅ Add Event Button */}
      <Space className="my-4">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddEventModalVisible(true)}>
          Add Event
        </Button>
      </Space>

      {/* ✅ Events Table */}
      <Title level={4} className="mt-4">Events List</Title>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <Table
          dataSource={events}
          rowKey="id"
          variant
          pagination={{ pageSize: 5 }}
        >
          <Table.Column title="Name" dataIndex="name" key="name" />
          <Table.Column title="Date" dataIndex="date" key="date" />
          <Table.Column title="Location" dataIndex="location" key="location" />
          <Table.Column title="Status" dataIndex="status" key="status" />
          <Table.Column
            title="Actions"
            key="actions"
            render={(text, record) => (
              <Space>
                <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
              </Space>
            )}
          />
        </Table>
      )}

      {/* ✅ Add Event Modal */}
      <Modal
        title="Add New Event"
        open={isAddEventModalVisible}
        footer={null}
        onCancel={() => setIsAddEventModalVisible(false)}
      >
        <AddEventForm onEventAdded={handleEventAdded} />
      </Modal>

      {/* ✅ Edit Event Modal */}
      <Modal
        title="Edit Event"
        open={isEditEventModalVisible}
        footer={null}
        onCancel={() => setIsEditEventModalVisible(false)}
      >
        <EditEventForm event={editingEvent} onClose={() => setIsEditEventModalVisible(false)} />
      </Modal>
    </div>
  );
};

export default ManageEvents;
