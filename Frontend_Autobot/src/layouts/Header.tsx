import iconBot from "/src/assets/iconbot.png";
import { Layout, Menu, Avatar, Dropdown, Button, Drawer } from 'antd';
import { UserOutlined, LogoutOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { navigateItems } from '../routes'; // Sử dụng navigateItems gốc
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
    { 
        key: 'logout', 
        label: 'Đăng xuất', 
        icon: <LogoutOutlined />, 
        danger: true 
    },
  ];

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      authService.logout();
    } else {
      navigate(key);
    }
  };

  // Màu sắc chính: Dark Slate Blue (tông màu tối công nghệ)
  const headerBgColor = '#1e293b'; // slate-800
  // Màu nhấn: Pink Neon
  const accentColor = '#ec4899'; // pink-500
  const accentHoverColor = '#f472b6'; // pink-400

  return (
    <>
      {/* Header chính (Desktop & Mobile) */}
      <Header 
        className="px-6 py-4 sticky top-0 z-50 flex items-center justify-between w-full shadow-xl"
        style={{ 
            backgroundColor: headerBgColor, 
            height: '72px', // Chiều cao cố định cho Antd Header
            lineHeight: '72px',
            padding: '0 24px'
        }}
      >
        {/* Logo Section */}
        <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/')}
        >
          <img src={iconBot} alt="logo" className="h-9 w-9" />
          <span 
            className="text-2xl font-bold" 
            style={{ 
                color: 'white', 
                fontFamily: 'Roboto, sans-serif', 
                letterSpacing: '0.5px' 
            }}
          >
            Trading<span style={{ color: accentColor }}>Bot</span>
          </span>
        </div>

        {/* Navigation & User Menu (Desktop) */}
        <div className='hidden md:flex items-center space-x-8'>
            <Menu
              mode="horizontal"
              theme="dark"
              className="custom-menu"
              style={{ 
                backgroundColor: headerBgColor, 
                borderBottom: 'none',
                lineHeight: '72px', 
              }}
              items={navigateItems}
              onClick={({ key }) => handleMenuClick(key)}
              selectedKeys={[selectedKey]}
            />

            {state.isAuthenticated ? (
              <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} trigger={['click']}>
                <div className="cursor-pointer flex items-center space-x-2 p-1 rounded-full hover:bg-slate-700 transition duration-300">
                  <Avatar icon={<UserOutlined />} style={{ backgroundColor: accentColor }} />
                  {/* Chỉ hiện tên trên màn hình lớn */}
                  <div className="text-sm font-semibold text-white hidden lg:block">{state.user?.name || 'User'}</div>
                </div>
              </Dropdown>
            ) : (
              <Button 
                type="primary" 
                size="large"
                style={{ 
                    backgroundColor: accentColor, 
                    borderColor: accentColor, 
                    fontWeight: 'bold' 
                }}
                className="hover:bg-pink-600 transition duration-300 shadow-md"
                onClick={() => navigate('/login')}
              >
                Đăng nhập
              </Button>
            )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          className="md:hidden flex items-center justify-center text-white border-none bg-transparent text-2xl"
          icon={<MenuOutlined />}
          onClick={() => setIsMobileMenuOpen(true)}
        />
      </Header>

      {/* Drawer for Mobile Menu */}
      <Drawer
        title={
          <div className="flex items-center space-x-3">
            <img src={iconBot} alt="logo" className="h-8 w-8" />
            <span 
                className="text-xl font-bold"
                style={{ color: 'white' }}
            >
                Trading<span style={{ color: accentColor }}>Bot</span>
            </span>
          </div>
        }
        placement="left"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        className="md:hidden"
        bodyStyle={{ padding: 0, backgroundColor: headerBgColor }}
        headerStyle={{ backgroundColor: headerBgColor, borderBottom: `1px solid ${accentColor}` }}
        closeIcon={<CloseOutlined style={{ color: 'white', fontSize: 20 }} />}
        width={250}
      >
        <div className="flex flex-col h-full" style={{ backgroundColor: headerBgColor }}>
          
          {/* Mobile Navigation Menu */}
          <Menu
            mode="vertical"
            theme="dark"
            className="mobile-custom-menu flex-1"
            style={{ backgroundColor: headerBgColor, borderRight: 'none' }}
            items={navigateItems}
            onClick={({ key }) => {
              handleMenuClick(key);
              setIsMobileMenuOpen(false);
            }}
            selectedKeys={[selectedKey]}
          />

          {/* Mobile User/Login Section */}
          <div className="p-4 border-t" style={{ borderColor: '#334155' }}>
            <div className="w-full py-4 flex flex-col items-center justify-center">
              {state.isAuthenticated ? (
                <>
                    <Avatar icon={<UserOutlined />} style={{ backgroundColor: accentColor }} className="mb-3" />
                    <div className="text-base font-semibold text-white mb-4">{state.user?.name || 'User'}</div>
                    <Menu
                        mode="vertical"
                        theme="dark"
                        className="w-full"
                        style={{ backgroundColor: headerBgColor, borderRight: 'none' }}
                        items={userMenuItems.map(item => ({
                            ...item,
                            label: (
                                <div className='flex items-center space-x-2'>
                                    {item.icon}
                                    <span>{item.label}</span>
                                </div>
                            ),
                            className: item.key === 'logout' ? 'ant-menu-item-danger' : '',
                            style: item.key === 'logout' ? { color: '#ef4444' } : {}
                        }))}
                        onClick={({ key }) => {
                            handleUserMenuClick({ key });
                            setIsMobileMenuOpen(false);
                        }}
                    />
                </>
              ) : (
                <Button 
                    type="primary" 
                    size="large"
                    style={{ 
                        backgroundColor: accentColor, 
                        borderColor: accentColor, 
                        fontWeight: 'bold' 
                    }}
                    className="w-full hover:bg-pink-600 transition duration-300 shadow-md"
                    onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                >
                    Đăng nhập ngay
                </Button>
              )}
            </div>
          </div>
        </div>
      </Drawer>

      {/* CSS Styles for unique menu look */}
      <style>{`
        /* Desktop Menu Styles */
        .custom-menu .ant-menu-item-only-child,
        .custom-menu .ant-menu-submenu-title {
            padding: 0 16px !important;
            margin: 0 4px;
            color: #ccc !important;
            border-bottom: 2px solid transparent !important;
            transition: color 0.3s, border-bottom 0.3s, box-shadow 0.3s;
        }
        
        /* Hover Effect: Text Color Change + Underline Glow */
        .custom-menu .ant-menu-item:hover,
        .custom-menu .ant-menu-submenu-title:hover {
            color: white !important;
            border-bottom: 2px solid ${accentHoverColor} !important;
            box-shadow: 0 1px 5px rgba(236, 72, 153, 0.4);
        }

        /* Selected Item Effect: Text Color Change + Underline Glow */
        .custom-menu .ant-menu-item-selected {
            background-color: transparent !important;
            color: white !important;
            border-bottom: 3px solid ${accentColor} !important;
            box-shadow: 0 1px 6px rgba(236, 72, 153, 0.7);
        }
        
        /* Mobile Menu Styles */
        .mobile-custom-menu .ant-menu-item {
             color: #ccc !important;
        }

        .mobile-custom-menu .ant-menu-item-selected {
            background-color: #334155 !important; /* Màu nền khi chọn trên mobile */
            color: ${accentColor} !important;
        }

      `}</style>
    </>
  );
}

export default TradingBotHeader;