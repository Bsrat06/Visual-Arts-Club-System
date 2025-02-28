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
    Table as AntTable, // Renamed to avoid conflicts
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { FaCalendarAlt, FaCheckCircle, FaClock } from "react-icons/fa";
import API from "../../services/api";
import AddEventForm from "../../components/Admin/AddEventForm";
import EditEventForm from "../../components/Admin/EditEventForm"; // Import the EditEventForm
import "../../styles/custom-ant.css";

const { Option } = Select;

const ManageEvents = () => {
    const dispatch = useDispatch();
    const { events, loading } = useSelector((state) => state.events);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false); // State for edit modal
    const [editingEvent, setEditingEvent] = useState(null); // State to hold the event being edited
    const [eventStats, setEventStats] = useState({});
    const [statsLoading, setStatsLoading] = useState(true);
    const [pageSize, setPageSize] = useState(8); // Added to manage page size

    useEffect(() => {
        dispatch(fetchAllEvents());
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

    const showEditModal = (event) => {
        setEditingEvent(event); // Set the event to be edited
        setIsEditModalVisible(true); // Open the edit modal
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
        showEditModal(event); // Open the edit modal
    };

    const handlePageSizeChange = (current, size) => {
        setPageSize(size); // Update pageSize state when the user changes the page size
    };

    const statistics = [
        {
            title: "Total Events",
            value: eventStats.total_events || 0,
            icon: <FaCalendarAlt className="text-[#FFA500] text-4xl" />,
        },
        {
            title: "Completed Events",
            value: eventStats.completed_events || 0,
            icon: <FaCheckCircle className="text-[#FFA500] text-4xl" />,
        },
        {
            title: "Upcoming Events",
            value: eventStats.upcoming_events || 0,
            icon: <FaClock className="text-[#FFA500] text-4xl" />,
        },
    ];

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
            <p className="text-green-500 text-sm font-[Poppins] mt-1">Event Management &gt; View & Manage</p>

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

            {/* ... (rest of your component) */}
            <div className="bg-white shadow-md rounded-2xl p-6">
                <div className="flex justify-between items-center pb-4">
                    <div className="flex items-center gap-4">
                        <h2>All Events</h2>
                        <Input
                            placeholder="Search by event name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-40"
                        />
                    </div>
                    <div className="flex gap-4">
                        <Select
                            placeholder="Filter by status"
                            onChange={(value) => setFilterStatus(value)}
                            allowClear
                        >
                            <Option value={true}>Completed</Option>
                            <Option value={false}>Pending</Option>
                        </Select>
                        <Button className="add-artwork-btn" type="primary" icon={<PlusOutlined />} onClick={showModal}>
                            Add Event
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <Spin size="large" />
                ) : filteredTableData.length > 0 ? (
                    <div className="overflow-x-auto"> {/* Added this wrapper */}
                        <AntTable
                            columns={columns}
                            dataSource={filteredTableData}
                            loading={loading}
                            rowKey="key"
                            scroll={{ x: "max-content" }} // Enable horizontal scroll
                            size="small" // Added for smaller padding
                            pagination={{
                                pageSize: pageSize, // Use pageSize state
                                showSizeChanger: true, // Enable page size changer
                                pageSizeOptions: ["8", "10", "15", "30", "50"], // Options for rows per page
                                showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} items`, // Show total items
                                onShowSizeChange: handlePageSizeChange, // Handle page size change
                            }}
                        />
                    </div>
                ) : (
                    <p>No events found.</p>
                )}
            </div>
        </div>
    );
};

export default ManageEvents;