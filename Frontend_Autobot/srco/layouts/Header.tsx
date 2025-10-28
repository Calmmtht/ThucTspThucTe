import iconBot from "/src/assets/iconbot.png";
import { Layout, Menu, Avatar, Dropdown, Space, Drawer, Button } from 'antd';
import { UserOutlined, LogoutOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { navigateItems } from '../routes';
import { useAuth } from '../App';
import { authService } from '../services/authService';
import type { AuthState } from '../services/authReducer';
import { useState } from 'react';

const { Header } = Layout;

function TradingBotHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!auth) {
    return null;
  }

  const { state } : { state: AuthState } = auth;

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  const selectedKey = location.pathname;

  const userMenuItems = [
    { key: '/information', label: 'Thông tin tài khoản' },
    { key: '/log-history', label: 'Lịch sử giao dịch' },
    { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined /> },
  ];

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      authService.logout();
    } else {
      navigate(key);
    }
  };

  return (
    <>
      <Header className="bg-blue-900 text-white px-6 py-10 sticky top-0 z-50 flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          <img src={iconBot} alt="logo" className="h-20" />
          <span className="text-2xl text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>TradingBot z</span>
        </div>
        <div className='hidden md:flex items-center space-x-4 w-full max-w-3xl'>
            <Menu
              mode="horizontal"
              theme="dark"
              className="bg-blue-900 border-none flex-1 justify-center custom-menu"
              items={navigateItems}
              onClick={({ key }) => handleMenuClick(key)}
              selectedKeys={[selectedKey]}
            />

            {state.isAuthenticated ? (
              <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} trigger={['click']}>
                <div className="cursor-pointer flex flex-col items-center justify-center">
                  <Avatar icon={<UserOutlined />} className="bg-blue-500" />
                  <div className="text-sm font-semibold text-white">{state.user?.name || 'Tên người dùng'}</div>
                </div>
              </Dropdown>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-1">
                <Avatar icon={<UserOutlined />} className="bg-blue-500 cursor-pointer" onClick={() => navigate('/login')} />
                <span className="text-sm font-semibold">Đăng nhập</span>
              </div>
            )}
        </div>
        <Button
          className="md:hidden flex items-center justify-center text-white border-none bg-transparent text-2xl"
          icon={<MenuOutlined />}
          onClick={() => setIsMobileMenuOpen(true)}
        />
      </Header>

      <Drawer
        title={
          <div className="flex items-center space-x-2 bg-blue-900 px-2 py-2 rounded">
            <img src="src/assets/iconbot.png" alt="logo" className="h-12" />
            <span className="text-xl text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>TradingBot</span>
          </div>
        }
        placement="left"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        className="md:hidden"
        bodyStyle={{ padding: 0 }}
        headerStyle={{ background: '#1e3a8a', padding: 0 }}
        closeIcon={<CloseOutlined style={{ color: 'white', fontSize: 15 }} />}
      >
        <div className="flex flex-col h-full bg-blue-900">
          <Menu
            mode="vertical"
            theme="dark"
            className="bg-blue-900 border-none custom-menu"
            items={navigateItems}
            onClick={({ key }) => {
              handleMenuClick(key);
              setIsMobileMenuOpen(false);
            }}
            selectedKeys={[selectedKey]}
          />
          <div className="p-0 border-t border-blue-800 mt-auto">
            <div className="bg-blue-900 w-full py-8 flex flex-col items-center justify-center">
              {state.isAuthenticated ? (
                <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} trigger={['click']}>
                  <div className="cursor-pointer flex flex-col items-center justify-center">
                    <Avatar icon={<UserOutlined />} className="bg-blue-500" />
                    <div className="text-sm font-semibold text-white mt-2">{state.user?.name || 'Tên người dùng'}</div>
                  </div>
                </Dropdown>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-1">
                  <Avatar icon={<UserOutlined />} className="bg-blue-500 cursor-pointer" onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }} />
                  <span className="text-sm font-semibold text-white mt-2">Đăng nhập</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Drawer>

      <style>{`
        .custom-menu .ant-menu-title-content {
          position: relative;
          display: inline-block;
          color: transparent;
          background-image: linear-gradient(90deg, white 0%, white 50%, #60a5fa 50%, #60a5fa 100%);
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          transition: background-position 0.5s ease;
        }

        .custom-menu .ant-menu-item:hover .ant-menu-title-content {
          background-position: -100% 0;
        }

        .custom-menu .ant-menu-item-selected .ant-menu-title-content {
          background-position: -100% 0;
        }
        .custom-menu .ant-menu-item-selected {
             /* Add your desired selected item background style here, e.g., */
             /* background-color: #1890ff !important; */ /* Example: Ant Design primary blue */
             /* or remove background to rely on default theme selected style */
             background-color: transparent !important; /* Example: remove background */
        }

      `}</style>
    </>
  );
}

export default TradingBotHeader;