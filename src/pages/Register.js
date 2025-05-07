import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Form,
  Input,
  Button,
  Card,
  Typography,
  Alert,
  Spin,
  Divider
} from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { loginSuccess } from '../store/authSlice';
import authApi from '../api/auth';

const { Title, Text } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setApiError(null);
      
      const response = await authApi.register({
        username: values.username,
        email: values.email,
        password: values.password
      });
      
      // Dispatch login action with the received token
      dispatch(loginSuccess({
        user: {
          _id: response.user_id,
          username: response.username,
          email: values.email,
          role: 'user'
        },
        token: response.token
      }));
      
      // Redirect to home page after successful registration
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      setApiError(error.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: 500,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
        bordered={false}
      >
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          Ro'yhatdan o'tish
        </Title>
        
        {apiError && (
          <Alert 
            message={apiError} 
            type="error" 
            showIcon
            style={{ marginBottom: 24 }}
            closable
            onClose={() => setApiError(null)}
          />
        )}
        
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          scrollToFirstError
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Ism"
            rules={[
              { required: true, message: 'Please input your username!' },
              { min: 3, message: 'Username must be at least 3 characters' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Ism" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Email" 
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
            hasFeedback
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Parol" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Parolni tasdiqlash"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Parolni tasdiqlash" 
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
            >
              Yuborish
            </Button>
          </Form.Item>
        </Form>

        <Divider>Yoki</Divider>
        
        <div style={{ textAlign: 'center' }}>
          <Text>
            Sizda allaqachon akkountingiz bormi?{' '}
            <Button 
              type="link" 
              onClick={() => navigate('/login')}
              style={{ padding: 0 }}
            >
              Kirish
            </Button>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Register;