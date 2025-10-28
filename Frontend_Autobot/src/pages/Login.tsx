import iconBot2 from "/src/assets/iconbothi.jpg";
import piclerf from "/src/assets/1000_F_1369373417_m2Oa554rcYSDHPXowqTv2XnqbdfWhnJY.jpg";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useMessage, useAuth } from '../App';
import { LOGIN_SUCCESS } from '../services/authActions';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const antMessage = useMessage();
  const auth = useAuth();
  const [loginForm] = Form.useForm();
  const [verifyForm] = Form.useForm();

  if (!auth) {
    console.error("Auth context not available in Login page.");
    return null;
  }

  const { dispatch } = auth;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [adminUserId, setAdminUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check for remembered phone number in local storage
    const rememberedPhone = localStorage.getItem('rememberedPhone');
    if (rememberedPhone) {
      loginForm.setFieldsValue({
        phone: rememberedPhone,
        remember: true, // Also check the remember me box
      });
    }
  }, [loginForm]); // Add form to dependency array

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinishLogin = async (values: any) => {
    setIsSubmitting(true);
    try {
      const userData = await authService.login(values.phone, values.password);

      // Handle remember me
      if (values.remember) {
        localStorage.setItem('rememberedPhone', values.phone);
      } else {
        localStorage.removeItem('rememberedPhone');
      }

      // Kiểm tra xem phản hồi có chứa thông tin user (userId) hay không
      if (userData && userData.userId) {
        // Phản hồi có thông tin user. Bây giờ kiểm tra xem có cần xác thực bước 2 cho admin không.
        // Điều kiện cần xác thực bước 2 là: user có role 'Admin' VÀ phản hồi không chứa access_token.
        if (userData.roles.includes('Admin') && (!('access_token' in userData) || !userData.access_token)) {
           // Đây là admin cần xác thực bước 2
          setAdminUserId(userData.userId);
          setShowVerificationForm(true);
          if (antMessage) {
              antMessage.info('Vui lòng kiểm tra email để nhận mã xác thực.');
          }
        } else {
          // User thường HOẶC Admin đã xác thực bước 2 (phản hồi có token)
          dispatch({ type: LOGIN_SUCCESS, payload: { user: userData } });
          if (antMessage) {
              antMessage.success('Đăng nhập thành công!');
          }
          navigate('/');
        }
      } else {
          // Phản hồi không có thông tin user (userId)
          throw new Error('Đăng nhập thất bại. Không nhận được thông tin người dùng.');
      }

    } catch (error: any) {
      console.error('Login failed:', error);
      if (antMessage) {
        antMessage.error(error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinishVerification = async (values: any) => {
    if (!adminUserId) return; // Đảm bảo có userId admin

    setIsSubmitting(true);
    try {
        const userData = await authService.verifyAdminLogin(adminUserId, values.verificationCode);

        // Xác thực admin thành công
        dispatch({ type: LOGIN_SUCCESS, payload: { user: userData } });
        if (antMessage) {
            antMessage.success('Xác thực thành công! Đang chuyển hướng...');
        }
        navigate('/');

    } catch (error: any) {
        console.error('Verification failed:', error);
        if (antMessage) {
            antMessage.error(error.message || 'Xác thực thất bại. Vui lòng kiểm tra lại mã.');
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div
      className="w-screen min-h-screen flex items-center justify-center bg-gray-100 font-sans"
      style={{ fontFamily: 'system-ui, -apple-system, Helvetica, Arial, sans-serif' }}
    >
      {/* KHỐI LOGIN CHÍNH */}
      <div
        className="w-full sm:w-[900px] h-auto sm:h-[550px] flex rounded-2xl overflow-hidden shadow-2xl bg-white max-w-full flex-col sm:flex-row overflow-y-auto"
        style={{ boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)', maxHeight: '100vh' }}
      >
        {/* TRÁI - ẢNH */}
        <div className="flex-1 relative min-h-[180px] hidden sm:block">
          <img
            src={piclerf}
            alt="bg"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900/60" />
        </div>

        {/* PHẢI - FORM */}
        <div
          className="flex-1 flex flex-col justify-center bg-white px-6 py-8 sm:px-[60px] sm:py-[50px]"
        >
          {/* LOGO */}
          <Link to="/">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <img src={iconBot2} alt="logo" style={{ width: '60px'}} />
              <h1 style={{ fontFamily: 'Orbitron, sans-serif' , fontSize: '26px', margin: 0, fontWeight: 400, color: '#111827' }}>
                TradingBot
              </h1>
            </div>
          </Link>

          {!showVerificationForm ? (
            // FORM ĐĂNG NHẬP CHÍNH
            <>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#111827' }}>Đăng nhập</h2>
                <p style={{ fontSize: '14px', marginBottom: '20px', color: '#6b7280' }}>
                  Chào mừng bạn đến với Tradingbot
                </p>
                <Form form={loginForm} layout="vertical" onFinish={onFinishLogin} initialValues={{ remember: true }}>
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

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                  </div>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" block loading={isSubmitting}>
                      Đăng nhập
                    </Button>
                  </Form.Item>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280' }}>
                    <span>
                      Bạn chưa có tài khoản?{' '}
                      <Link to="/register" style={{ color: '#2563eb', fontWeight: 500 }}>Đăng ký</Link>
                    </span>
                    <Link to="/forgot-password" style={{ color: '#2563eb', fontWeight: 500 }}>Quên mật khẩu</Link>
                  </div>
                </Form>
            </>
          ) : (
            // FORM XÁC THỰC MÃ ADMIN
            <>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#111827' }}>Xác thực Admin</h2>
                <p style={{ fontSize: '14px', marginBottom: '20px', color: '#6b7280' }}>
                  Vui lòng nhập mã xác thực đã được gửi đến email của bạn.
                </p>
                <Form form={verifyForm} layout="vertical" onFinish={onFinishVerification}>
                     <Form.Item
                        name="verificationCode"
                        rules={[{ required: true, message: 'Vui lòng nhập mã xác thực!' }]}
                    >
                        <Input
                            size="large"
                            placeholder="Mã xác thực"
                            prefix={<LockOutlined />}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block loading={isSubmitting}>
                            Xác thực
                        </Button>
                    </Form.Item>
                </Form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;