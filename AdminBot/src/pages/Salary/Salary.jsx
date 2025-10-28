import React, { useEffect, useState } from 'react'
import { Button, Form, Input, InputNumber, Modal, Select, Spin, Table } from 'antd'
import salaryService from '../../service/salaryService'
import userService from '../../service/userService'
import { useMessage } from '../../App'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { formatVND } from '../../service/commonService'

const { Option } = Select

const Salary = () => {
  const { antMessage } = useMessage()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState()
  const [form] = Form.useForm()
  const [loadingAdd, setLoadingAdd] = useState()
  const [userOptions, setUserOptions] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loadingUpdated, setLoadingUpdated] = useState(false)
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [userId, setUserId] = useState('')
  const [loadingDelete, setLoadingDelete] = useState(false)

  const [update, setUpdate] = useState(false)

  const columns = (onEdit) => [
    {
      title: 'Tên nhân viên',
      dataIndex: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(),
    },
    {
      title: 'Lương tháng',
      dataIndex: 'month',
      sorter: (a, b) => a.month - b.month,
    },
    {
      title: 'Năm',
      dataIndex: 'year',
      sorter: (a, b) => a.year - b.year,
    },

    {
      title: 'Tiền lương',
      dataIndex: 'price',
      sorter: (a, b) => a.month - b.month,
      render: (value) => formatVND(value),
    },
    {
      title: 'Tiền thưởng',
      dataIndex: 'bonus',
      sorter: (a, b) => a.bonus - b.bonus,
      render: (value) => formatVND(value),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
    },
    {
      title: 'Thực hiện',
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
              setYear(record.year)
              setUserId(record.userId)
            }}
          />
        </>
      ),
    },
  ]

  useEffect(() => {
    setLoading(true)
    salaryService
      .getAllSalary()
      .then((res) => setData(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))

    userService
      .getUserRole('Employee')
      .then((res) => setUserOptions(res.data))
      .catch((err) => console.log(err))
  }, [update])

  const onEdit = (record) => {
    form.setFieldsValue(record)
    setIsEditing(true)
  }

  const handleAdd = async () => {
    try {
      const values = await form.validateFields()

      setLoadingAdd(true)
      salaryService
        .addSalary(values)
        .then(() => {
          antMessage.success('Thêm lương thành công.')
          setUpdate(!update)
          form.resetFields()
        })
        .catch((err) => antMessage.error(err.response?.data || err.message))
        .finally(() => setLoadingAdd(false))
    } catch (error) {}
  }

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields()

      setLoadingUpdated(true)
      salaryService
        .updateSalary(values.month, values.year, values.userId, values)
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

  const handleDelete = () => {
    setLoadingDelete(true)
    salaryService
      .deleteSalary(month, year, userId)
      .then(() => {
        const newData = data.filter(
          (item) => !(item.month === month && item.year === year && item.userId === userId),
        )
        setData(newData)
        antMessage.success('Xóa thành công.')
      })
      .catch((err) => antMessage.error(err.response?.data || err.message))
      .finally(() => {
        setLoadingDelete(false)
        setIsModalOpen(false)
      })
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
            columns={columns(onEdit)}
            dataSource={data}
            className="overflow-x-auto"
            rowKey={(record) => record.userId + record.month + record.year}
          />
        </div>
        <div className="h-fit bg-white rounded-lg drop-shadow">
          <div className="text-xl text-center p-4">Lương nhân viên</div>
          <Form form={form} className="px-4 grid grid-cols-3 gap-2">
            <label htmlFor="userId">Tên nhân viên:</label>
            <Form.Item
              name="userId"
              className="col-span-2"
              rules={[{ required: true, message: 'Chọn tên nhân viên' }]}
            >
              <Select disabled={isEditing}>
                {userOptions.map((user) => (
                  <Option key={user.userId} value={user.userId}>
                    {user.fullname}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <label htmlFor="month">Tháng:</label>
            <Form.Item
              name="month"
              className="col-span-2"
              rules={[{ required: true, message: 'Chọn tháng' }]}
            >
              <Select disabled={isEditing}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <Option key={month} value={month}>
                    {month}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <label htmlFor="year">Năm:</label>
            <Form.Item
              name="year"
              className="col-span-2"
              rules={[{ required: true, message: 'Năm là bắt buộc' }]}
            >
              <InputNumber className="w-full" disabled={isEditing} />
            </Form.Item>
            <label htmlFor="price">Lương:</label>
            <Form.Item
              name="price"
              className="col-span-2"
              rules={[{ required: true, message: 'Nhập lương' }]}
            >
              <InputNumber
                className="w-full"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
            <label htmlFor="bonus">Thưởng:</label>
            <Form.Item
              name="bonus"
              className="col-span-2"
              rules={[{ required: true, message: 'Tiền thưởng nhân viên' }]}
            >
              <InputNumber
                className="w-full"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
            <label htmlFor="description">Mô tả:</label>
            <Form.Item
              name="description"
              className="col-span-2"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
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
      <Modal
        title="Xóa Bảng lương"
        open={isModalOpen}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText={loadingDelete ? <Spin /> : 'OK'}
        okButtonProps={{ disabled: loadingDelete }}
      >
        <p>Bạn có chắc chắn xóa lương của nhân viên này?</p>
      </Modal>
    </>
  )
}

export default Salary
