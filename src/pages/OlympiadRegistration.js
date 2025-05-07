import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Typography, 
  Button, 
  Alert, 
  Space, 
  Spin 
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5055/api';

const OlympiadRegistration = () => {
  const { olympiad_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getAuthToken = () => {
    try {
      // Token should be stored as raw string, not JSON
      const token = localStorage.getItem('token');
      return token || null;
    } catch (err) {
      console.error('Failed to get auth token:', err);
      return null;
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = getAuthToken();
      if (!token) {
        toast.info('Please login to register');
        // Pass current location to redirect back after login
        navigate('/login', { state: { from: `/olympiads/${olympiad_id}/register` } });
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/olympiads/${olympiad_id}/register`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true // Include if using cookies/sessions
        }
      );

      toast.success(response.data.message);
      navigate(`/olympiads/${olympiad_id}`);
    } catch (err) {
      let errorMsg = 'Registration failed. Please try again.';
      
      if (err.response) {
        if (err.response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          errorMsg = 'Session expired. Please login again.';
          navigate('/login', { state: { from: `/olympiads/${olympiad_id}/register` } });
        } else {
          errorMsg = err.response.data?.error || err.response.statusText;
        }
      } else if (err.request) {
        errorMsg = 'No response from server. Please check your connection.';
      } else {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>Olimpiada Ro‘yxatdan O‘tish</Title>
        <Text>Bu olimpiadaga ro‘yxatdan o‘tmoqchimisiz?</Text>

        {error && (
          <Alert
            message="Nimadur xato bo'ldi"
            description={error}
            type="warning"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}

        <Space size="middle">
          <Button
            type="primary"
            size="large"
            onClick={handleRegister}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Ro‘yxatdan o‘tmoqda...' : 'Ro‘yxatdan O‘tishni Tasdiqlash'}
          </Button>
          <Button
            size="large"
            onClick={() => navigate(-1)}
            disabled={loading}
            icon={<ArrowLeftOutlined />}
          >
            Bekor Qilish
          </Button>
        </Space>
      </Space>
    </div>
  );
};

export default OlympiadRegistration;