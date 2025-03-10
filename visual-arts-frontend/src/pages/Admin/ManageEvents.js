import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEvents, removeEvent } from "../../redux/slices/eventsSlice";
import {
    Input,
    Button,
    Space,
    Modal,
    message,
    Select,
    Image,
    Spin,
    Tag,
    Table as AntTable,
    Card,
    Badge,
    Switch,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { FaCalendarAlt, FaCheckCircle, FaClock, FaPlusCircle } from "react-icons/fa";
import API from "../../services/api";
import AddEventForm from "../../components/Admin/AddEventForm";
import EditEventForm from "../../components/Admin/EditEventForm";
import "../../styles/custom-ant.css";

const { Option } = Select;

const ManageEvents = () => {
    const dispatch = useDispatch();
    const { events, loading } = useSelector((state) => state.events);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [pageSize, setPageSize] = useState(8);
    const [viewAsMember, setViewAsMember] = useState(false);

    useEffect(() => {
        dispatch(fetchAllEvents());
    }, [dispatch]);

    // Calculate stats from events
    const calculateStats = () => {
        const totalEvents = events.length;
        const completedEvents = events.filter((event) => event.is_completed).length;
        const upcomingEvents = events.filter((event) => !event.is_completed).length;

        return {
            totalEvents,
            completedEvents,
            upcomingEvents,
        };
    };

    const stats = calculateStats();

    const showModal = () => setIsModalVisible(true);
    const closeModal = () => {
        setIsModalVisible(false);
        setEditingEvent(null);
    };

    const showEditModal = (event) => {
        setEditingEvent(event);
        setIsEditModalVisible(true);
    };

    const closeEditModal = () => {
        setIsEditModalVisible(false);
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
                    dispatch(fetchAllEvents());
                } catch (error) {
                    message.error("Failed to delete event.");
                }
            },
        });
    };

    const editEvent = (event) => {
        setEditingEvent(event);
        showEditModal(event);
    };

    const handlePageSizeChange = (current, size) => {
        setPageSize(size);
    };

    const columns = [
        {
            title: "Cover",
            dataIndex: "event_cover",
            key: "event_cover",
            render: (event_cover) => <Image width={50} height={50} src={event_cover} />,
        },
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
                    <Button className="custom-edit-btn" icon={<EditOutlined />} onClick={() => editEvent(record)}>
                        Edit
                    </Button>
                    <Button icon={<DeleteOutlined />} danger onClick={() => deleteEvent(record.id)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const tableData = events.map((event) => ({
        key: event.id,
        name: event.title,
        date: event.date,
        location: event.location,
        is_completed: event.is_completed,
        event_cover: event.event_cover,
        id: event.id,
    }));

    let filteredTableData = tableData.filter((event) =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filterStatus !== null) {
        filteredTableData = filteredTableData.filter(
            (event) => event.is_completed === filterStatus
        );
    }

    return (
        <div className="p-6 space-y-8">
            <h2 className="text-black text-[22px] font-semibold font-[Poppins]">Manage Events</h2>
            <p className="text-green-500 text-sm font-[Poppins] mt-1">Event Management &gt; View & Manage</p>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-start">
                        <div className="relative w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-blue-100">
                            <span className="text-2xl text-blue-500">📅</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-600 text-sm leading-4">Total Events</p>
                            <p className="text-gray-400 text-xs leading-4">All Time</p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-2xl font-bold">{stats.totalEvents}</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-start">
                        <div className="relative w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-green-100">
                            <span className="text-2xl text-green-500">✅</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-600 text-sm leading-4">Completed Events</p>
                            <p className="text-gray-400 text-xs leading-4">Completed</p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-2xl font-bold">{stats.completedEvents}</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-start">
                        <div className="relative w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-orange-100">
                            <span className="text-2xl text-orange-500">⏳</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-600 text-sm leading-4">Upcoming Events</p>
                            <p className="text-gray-400 text-xs leading-4">Upcoming</p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-2xl font-bold">{stats.upcomingEvents}</p>
                    </div>
                </div>
            </div>

            {/* Add Event Modal */}
            <Modal
                title="Add New Event"
                visible={isModalVisible}
                onCancel={closeModal}
                footer={null}
            >
                <AddEventForm onClose={closeModal} />
            </Modal>

            {/* Edit Event Modal */}
            <Modal
                title="Edit Event"
                visible={isEditModalVisible}
                onCancel={closeEditModal}
                footer={null}
            >
                {editingEvent && <EditEventForm event={editingEvent} onClose={closeEditModal} />}
            </Modal>

            {/* Switch to toggle between Admin & Member View */}
            <div className="flex justify-end items-center space-x-2">
                <span className="text-gray-600">View as Member</span>
                <Switch checked={viewAsMember} onChange={() => setViewAsMember(!viewAsMember)} />
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white shadow-md rounded-2xl p-6">
                <div className="flex justify-between items-center pb-4">
                    <div className="flex gap-4">
                        <Input
                            placeholder="Search by event name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-40"
                            prefix={<SearchOutlined />}
                        />
                        <Button className="add-artwork-btn" type="primary" icon={<FaPlusCircle />} onClick={showModal}>
                            Add New Event
                        </Button>
                    </div>
                </div>

                {/* Conditionally Render View */}
                {viewAsMember ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredTableData.map((event) => (
                            <Badge.Ribbon
                                key={event.key}
                                text={event.is_completed ? "Completed" : "Pending"}
                                color={event.is_completed ? "green" : "orange"}
                            >
                                <Card
                                    hoverable
                                    cover={
                                        event.event_cover ? (
                                            <Image
                                                alt={event.name}
                                                src={event.event_cover}
                                                className="h-[200px] w-full object-cover rounded-lg"
                                            />
                                        ) : null
                                    }
                                    className="shadow-md transition duration-300 transform hover:scale-[1.02] cursor-pointer"
                                >
                                    <Card.Meta
                                        title={<span className="text-lg font-semibold text-black">{event.name}</span>}
                                        description={
                                            <div className="text-gray-500">
                                                <p>{event.date}</p>
                                                <p>{event.location}</p>
                                            </div>
                                        }
                                    />
                                </Card>
                            </Badge.Ribbon>
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <AntTable
                            columns={columns}
                            dataSource={filteredTableData}
                            loading={loading}
                            rowKey="key"
                            scroll={{ x: "max-content" }}
                            size="small"
                            pagination={{
                                pageSize: pageSize,
                                showSizeChanger: true,
                                pageSizeOptions: ["8", "10", "15", "30", "50"],
                                showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} items`,
                                onShowSizeChange: handlePageSizeChange,
                            }}
                        />
                    </div>
                )}

                {loading && <Spin size="large" />}
                {!loading && filteredTableData.length === 0 && <p>No events found.</p>}
            </div>
        </div>
    );
};

export default ManageEvents;