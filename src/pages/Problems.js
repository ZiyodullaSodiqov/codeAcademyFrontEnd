import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProblems } from '../store/problemsSlice';
import { 
  Table, 
  Tag, 
  Typography, 
  Card, 
  Space, 
  Spin,
  Alert,
  Layout,
  Row,
  Col
} from 'antd';
import { 
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
  LoadingOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Content } = Layout;

const Problems = () => {
  const dispatch = useDispatch();
  const { problems, loading, error } = useSelector((state) => state.problems);

  useEffect(() => {
    dispatch(getProblems());
  }, [dispatch]);

  const getProblemsList = () => {
    if (Array.isArray(problems)) return problems;
    if (typeof problems === 'object') return Object.values(problems);
    return [];
  };

  const problemsList = getProblemsList();

  const difficultyTag = (difficulty) => {
    let color = '';
    let icon = null;
    
    switch(difficulty.toLowerCase()) {
      case 'easy':
        color = 'green';
        icon = <CheckCircleOutlined />;
        break;
      case 'medium':
        color = 'orange';
        icon = <ClockCircleOutlined />;
        break;
      case 'hard':
        color = 'red';
        icon = <FireOutlined />;
        break;
      default:
        color = 'blue';
    }
    
    return (
      <Tag color={color} icon={icon}>
        {difficulty}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Link to={`/problems/${record.id}`}>
          <Text strong>{text}</Text>
        </Link>
      ),
    },
    {
      title: 'Qiyinlik darajasi',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 150,
      filters: [
        { text: 'Easy', value: 'Easy' },
        { text: 'Medium', value: 'Medium' },
        { text: 'Hard', value: 'Hard' },
      ],
      onFilter: (value, record) => record.difficulty === value,
      render: difficultyTag,
    },
    {
      title: 'Yechilgan',
      dataIndex: 'solved_count',
      key: 'solved_count',
      width: 120,
      sorter: (a, b) => (a.solved_count || 0) - (b.solved_count || 0),
      render: (count) => `${count || 0} yechilgan`,
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
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
    <Layout style={{ background: '#fff' }}>
      <Content style={{ padding: '24px' }}>
        <Row justify="center">
          <Col xs={24} lg={18}>
            <Card
              title={
                <Space>
                  <Title level={4} style={{ margin: 0 }}>Masalalar</Title>
                  <Tag>masalalar soni: {problemsList.length}</Tag>
                </Space>
              }
              bordered={false}
            >
              <Table
                columns={columns}
                dataSource={problemsList}
                rowKey="id"
                pagination={{
                  pageSize: 20,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50', '100'],
                  showTotal: (total) => `Umumiy  ${total} masala`,
                }}
                size="middle"
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Problems;