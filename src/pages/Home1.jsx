import React, { useState } from 'react';
import { Layout, Typography, Button, Space, Alert } from 'antd';
import { CodeOutlined, TrophyOutlined, UserOutlined, InfoCircleOutlined, StarOutlined, UserSwitchOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const { Header, Sider, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const Home1 = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [activeSection, setActiveSection] = useState('home');

  const handleNavigate = (path, section) => {
    setActiveSection(section);
    navigate(path);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Navbar */}
      <Header
        style={{
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          position: 'fixed',
          width: '100%',
          zIndex: 10,
          padding: '0 24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            Code Academy
          </Title>
          <Alert
              message={
                <span>
                  Sayt test rejimda ishlamoqda. Murojat uchun: {' '}
                  <a href="https://t.me/CodeAcedemyInfobot" target="_blank" rel="noopener noreferrer">
                    @CodeAcedemyInfobot
                  </a>
                </span>
              }
              type="warning"
              showIcon
              style={{ flex: 1, margin: '0 24px', textAlign: 'center' }}
            />
          <Space size="large">
            {!isAuthenticated ? (
              <>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => handleNavigate('/register', 'register')}
                  style={{ background: '#ff4d4f', borderColor: '#ff4d4f' }}
                >
                  Ro‘yxatdan o‘tish
                </Button>
                <Button ghost size="large" onClick={() => handleNavigate('/login', 'login')}>
                  Tizimga kirish
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => handleNavigate('/profile', 'profile')}
                  icon={<UserOutlined />}
                >
                  {localStorage.getItem('name') || 'Profil'}
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => handleNavigate('/problems', 'problems')}
                  icon={<CodeOutlined />}
                >
                  Masala Yechish
                </Button>
                <Button
                  variant='outlined'
                  color="default"
                  size="large"
                  onClick={() => handleNavigate('/olympiads', 'olympiads')}
                  icon={<TrophyOutlined />}
                >
                  Musobaqalarda Qatnashish
                </Button>
              </>
            )}
          </Space>
        </div>
      </Header>

      {/* Sidebar */}
      <Layout>
        <Sider
          width={200}
          style={{
            background: '#fff',
            position: 'fixed',
            height: 'calc(100vh - 64px)',
            marginTop: '64px',
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
            overflow: 'auto',
          }}
        >
          <div style={{ padding: '24px' }}>
            <div
              style={{
                padding: '12px',
                cursor: 'pointer',
                background: activeSection === 'home' ? '#e6f7ff' : 'transparent',
                borderRadius: '4px',
                marginBottom: '8px',
              }}
              onClick={() => handleNavigate('/', 'home')}
            >
              <Space>
                <InfoCircleOutlined />
                <span>Bosh Sahifa</span>
              </Space>
            </div>
            <div
              style={{
                padding: '12px',
                cursor: 'pointer',
                background: activeSection === 'problems' ? '#e6f7ff' : 'transparent',
                borderRadius: '4px',
                marginBottom: '8px',
              }}
              onClick={() => handleNavigate('/problems', 'problems')}
            >
              <Space>
                <CodeOutlined />
                <span>Masalalar</span>
              </Space>
            </div>
            <div
              style={{
                padding: '12px',
                cursor: 'pointer',
                background: activeSection === 'olympiads' ? '#e6f7ff' : 'transparent',
                borderRadius: '4px',
                marginBottom: '8px',
              }}
              onClick={() => handleNavigate('/olympiads', 'olympiads')}
            >
              <Space>
                <TrophyOutlined />
                <span>Musobaqalar</span>
              </Space>
            </div>
            <div
              style={{
                padding: '12px',
                cursor: 'pointer',
                background: activeSection === 'ratings' ? '#e6f7ff' : 'transparent',
                borderRadius: '4px',
                marginBottom: '8px',
              }}
              onClick={() => handleNavigate('/working', 'ratings')}
            >
              <Space>
                <StarOutlined />
                <span>Tizimda ishlash</span>
              </Space>
            </div>
            <div
              style={{
                padding: '12px',
                cursor: 'pointer',
                background: activeSection === 'about' ? '#e6f7ff' : 'transparent',
                borderRadius: '4px',
              }}
              onClick={() => handleNavigate('/about', 'about')}
            >
              <Space>
                <UsergroupAddOutlined />
                <span>Jamoa</span>
              </Space>
            </div>
          </div>
        </Sider>

        {/* Main Content */}
        <Layout style={{ marginLeft: 200, marginTop: '64px' }}>
          <Content
            style={{
              minHeight: 'calc(100vh - 128px)',
              // background: 'linear-gradient(135deg, #1976d2 0%, #303f9f 100%)',
              padding: '24px',
            }}
          >
            <Outlet /> {/* Sahifalar bu yerda ko‘rsatiladi */}
          </Content>

          {/* Footer */}
          <Footer style={{ textAlign: 'center', background: '#fff' }}>
            <Paragraph style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
              ©{new Date().getFullYear()} Code Academy - All Rights Reserved
            </Paragraph>
            <Paragraph style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
              Aloqa uchun: <a href="tel:+998555084400">+998(55)-508-44-00</a>
            </Paragraph>
            <Paragraph style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
              Telegram: <a href="https://t.me/Code_Acedemy" target="_blank" rel="noopener noreferrer">@codeacademyuz</a> {" | "}
              Web: <a href="https://nordicuniversity.org/uz" target="_blank" rel="noopener noreferrer">nordicuniversity.org</a>
            </Paragraph>
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Home1;