import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Modal, Spin, Table, Select, InputNumber } from 'antd'
import pricebotService from '../../service/pricebotService'
import botService from '../../service/botService'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useMessage } from '../../App'
import { formatVND } from '../../service/commonService'

const { Option } = Select

const PriceBot = () => {
  const { antMessage } = useMessage()
  // const { setIsLoading } = useLoading()
  const [data, setData] = useState([])
  const [botOptions, setBotOptions] = useState([])
  const [form] = Form.useForm()
  const [loadingAdd, setLoadingAdd] = useState(false)
  const [loadingUpdated, setLoadingUpdated] = useState(false)

  const [isEditing, setIsEditing] = useState(false)
  const [month, setMonth] = useState('')
  const [botTradingId, setBotTradingId] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [update, setUpdate] = useState(false)

  const columns = (onEdit) => [
    {
      title: 'Số tháng của gói',
      dataIndex: 'month',
      sorter: (a, b) => a.month - b.month,
    },
    {
      title: 'Giá gói',
      dataIndex: 'price',
      render: (value) => formatVND(value),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Giảm giá (%)',
      dataIndex: 'discount',
    },
    {
      title: 'Mã Bot',
      dataIndex: 'botTradingId',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
    },

    {
      title: 'Action',
      render: (_, record) => (
        <>
          <Button
            className="mr-2 border-0"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Button
            className="text-red-600 border-0"
            icon={<DeleteOutlined />}
            onClick={() => {
              setIsModalOpen(true)
              setMonth(record.month)
              setBotTradingId(record.botTradingId)
            }}
          />
        </>
      ),
    },
  ]

  useEffect(() => {
    setLoading(true)
    pricebotService
      .getPriceBot()
      .then((res) => setData(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))

    botService
      .getAllBot()
      .then((res) => setBotOptions(res.data))
      .catch((err) => console.log(err))
  }, [update])

  const onEdit = (record) => {
    form.setFieldsValue(record)
    setIsEditing(true)
  }

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields()

      setLoadingUpdated(true)
      pricebotService
        .updatePriceBot(values.month, values.botTradingId, values)
        .then((res) => {
          console.log(res)
          antMessage.success('Cập nhật thành công!')
          setIsEditing(false)
          setUpdate(!update)
          form.resetFields()
        })
        .catch((err) => {
          antMessage.error(err.response?.data || err.message)
        })
        .finally(() => setLoadingUpdated(false))
    } catch (error) {}
  }

  const handleAdd = async () => {
    try {
      const values = await form.validateFields()

      setLoadingAdd({ ...values, discount: values.discount ?? 0 })
      pricebotService
        .addPriceBot(values)
        .then(() => {
          antMessage.success('Thêm giá bot thành công.')
          form.resetFields()
          setUpdate(!update)
        })
        .catch((err) => antMessage.error(err.response?.data || err.message))
        .finally(() => setLoadingAdd(false))
    } catch (error) {}
  }

  const handleOk = () => {
    pricebotService
      .deletePrictbot(month, botTradingId)
      .then(() => {
        const newData = data.filter(
          (item) => !(item.month === month && item.botTradingId === botTradingId),
        )
        setData(newData)
        antMessage.success('Xóa thành công.')
      })
      .catch(() => antMessage.error('Xóa lỗi'))
      .finally(() => setIsModalOpen(false))
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleClear = () => {
    setIsEditing(false)
    form.resetFields()
  }

  return (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <div className="h-fit md:col-span-2 bg-white rounded-lg drop-shadow">
          <Table
            loading={loading}
            className="overflow-x-auto"
            columns={columns(onEdit)}
            dataSource={data}
            rowKey={(record) => record.botTradingId + record.month}
          />
        </div>
        <div className="h-fit bg-white rounded-lg drop-shadow">
          <div className="text-xl text-center p-4">Gói Bot</div>
          <Form form={form} className="px-4 grid grid-cols-3 gap-2">
            <label htmlFor="month">Gói:</label>
            <Form.Item
              rules={[
                { required: true, message: 'Vui lòng nhập số tháng' },
                { type: 'number', min: 1, max: 12, message: 'Số tháng phải từ 1 đến 12' }
              ]}
              name="month"
              className="col-span-2"
            >
              <InputNumber disabled={isEditing} />
            </Form.Item>
            <label htmlFor="price">Giá:</label>
            <Form.Item
              rules={[
                { required: true, message: 'Vui lòng nhập giá' },
                { type: 'number', min: 0, message: 'Giá không được âm' }
              ]}
              name="price"
              className="col-span-2"
            >
              <InputNumber
                className="w-full"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
            <label htmlFor="discount">Giảm giá:</label>
            <Form.Item 
              name="discount" 
              className="col-span-2"
              rules={[
                { required: true, message: 'Vui lòng nhập giảm giá' },
                { type: 'number', min: 0, max: 100, message: 'Giảm giá phải từ 0 đến 100%' }
              ]}
            >
              <InputNumber min={0} max={100} />
            </Form.Item>
            <label htmlFor="botTradingId">Bot ID:</label>
            <Form.Item
              rules={[{ required: true, message: 'Vui lòng chọn Bot' }]}
              name="botTradingId"
              className="col-span-2"
            >
              <Select disabled={isEditing}>
                {botOptions.map((bot) => (
                  <Option key={bot.id} value={bot.id}>
                    {bot.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <label htmlFor="description">Mô tả:</label>
            <Form.Item
              rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
              name="description"
              className="col-span-2"
            >
              <Input />
            </Form.Item>
            <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
              <Button type="primary" size="large" onClick={handleUpdate} disabled={!isEditing}>
                {loadingUpdated ? <Spin /> : 'Cập nhật'}
              </Button>
              <Button type="primary" size="large" onClick={handleAdd} disabled={isEditing}>
                {loadingAdd ? <Spin /> : 'Thêm'}
              </Button>
              <Button
                className="col-span-1 md:col-span-2 lg:col-span-1"
                onClick={handleClear}
                size="large"
              >
                Clear
              </Button>
            </div>
          </Form>
        </div>
      </div>
      <Modal title="Xóa gói" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Bạn có chắc chắn xóa gói của Bot này?</p>
      </Modal>
    </>
  )
}

export default PriceBot
