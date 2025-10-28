import { Button, ConfigProvider, Form, Input, Modal, Space, Spin } from 'antd'
import React, { useState } from 'react'
import adminService from '../../service/adminService'
import { useMessage } from '../../App'

const Command = () => {
  const { antMessage } = useMessage()
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const [currentAction, setCurrentAction] = useState('')
  const [loading, setLoading] = useState(false)

  const showModal = (values) => {
    setFormData(values)
    setIsModalOpen(true)
  }

  const handleOk = () => {
    let data = { status: currentAction }
    Object.keys(form.getFieldsValue()).forEach(
      (key) => (data = { ...data, [key]: form.getFieldValue(key) || 0 }),
    )
    setLoading(true)
    adminService
      .adminPost(data)
      .then(() => {
        antMessage.success('Gửi lệnh thành công.')
        form.resetFields()
      })
      .catch(() => antMessage.error('Gửi lệnh thất bại.'))
      .finally(() => {
        setIsModalOpen(false)
        setLoading(false)
      })
  }

  const handleCancel = () => setIsModalOpen(false)

  const handleImmediateAction = (action) => {
    let data = { status: action }
    data = { ...data, price: 0, orderNumber: 0, stopOrderValue: 0 }

    setLoading(true)
    adminService
      .adminPost(data)
      .then(() => {
        antMessage.success('Đóng lệnh thành công.')
      })
      .catch(() => antMessage.error('Đóng lệnh thất bại.'))
      .finally(() => {
        setLoading(false)
      })
  }

  const handleActionClick = async (action) => {
    if (action === 'CANCEL_VITHE') {
      handleImmediateAction(action)
    } else if (action === 'CANCEL_ALL') {
      setCurrentAction(action)
      showModal({})
    } else {
      try {
        const values = await form.validateFields()
        setCurrentAction(action)
        showModal(values)
      } catch (err) {
        console.error('Validation failed:', err)
      }
    }
  }

  return (
    <>
      <div className="text-center p-5 mb-5 text-2xl">Đặt lệnh</div>
      <Form form={form} initialValues={{ stopOrder: 'SOL' }}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 px-2">
          <Form.Item
            name="price"
            className="md:col-start-2"
            rules={[
              {
                pattern: /^\d+(\.\d{1})?$/,
                message: 'Giá đặt chỉ có 1 chữ số thập phân!',
              },
            ]}
          >
            <Input size="large" placeholder="Giá đặt" />
          </Form.Item>
          <Form.Item
            name="orderNumber"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập số hợp đồng!',
              },
            ]}
          >
            <Input size="large" placeholder="Số hợp đồng" />
          </Form.Item>
          <Space.Compact className="w-full">
            <Form.Item
              name="stopOrderValue"
              className="flex-1"
              rules={[
                {
                  pattern: /^\d+(\.\d{1})?$/,
                  message: 'Là số nguyên hoặc chỉ có 1 chữ số thập phân',
                },
              ]}
            >
              <Input size="large" placeholder="Stop Order" />
            </Form.Item>
          </Space.Compact>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Button
            htmlType="button"
            type="primary"
            danger
            size="large"
            className="md:col-start-2"
            onClick={() => handleActionClick('SHORT')}
          >
            SHORT
          </Button>
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimary: '#198754',
                  colorPrimaryHover: '#75b798',
                  colorPrimaryActive: '#198754',
                },
              },
            }}
          >
            <Button
              htmlType="button"
              type="primary"
              size="large"
              onClick={() => handleActionClick('LONG')}
            >
              LONG
            </Button>
          </ConfigProvider>
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimary: '#ffc107',
                  colorPrimaryHover: '#ffda6a',
                  colorPrimaryActive: '#ffc107',
                },
              },
            }}
          >
            <Button type="primary" size="large" onClick={() => handleActionClick('CANCEL_ALL')}>
              Hủy tất cả
            </Button>
          </ConfigProvider>
          <Button type="primary" size="large" onClick={() => handleActionClick('CANCEL_VITHE')}>
            Đóng lệnh
          </Button>
        </div>
      </Form>
      <Modal
        title={currentAction === 'CANCEL_ALL' ? 'Xác nhận hủy tất cả' : 'Thông tin đặt lệnh'}
        open={isModalOpen}
        onOk={handleOk}
        okText={loading ? <Spin /> : 'OK'}
        okButtonProps={{ disabled: loading }}
        onCancel={handleCancel}
      >
        {currentAction === 'CANCEL_ALL' ? (
          <p>Bạn có chắc chắn muốn hủy tất cả không?</p>
        ) : (
          <>
            <p>Giá đặt: {formData.price}</p>
            <p>Số hợp đồng: {formData.orderNumber}</p>
            <p>StopOder: {formData.stopOrderValue}</p>
            <p className="text-red-700">
              Lệnh đặt: <strong>{currentAction}</strong>
            </p>
          </>
        )}
      </Modal>
    </>
  )
}

export default Command
