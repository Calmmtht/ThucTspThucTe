import iconBot2 from "/src/assets/iconbothi.jpg";
import piclerf from "/src/assets/1000_F_1369373417_m2Oa554rcYSDHPXowqTv2XnqbdfWhnJY.jpg";
import { LockOutlined, UserOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons';
import { Button, Form, Input} from 'antd';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authService';
import { useMessage } from '../App';
const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const antMessage = useMessage();
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [verifiedCode, setVerifiedCode] = useState<string | null>(null);
  const authService = new AuthService();

  const handleSendCode = async () => {
    try {
      const email = form.getFieldValue('email');
      if (!email) {
        if(antMessage) antMessage.error('Vui lòng nhập email trước khi gửi mã!');
        return;
      }
      setSendingCode(true);
      
      // Call the service and handle success/error using promises
      await authService.sendResetCode(email)
        .then(() => {
          if(antMessage) antMessage.success('Mã xác minh đã được gửi đến email của bạn!');
        })
        .catch((error: any) => {
          console.error('Send code error:', error); // Debug log
          if (error.message) {
            if(antMessage) antMessage.error(error.message);
          } else {
            if(antMessage) antMessage.error('Không thể gửi mã xác minh. Vui lòng thử lại!');
          }
        })
        .finally(() => {
          setSendingCode(false);
        });

    } catch (error) {
      // This catch block is mostly for sync errors before the async call
      console.error('Unexpected error in handleSendCode:', error); // Debug log
      if(antMessage) antMessage.error('Có lỗi xảy ra. Vui lòng thử lại!');
      setSendingCode(false); // Ensure loading state is reset even on unexpected errors
    }
  };

  const handleVerifyCode = async () => {
    try {
      const email = form.getFieldValue('email');
      const code = form.getFieldValue('verifyCode');
      
      if (!email || !code) {
        if(antMessage) antMessage.error('Vui lòng nhập đầy đủ email và mã xác minh!');
        return;
      }

      setLoading(true);
      await authService.verifyResetCode(email, code);
      if(antMessage) antMessage.success('Mã xác minh hợp lệ! Vui lòng nhập mật khẩu mới.');
      setIsVerified(true);
      setVerifiedEmail(email); // Store verified email
      setVerifiedCode(code); // Store verified code
    } catch (error: any) {
      if (error.message) {
        if(antMessage) antMessage.error(error.message);
      } else {
        if(antMessage) antMessage.error('Mã xác minh không hợp lệ. Vui lòng thử lại!');
      }
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: { newPassword: string; confirmPassword: string }) => {
    try {
      // Only proceed if email and code have been verified and stored
      if (!verifiedEmail || !verifiedCode) {
        if(antMessage) antMessage.error('Vui lòng xác minh email và mã trước!');
        return;
      }

      if (values.newPassword !== values.confirmPassword) {
        if(antMessage) antMessage.error('Mật khẩu xác nhận không khớp!');
        return;
      }

      setLoading(true);
      
      // Use stored email and code, and new password from form
      console.log('Reset password request data:', {
        email: verifiedEmail,
        code: verifiedCode,
        newPassword: values.newPassword,
      });

      await authService.resetPassword(verifiedEmail, verifiedCode, values.newPassword);
      if(antMessage) antMessage.success('Đặt lại mật khẩu thành công!');
      navigate('/login');
    } catch (error: any) {
      if (error.message) {
        if(antMessage) antMessage.error(error.message);
      } else {
        if(antMessage) antMessage.error('Không thể đặt lại mật khẩu. Vui lòng kiểm tra lại thông tin!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-screen min-h-screen flex items-center justify-center bg-gray-100 font-sans"
      style={{ fontFamily: 'system-ui, -apple-system, Helvetica, Arial, sans-serif' }}
    >
      {/* KHỐI CHÍNH */}
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

          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#111827' }}>Quên mật khẩu</h2>
          <p style={{ fontSize: '14px', marginBottom: '20px', color: '#6b7280' }}>
            {isVerified ? 'Nhập mật khẩu mới' : 'Nhập email để nhận mã xác minh'}
          </p>

          <Form form={form} layout="vertical" onFinish={onFinish}>
            {!isVerified ? (
              <>
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Vui lòng nhập email!', type: 'email' }]}
                >
                  <Input
                    size="large"
                    placeholder="Email"
                    prefix={<MailOutlined />}
                  />
                </Form.Item>

                <Form.Item
                  name="verifyCode"
                  rules={[{ required: true, message: 'Vui lòng nhập mã xác minh!' }]}
                >
                  <Input
                    size="large"
                    placeholder="Mã xác minh"
                    prefix={<SafetyOutlined />}
                    addonAfter={
                      <Button 
                        onClick={handleSendCode} 
                        loading={sendingCode}
                      >
                        Gửi mã
                      </Button>
                    }
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" onClick={handleVerifyCode} size="large" block loading={loading}>
                    Xác minh mã
                  </Button>
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  name="newPassword"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                  ]}
                >
                  <Input.Password
                    size="large"
                    placeholder="Mật khẩu mới"
                    prefix={<LockOutlined />}
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    size="large"
                    placeholder="Xác nhận mật khẩu"
                    prefix={<LockOutlined />}
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" block loading={loading}>
                    Đặt lại mật khẩu
                  </Button>
                </Form.Item>
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280' }}>
              <Link to="/login" style={{ color: '#2563eb', fontWeight: 500 }}>Quay lại đăng nhập</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 