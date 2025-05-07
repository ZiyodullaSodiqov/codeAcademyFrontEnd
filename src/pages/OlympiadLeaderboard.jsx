import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Table, Typography, Spin, Alert, Tag, Result } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;

const OlympiadLeaderboard = () => {
  const { olympiad_id } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5055/api/olympiads/${olympiad_id}/leaderboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('Leaderboard Data:', response.data);

        // Ma'lumotlarni moslashtirish
        const formattedLeaderboard = response.data.map(item => ({
          ...item,
          user_id: item.user_id.$oid, // user_id ni stringga aylantirish
          problems_solved: item.problems_solved.map(problem => ({
            ...problem,
            solved_at: problem.solved_at.$date, // solved_at ni stringga aylantirish
          })),
        }));
        setLeaderboard(formattedLeaderboard);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err.response?.data?.error || 'Failed to load leaderboard');
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [olympiad_id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon style={{ margin: '24px' }} />;
  }

  if (leaderboard.length === 0) {
    return (
      <Result
        status="info"
        title="No Participants Yet"
        subTitle="No one has participated in this olympiad yet."
        style={{ margin: '24px' }}
      />
    );
  }

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Total Points',
      dataIndex: 'total_points',
      key: 'total_points',
      sorter: (a, b) => b.total_points - a.total_points,
    },
    {
      title: 'Problems Solved',
      dataIndex: 'problems_solved_count',
      key: 'problems_solved_count',
      sorter: (a, b) => b.problems_solved_count - a.problems_solved_count,
    },
    {
      title: 'Solved Problems',
      dataIndex: 'problems_solved',
      key: 'problems_solved',
      render: (problems) => (
        <div>
          {problems && problems.length > 0 ? (
            problems.map((problem, index) => (
              <Tag key={index} color="green" style={{ margin: '2px' }}>
                {problem.problem_id} ({problem.points_earned} pts,{' '}
                {problem.solved_at
                  ? moment(problem.solved_at).format('LLL')
                  : 'Unknown Time'}
                )
              </Tag>
            ))
          ) : (
            <Tag color="gray">No problems solved</Tag>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <TrophyOutlined /> Advanced Algorithms Challenge Leaderboard
      </Title>
      <Table
        columns={columns}
        dataSource={leaderboard}
        rowKey="user_id" 
        pagination={{ pageSize: 10 }}
        style={{ marginTop: '16px' }}
      />
    </div>
  );
};

export default OlympiadLeaderboard;