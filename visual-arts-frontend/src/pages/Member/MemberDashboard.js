import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../redux/slices/projectsSlice";
import { fetchAllEvents } from "../../redux/slices/eventsSlice";
import { fetchNotifications } from "../../redux/slices/notificationsSlice";
import { fetchMemberStats } from "../../redux/slices/memberStatsSlice";
import { Card, List, Typography, Badge, Space, Row, Col } from "antd";
import { CheckCircleOutlined, NotificationOutlined, ProjectOutlined, CalendarOutlined } from "@ant-design/icons";

const { Title } = Typography;

const MemberDashboard = () => {
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.projects);
  const { events } = useSelector((state) => state.events);
  const { notifications } = useSelector((state) => state.notifications);
  const { stats, loading: statsLoading } = useSelector((state) => state.memberStats);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchAllEvents());
    dispatch(fetchNotifications());
    dispatch(fetchMemberStats());
  }, [dispatch]);

  const unreadNotifications = notifications.filter((notification) => !notification.read);

  return (
    <div className="p-6">
      <Title level={2} className="mb-6">Member Dashboard</Title>

      {/* ✅ Overview Section */}
      <Row gutter={16} className="mb-6">
        <Col xs={24} sm={12} lg={8}>
          <Card title="Total Artworks" bordered={false}>
            <Space>
              <CheckCircleOutlined style={{ fontSize: 24, color: "#1890ff" }} />
              <span>{stats?.total_artworks || 0}</span>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card title="Approval Rate" bordered={false}>
            <Space>
              <CheckCircleOutlined style={{ fontSize: 24, color: "#52c41a" }} />
              <span>{`${stats?.approval_rate || 0}%`}</span>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card title="Pending Notifications" bordered={false}>
            <Space>
              <Badge count={unreadNotifications.length} overflowCount={99} offset={[10, 0]}>
                <NotificationOutlined style={{ fontSize: 24, color: "#faad14" }} />
              </Badge>
              <span>{unreadNotifications.length}</span>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* ✅ Projects Section */}
      <Title level={4} className="mt-6">Ongoing Projects</Title>
      <List
        bordered
        dataSource={projects}
        renderItem={(project) => (
          <List.Item>
            <ProjectOutlined style={{ marginRight: 8, color: "#1890ff" }} />
            {project.title}
          </List.Item>
        )}
      />

      {/* ✅ Events Section */}
      <Title level={4} className="mt-6">Upcoming Events</Title>
      <List
        bordered
        dataSource={events}
        renderItem={(event) => (
          <List.Item>
            <CalendarOutlined style={{ marginRight: 8, color: "#faad14" }} />
            {event.name} - {event.date}
          </List.Item>
        )}
      />
    </div>
  );
};

export default MemberDashboard;
