import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Card, 
  Typography, 
  Space, 
  Spin, 
  Alert, 
  Button, 
  Tag,
  Row,
  Col,
  Divider
} from 'antd';
import { 
  CalendarOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;

const OlympiadList = () => {
  const [olympiads, setOlympiads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOlympiads = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5055/api/olympiads');
        
        
        const olympiadsWithStatus = response.data.map(olympiad => {
          const now = moment();
          const startTime = moment(olympiad.start_time?.$date );
          const endTime = moment(olympiad.end_time?.$date);
          
          let status = 'upcoming';
          let statusColor = 'blue';
          let statusIcon = <ClockCircleOutlined />;
          
          if (now.isBefore(startTime)) {
            status = 'upcoming';
            statusColor = 'blue';
            statusIcon = <ClockCircleOutlined />;
          } else if (now.isSameOrAfter(startTime) && now.isSameOrBefore(endTime)) {
            status = 'ongoing';
            statusColor = 'green';
            statusIcon = <CheckCircleOutlined />;
          } else {
            status = 'completed';
            statusColor = 'red';
            statusIcon = <CloseCircleOutlined />;
          }
          
          return {
            ...olympiad,
            startTime: startTime, // Store as moment object
            endTime: endTime,     // Store as moment object
            duration: moment.duration(endTime.diff(startTime)).asMinutes(),
            status,
            statusColor,
            statusIcon
          };
        });
        
        setOlympiads(olympiadsWithStatus);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load olympiads');
        setLoading(false);
      }
    };

    fetchOlympiads();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ margin: '24px' }}
      />
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>
          <TrophyOutlined /> Olimpiadalar
        </Title>
        
        <Divider />
        
        <Row gutter={[16, 16]}>
          {olympiads.map((olympiad) => (
            <Col xs={24} sm={12} lg={8} key={olympiad._id}>
              <Card
                title={
                  <Space>
                    <Text strong style={{textWrapMode:'wrap', margin:'0px, 5px'}}>{olympiad.name}</Text>
                  </Space>
                }
                style={{ height: '100%' }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <Tag 
                      icon={olympiad.statusIcon}
                      color={olympiad.statusColor}
                    >
                      {olympiad.status.toUpperCase()}
                    </Tag>
                  </div>
                  <div>
                    <CalendarOutlined />{' '}
                    <Text><strong>Boshlanish vaqti:</strong> {moment.utc(olympiad.startTime).format('LLL')}</Text>
                  </div>
                  <div>
                    <CalendarOutlined />{' '}
                    <Text><strong>Tugash vaqti:</strong> {moment.utc(olympiad.endTime).format('LLL')}</Text>
                  </div>
                  <div>
                    <ClockCircleOutlined />{' '}
                    <Text><strong>Davomiyligi:</strong> {Math.round(olympiad.duration)} daqiqa</Text>
                  </div>
                  {/* <div>
                    <TeamOutlined />{' '}
                    <Text>
                      <strong>Ishtirokchilar:</strong> {olympiad.participants_count || 0}/{olympiad.max_participants || '∞'}
                    </Text>
                  </div> */}
                  
                  <Divider style={{ margin: '12px 0' }} />
                  
                  <Space>
                    <Button type="primary">
                      <Link to={`/olympiads/${olympiad._id}`}>Batafsil</Link>
                    </Button>
                    
                    {olympiad.status === 'upcoming' && (
                      <Button>
                        <Link to={`/olympiads-register/${olympiad._id}`}>Ro'yxatdan o'tish</Link>
                      </Button>
                    )}
                    
                    {olympiad.status === 'ongoing' && (
                      <Button type="primary" ghost>
                        <Link to={`/olympiads/${olympiad._id}/problems`}>Ishtirok etish</Link>
                      </Button>
                    )}
                  </Space>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Space>
    </div>
  );
};

export default OlympiadList;