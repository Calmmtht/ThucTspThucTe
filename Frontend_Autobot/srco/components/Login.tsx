import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import React from 'react';

const Login: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Đăng nhập:', values);
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        fontFamily: 'system-ui, -apple-system, Helvetica, Arial, sans-serif',
      }}
    >
      <div
        style={{
          width: '1100px',
          height: '620px',
          display: 'flex',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 15px 45px rgba(0, 0, 0, 0.15)',
          backgroundColor: 'white',
        }}
      >
        {/* TRÁI - ẢNH */}
        <div style={{ flex: 1, position: 'relative' }}>
          <img
            src="/login-bg.jpg"
            alt="bg"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(30, 64, 175, 0.7)',
            }}
          />
        </div>

        {/* PHẢI - FORM */}
        <div
          style={{
            flex: 1,
            padding: '60px 80px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}
        >
          {/* LOGO */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <img src="/logo.png" alt="logo" style={{ width: '45px', height: '45px' }} />
            <h1 style={{ fontSize: '28px', margin: 0, fontWeight: 700, color: '#1e293b' }}>
              TradingBot
            </h1>
          </div>

          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600, color: '#111827' }}>Đăng nhập</h2>
          <p style={{ fontSize: '15px', marginBottom: '26px', color: '#6b7280' }}>
            Chào mừng bạn đến với minh.autobot
          </p>

          <Form layout="vertical" onFinish={onFinish} initialValues={{ remember: true }}>
            <Form.Item
              name="phone"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
            >
              <Input
                size="large"
                placeholder="Số điện thoại"
                prefix={<UserOutlined />}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                size="large"
                placeholder="Mật khẩu"
                prefix={<LockOutlined />}
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block>
                Đăng nhập
              </Button>
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280' }}>
              <span>
                Bạn chưa có tài khoản?{' '}
                <a href="#" style={{ color: '#2563eb', fontWeight: 500 }}>Đăng ký</a>
              </span>
              <a href="#" style={{ color: '#2563eb', fontWeight: 500 }}>Quên mật khẩu</a>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
