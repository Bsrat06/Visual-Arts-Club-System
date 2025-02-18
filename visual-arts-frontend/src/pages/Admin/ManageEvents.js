import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents, removeEvent } from "../../redux/slices/eventsSlice";
import { Input, Button, Space, Modal, message, Select, Card, Spin, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AddEventForm from "../../components/Admin/AddEventForm";
import Table from "../../components/Shared/Table";
import API from "../../services/api";

const { Option } = Select;

const ManageEvents = () => {
    const dispatch = useDispatch();
    const { events, loading } = useSelector((state) => state.events);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [eventStats, setEventStats] = useState({});
    const [statsLoading, setStatsLoading] = useState(true);

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
            message.error("Failed to load event statistics.");
            setStatsLoading(false);
        }
    };

    const showModal = () => setIsModalVisible(true);
    const closeModal = () => {
        setIsModalVisible(false);
        setEditingEvent(null);
    };

    const deleteEvent = (id) => {
        Modal.confirm({
            title: "Are you sure you want to delete this event?",
            okText: "Yes, Delete",
            okType: "danger",
            onOk: async () => {
                try {
                    await dispatch(removeEvent(id));
                    message.success("Event deleted successfully!");
                    dispatch(fetchEvents());
                } catch (error) {
                    message.error("Failed to delete event.");
                }
            },
        });
    };

    const editEvent = (event) => {
        setEditingEvent(event);
        showModal();
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
        },
        {
            title: "Location",
            dataIndex: "location",
            key: "location",
        },
        {
            title: "Status",
            dataIndex: "is_completed",
            key: "is_completed",
            filters: [
                { text: "Completed", value: true },
                { text: "Pending", value: false },
            ],
            filteredValue: filterStatus !== "" ? [filterStatus === "completed"] : null,
            onFilter: (value, record) => record.is_completed === value,
            render: (is_completed) => (
                <Tag color={is_completed ? "green" : "orange"}>
                    {is_completed ? "COMPLETED" : "PENDING"}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => editEvent(record)}>Edit</Button>
                    <Button icon={<DeleteOutlined />} danger onClick={() => deleteEvent(record.id)}>Delete</Button>
                </Space>
            ),
        },
    ];

    const tableData = events
        .filter((event) => event.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((event) => ({
            key: event.id,
            name: event.title,
            date: event.date,
            location: event.location,
            is_completed: event.is_completed,
        }));

    return (
        <div className="p-6">
            <h2 className="text-black text-[22px] font-semibold font-[Poppins]">Manage Events</h2>
            <p className="text-green-500 text-sm font-[Poppins] mt-1">Events &gt; Review & Manage</p>

            {statsLoading ? (
                <Spin size="large" />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                    <Card title="Total Events">{eventStats.total_events}</Card>
                    <Card title="Completed Events">{eventStats.completed_events}</Card>
                    <Card title="Upcoming Events">{eventStats.upcoming_events}</Card>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:justify-between items-center pb-4">
                    <div className="flex gap-4">
                    <h2 className="text-black text-[22px] font-semibold font-[Poppins]">All Events</h2>
                        <Input
                            placeholder="Search by event name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-40"
                        />
                        <Select
                            placeholder="Filter by status"
                            onChange={(value) => setFilterStatus(value)}
                            className="w-40"
                            allowClear
                        >
                            <Option value="completed">Completed</Option>
                            <Option value="pending">Pending</Option>
                        </Select>
                    </div>
                    <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                        Add Event
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={tableData}
                    pagination={{ pageSize: 8 }}
                    loading={loading}
                    bordered
                    rowKey="key"
                />
            </div>

            <Modal
                title={editingEvent ? "Edit Event" : "Add New Event"}
                open={isModalVisible}
                onCancel={closeModal}
                footer={null}
            >
                <AddEventForm event={editingEvent} onClose={closeModal} />
            </Modal>
        </div>
    );
};

export default ManageEvents;
