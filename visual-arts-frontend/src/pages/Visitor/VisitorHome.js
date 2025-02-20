import React from "react";
import { Button, Typography, Layout, Row, Col, Card } from "antd";
import { Link } from "react-router-dom";
import { PictureOutlined, CalendarOutlined, TeamOutlined } from "@ant-design/icons";
import "../../styles/landing-page.css"; // Custom styles for extra design

const { Title, Text } = Typography;
const { Content } = Layout;

const VisitorHome = () => {
  return (
    <Layout className="visitor-home">
      {/* ✅ Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <Title level={1} className="text-white text-center font-bold">
            Welcome to Visual Arts Platform
          </Title>
          <Text className="text-lg text-white text-center">
            Explore our gallery, events, and projects. Join us to showcase your talent.
          </Text>

          <div className="flex space-x-4 mt-6">
            <Link to="/gallery">
              <Button type="default" className="explore-btn">
                Explore Gallery
              </Button>
            </Link>
            <Link to="/register">
              <Button type="primary" className="join-btn">
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ✅ Explore Sections */}
      <Content className="p-8">
        <Row gutter={[24, 24]} justify="center">
          {/* ✅ Gallery Section */}
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              className="feature-card"
              cover={<div className="feature-icon"><PictureOutlined /></div>}
            >
              <Title level={3} className="text-center">Gallery</Title>
              <Text className="text-gray-600 text-center block">
                Discover stunning artworks from talented artists worldwide.
              </Text>
              <Link to="/gallery">
                <Button className="feature-btn" type="primary" block>
                  View Gallery
                </Button>
              </Link>
            </Card>
          </Col>

          {/* ✅ Events Section */}
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              className="feature-card"
              cover={<div className="feature-icon"><CalendarOutlined /></div>}
            >
              <Title level={3} className="text-center">Events</Title>
              <Text className="text-gray-600 text-center block">
                Stay updated with the latest art events and exhibitions.
              </Text>
              <Link to="/events">
                <Button className="feature-btn" type="primary" block>
                  Explore Events
                </Button>
              </Link>
            </Card>
          </Col>

          {/* ✅ Community Section */}
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              className="feature-card"
              cover={<div className="feature-icon"><TeamOutlined /></div>}
            >
              <Title level={3} className="text-center">Community</Title>
              <Text className="text-gray-600 text-center block">
                Connect with artists, collaborate, and grow together.
              </Text>
              <Link to="/community">
                <Button className="feature-btn" type="primary" block>
                  Join Community
                </Button>
              </Link>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default VisitorHome;
