import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Card,
  Typography,
  Spin,
  Alert,
  Divider,
  Button,
  Row,
  Col,
  Statistic,
  Tag
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  CrownOutlined, 
  CalendarOutlined,
  CheckCircleOutlined,
  StarOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5055';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
        localStorage.setItem('name', response.data.username);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch profile data');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {userData && (
        <>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Card>
                <Row align="middle" gutter={24}>
                  <Col>
                    <div style={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      backgroundColor: '#f0f2f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '40px'
                    }}>
                      {userData.username.charAt(0).toUpperCase()}
                    </div>
                  </Col>
                  <Col flex="auto">
                    <Title level={2} style={{ marginBottom: 0 }}>
                      {userData.username}
                    </Title>
                    <Tag icon={<CrownOutlined />} color="gold">
                      {userData.role}
                    </Tag>
                    <div style={{ marginTop: '8px' }}>
                      <Button 
                        type="primary" 
                        danger 
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                      >
                        Chiqish
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card title="Malumotlar">
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Text strong>
                      <MailOutlined style={{ marginRight: '8px' }} />
                      Email:
                    </Text>
                    <Text style={{ marginLeft: '8px' }}>
                      {userData.email || 'Not provided'}
                    </Text>
                  </Col>
                  <Col span={24}>
                    <Text strong>
                      <UserOutlined style={{ marginRight: '8px' }} />
                      Ism: 
                    </Text>
                    <Text style={{ marginLeft: '8px' }}>
                      {userData.username}
                    </Text>
                  </Col>
                  <Col span={24}>
                    <Text strong>
                      <CalendarOutlined style={{ marginRight: '8px' }} />
                      Biz bilan:
                    </Text>
                    <Text style={{ marginLeft: '8px' }}>
                      {moment(userData.created_at).format('MMMM Do YYYY')} dan beri
                    </Text>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card title="Muammoni hal qilish statistikasi">
                <Row gutter={[16, 24]}>
                  <Col span={24}>
                    <Statistic
                      title="Yechilgan masalalar soni:"
                      value={userData.solved_problems_count}
                      prefix={<CheckCircleOutlined />}
                    />
                  </Col>
                  <Col span={24}>
                    <Statistic
                      title="Umumiy ball"
                      value={userData.total_points}
                      prefix={<StarOutlined />}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          <Divider />

          <Card title="Activity">
            <Text type="secondary">Recent activity will appear here</Text>
            {/* You can add user activity timeline here */}
          </Card>
        </>
      )}
    </div>
  );
};

export default Profile;