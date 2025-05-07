import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Spin, Alert, Button, Typography, Divider, List, Space } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import moment from 'moment'; // For easier date handling
import './OlympiadDetail.css'; // Optional: Keep custom styles if needed
import OlympiadLeaderboard from './OlympiadLeaderboard';

const { Title, Paragraph, Text } = Typography;

const OlympiadDetail = () => {
  const { olympiad_id } = useParams();
  const navigate = useNavigate();
  const [olympiad, setOlympiad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(true);
  const [isOlympiadActive, setIsOlympiadActive] = useState(false);
  const [statusInfo, setStatusInfo] = useState({
    status: 'upcoming',
    statusColor: 'blue',
    statusIcon: <ClockCircleOutlined />,
  });

  useEffect(() => {
    const fetchOlympiadData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5055/api/olympiads/${olympiad_id}`);
        setOlympiad(response.data);
      } catch (err) {
        console.error('Error fetching olympiad:', err);
      } finally {
        setLoading(false);
      }
    };

    const checkRegistrationStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(
            `http://127.0.0.1:5055/api/olympiads/${olympiad_id}/check-registration`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setIsRegistered(response.data.isRegistered);
        }
      } catch (err) {
        console.error('Error checking registration:', err);
      } finally {
        setRegistrationLoading(false);
      }
    };

    fetchOlympiadData();
    checkRegistrationStatus();
  }, [olympiad_id]);

  // Check Olympiad status and activity
  useEffect(() => {
    if (olympiad) {
      const checkOlympiadStatus = () => {
        const now = moment();
        const start = moment(olympiad.start_time);
        const end = moment(olympiad.end_time);

        let status, statusColor, statusIcon, active;
        if (now.isBefore(start)) {
          status = 'upcoming';
          statusColor = 'blue';
          statusIcon = <ClockCircleOutlined />;
          active = false;
        } else if (now.isSameOrAfter(start) && now.isSameOrBefore(end)) {
          status = 'ongoing';
          statusColor = 'green';
          statusIcon = <CheckCircleOutlined />;
          active = true;
        } else {
          status = 'completed';
          statusColor = 'red';
          statusIcon = <CloseCircleOutlined />;
          active = false;
        }

        setStatusInfo({ status, statusColor, statusIcon });
        setIsOlympiadActive(active);

        // Debugging logs
        console.log({
          now: now.toISOString(),
          start: start.toISOString(),
          end: end.toISOString(),
          status,
          isOlympiadActive: active,
        });
      };

      checkOlympiadStatus();
      // Update status every minute to handle edge cases
      const interval = setInterval(checkOlympiadStatus, 60000);
      return () => clearInterval(interval);
    }
  }, [olympiad]);

  const handleRegister = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://127.0.0.1:5055/api/olympiads/${olympiad_id}/register`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsRegistered(true);
    } catch (err) {
      console.error('Error registering:', err);
    }
  };

  const handleEnterOlympiad = () => {
    // Redirect to the Olympiad participation page (adjust the route as needed)
    navigate(`/olympiads/${olympiad_id}/problems`);
  };

  if (loading) return <Spin size="large" tip="Loading olympiad details..." />;
  if (!olympiad) return <Alert message="Olympiad not found" type="error" showIcon />;

  const isOlympiadUpcoming = moment().isBefore(moment(olympiad.start_time));
  const isOlympiadEnded = moment().isAfter(moment(olympiad.end_time));

  // Calculate duration in minutes
  const duration = olympiad.start_time && olympiad.end_time
    ? moment(olympiad.end_time).diff(moment(olympiad.start_time), 'minutes')
    : 'N/A';

  return (
    <>
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Card
        title={
          <Space>
            <Title level={2} style={{ margin: 0 }}>
              {olympiad.name}
            </Title>
            <Text style={{ color: statusInfo.statusColor }}>
              {statusInfo.statusIcon} {statusInfo.status.charAt(0).toUpperCase() + statusInfo.status.slice(1)}
            </Text>
          </Space>
        }
        bordered
      >
        <div>
          <Title level={4}>Description</Title>
          <Paragraph>{olympiad.description}</Paragraph>

          <Divider />

          <Title level={4}>Schedule</Title>
          <Paragraph>
            <strong>Start:</strong> {moment(olympiad.start_time).format('LLL')}
          </Paragraph>
          <Paragraph>
            <strong>End:</strong> {moment(olympiad.end_time).format('LLL')}
          </Paragraph>
          <Paragraph>
            <strong>Duration:</strong> {duration} minutes
          </Paragraph>

          <Divider />

          {olympiad.rules && olympiad.rules.length > 0 && (
            <>
              <Title level={4}>Rules</Title>
              <List
                dataSource={olympiad.rules}
                renderItem={(rule, index) => (
                  <List.Item>
                    <Text>{`${index + 1}. ${rule}`}</Text>
                  </List.Item>
                )}
              />
              <Divider />
            </>
          )}

          <div style={{ marginTop: '16px' }}>
            {!registrationLoading && (
              <>
                {isRegistered ? (
                  <Button
                    type="primary"
                    size="large"
                    disabled={!isOlympiadActive}
                    onClick={handleEnterOlympiad}
                  >
                    {isOlympiadUpcoming
                      ? 'Olympiad Not Started'
                      : isOlympiadEnded
                      ? 'Olympiad Ended'
                      : 'Enter Olympiad'}
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleRegister}
                    disabled={isOlympiadEnded}
                  >
                    Register
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
    <OlympiadLeaderboard />
    </>
  );
};

export default OlympiadDetail;