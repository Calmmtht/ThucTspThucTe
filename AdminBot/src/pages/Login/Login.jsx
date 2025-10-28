import { Button, ConfigProvider, Form, Input, Spin } from 'antd'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LockOutlined, PhoneOutlined, VerifiedOutlined } from '@ant-design/icons'
import authService from '../../service/authService'
import { useAuth, useMessage } from '../../App'
import authActions from '../../service/authAction'

const Login = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { dispatch } = useAuth()
  const { antMessage } = useMessage()

  const [userId, setUserId] = useState('')
  const [isVerify, setIsVerify] = useState(false)

  const handleSubmit = () => {
    setLoading(true)
    authService
      .login(form.getFieldsValue())
      .then((res) => {
        if (res.data?.roles?.includes('Admin')) {
          setIsVerify(true)
          setUserId(res.data.userId ?? '')
          antMessage.success('Đã gửi mã xác nhận đến email')
        } else throw new Error('Bạn không có quyền truy cập.')
      })
      .catch((err) =>
        antMessage.error(err.response?.data?.title || err.response?.data || err.message),
      )
      .finally(() => setLoading(false))
  }

  const handleVerify = () => {
    const data = {
      ...form.getFieldsValue(),
      userId: userId,
    }
    setLoading(true)
    authService
      .verifyLogin(data)
      .then((res) => {
        if (res.data?.roles?.includes('Admin')) {
          setIsVerify(false)
          dispatch(authActions.LOGIN(res.data?.roles))
          antMessage.success('Đăng nhập thành công')
          navigate('/home')
        } else throw new Error('Bạn không có quyền truy cập.')
      })
      .catch((err) =>
        antMessage.error(err.response?.data?.title || err.response?.data || err.message),
      )
      .finally(() => setLoading(false))
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="lg:w-1/3 md:w-1/2 w-11/12 bg-white drop-shadow rounded-lg overflow-hidden">
        <div className="p-12 ">
          <div className="flex justify-center items-center font-bold mb-8 text-xl text-green-800">
            Chào Admin!
          </div>
          {isVerify ? (
            <Form disabled={loading} form={form} onFinish={handleVerify}>
              <Form.Item
                name="token"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mã xác thực',
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Mã xác thực"
                  prefix={<VerifiedOutlined className="text-gray-300 mx-1" />}
                />
              </Form.Item>
              <ConfigProvider
                theme={{
                  components: {
                    Button: {
                      colorPrimary: 'rgb(127 178 65)',
                      colorPrimaryHover: 'rgb(142, 178, 93)',
                      colorPrimaryActive: 'rgb(14, 75, 0)',
                    },
                  },
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="w-full px-4 text-white bg-green-700 rounded-3xl hover:bg-green-600 "
                >
                  {loading ? <Spin style={{ color: 'red' }} /> : 'Xác nhận'}
                </Button>
              </ConfigProvider>
            </Form>
          ) : (
            <Form disabled={loading} form={form} onFinish={handleSubmit} className="space-y-6">
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Số điện thoại là bắt buộc.',
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined className="text-gray-300 mx-1" />}
                  placeholder="Số điện thoại"
                  size="large"
                  className="text-gray-600"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mật khẩu',
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Mật khẩu"
                  prefix={<LockOutlined className="text-gray-300 mx-1" />}
                />
              </Form.Item>
              <ConfigProvider
                theme={{
                  components: {
                    Button: {
                      colorPrimary: 'rgb(127 178 65)',
                      colorPrimaryHover: 'rgb(142, 178, 93)',
                      colorPrimaryActive: 'rgb(14, 75, 0)',
                    },
                  },
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="w-full px-4  text-white bg-green-700 rounded-3xl hover:bg-green-600 "
                >
                  {loading ? <Spin style={{ color: 'red' }} /> : 'Đăng nhập'}
                </Button>
              </ConfigProvider>
            </Form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
