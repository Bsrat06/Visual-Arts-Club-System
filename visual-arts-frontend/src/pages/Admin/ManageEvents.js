import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents, removeEvent } from "../../redux/slices/eventsSlice";
import {
    Input,
    Button,
    Space,
    Modal,
    message,
    Select,
    Card,
    Spin,
    Tag,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { FaCalendarAlt, FaCheckCircle, FaClock } from "react-icons/fa";
import AddEventForm from "../../components/Admin/AddEventForm";
import Table from "../../components/Shared/Table";
import API from "../../services/api";
import "../../styles/custom-ant.css";

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
            filteredValue: filterStatus !== "" ? [filterStatus === "is_completed"] : null,
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
                    <Button
                        className="custom-edit-btn"
                        icon={<EditOutlined />}
                        onClick={() => editEvent(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => deleteEvent(record.id)}
                    >
                        Delete
                    </Button>
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
        <div className="p-6 space-y-8">
            <h2 className="text-black text-[22px] font-semibold font-[Poppins]">
                Manage Events
            </h2>
            <p className="text-green-500 text-sm font-[Poppins] mt-1">
                Events &gt; Review & Manage
            </p>

            {/* ✅ Enhanced Statistics Container */}
            <div className="bg-white rounded-2xl shadow-[0px_10px_60px_0px_rgba(226,236,249,0.5)] p-8 flex items-center justify-between mb-6">
                {statsLoading ? (
                    <Spin size="large" />
                ) : (
                    statistics.map((stat, index) => (
                        <div key={index} className="flex items-start space-x-6">
                            {/* Background Circle Icon */}
                            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#FFA5001F]">
                                {stat.icon}
                            </div>

                            {/* Value & Title */}
                            <div className="text-left">
                                <p className="text-[#ACACAC] text-[14px] font-[Poppins]">
                                    {stat.title}
                                </p>
                                <p className="text-[#333333] text-[34px] font-semibold font-[Poppins]">
                                    {stat.value}
                                </p>
                            </div>

                            {/* Separator (except for last item) */}
                            {index < statistics.length - 1 && (
                                <div className="h-16 w-[1px] bg-[#F0F0F0] mx-8"></div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* ✅ Enhanced Events List */}
            <div className="bg-white shadow-md rounded-2xl p-6">
                <div className="flex flex-col md:flex-row md:justify-between items-center pb-4">
                    <div className="flex gap-4">
                        <h2 className="text-black text-[22px] font-semibold font-[Poppins]">
                            All Events
                        </h2>
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
                    <Button className="add-artwork-btn"type="primary" icon={<PlusOutlined />} onClick={showModal}>
                        Add Event
                    </Button>
                </div>

                <Table columns={columns} dataSource={tableData} pagination={{ pageSize: 8 }} loading={loading} rowKey="key" />
            </div>

            <Modal title={editingEvent ? "Edit Event" : "Add New Event"} open={isModalVisible} onCancel={closeModal} footer={null}>
                <AddEventForm event={editingEvent} onClose={closeModal} />
            </Modal>
        </div>
    );
};

export default ManageEvents;
