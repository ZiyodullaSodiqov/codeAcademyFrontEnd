import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../store/authSlice';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Alert, 
  Space,
  Layout,
  Row,
  Col,
  Divider 
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined,
  LoginOutlined,
  LoadingOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Content } = Layout;

const Login = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (values) => {
    const { username, password } = values;
    const result = await dispatch(loginUser(username, password));
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
          <Col xs={24} sm={20} md={16} lg={12} xl={8}>
            <Card
              title={
                <Space direction="vertical" align="center" style={{ width: '100%' }}>
                  <LoginOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
                  <Title level={3} style={{ margin: 0 }}>Kirish</Title>
                </Space>
              }
              bordered={false}
              style={{ 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px'
              }}
            >
              {error && (
                <Alert
                  message="Login Failed"
                  description={error}
                  type="error"
                  showIcon
                  closable
                  style={{ marginBottom: '24px' }}
                />
              )}

              <Form
                form={form}
                name="login-form"
                initialValues={{ remember: true }}
                onFinish={handleSubmit}
                layout="vertical"
              >
                <Form.Item
                  name="username"
                  label="Ism"
                  rules={[
                    { required: true, message: 'Please input your username!' },
                    { min: 4, message: 'Username must be at least 4 characters' }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="Ismingizni kiriting" 
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Parol"
                  rules={[
                    { required: true, message: 'Please input your password!' },
                    { min: 6, message: 'Password must be at least 6 characters' }
                  ]}
                >
                  <Input.Password 
                    prefix={<LockOutlined />} 
                    placeholder="Parolingizni kiriting" 
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={loading}
                    icon={loading ? <LoadingOutlined /> : <LoginOutlined />}
                  >
                    {loading ? 'Kirilmoqda...' : 'Kirish'}
                  </Button>
                </Form.Item>

                <Divider>Yoki</Divider>

                <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                  <Text>
                    Hisobingz yo'qmi?{' '}
                    <Button 
                      type="link" 
                      onClick={() => navigate('/register')}
                      style={{ padding: 0 }}
                    >
                      Hoziroq ro'yhatdan o'tish
                    </Button>
                  </Text>
                </Space>
              </Form>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Login;