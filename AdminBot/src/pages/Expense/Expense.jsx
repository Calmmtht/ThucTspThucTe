import React, { useEffect, useState } from 'react'
import { Button, DatePicker, Form, Input, InputNumber, Modal, Spin, Table } from 'antd'
import expenseService from '../../service/expenseService'
import { formatDate, formatVND, getISOString } from '../../service/commonService'
import { useMessage } from '../../App'
import { DeleteOutlined } from '@ant-design/icons'

const Expense = () => {
  const [data, setData] = useState([])
  const [form] = Form.useForm()
  const [loadingAdd, setLoadingAdd] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(false)
  const { antMessage } = useMessage()
  const [loading, setLoading] = useState(false)
  const [id, setID] = useState('')
  const [loadingDelete, setLoadingDelete] = useState(false)

  const columns = [
    {
      title: 'Loại chi',
      dataIndex: 'name',
      sorter: (a, b) => a.userName - b.userName,
    },
    {
      title: 'Số tiền',
      dataIndex: 'price',
      render: (value) => formatVND(value),
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      render: (value) => formatDate(value),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Button
          className="text-red-600 border-0"
          icon={<DeleteOutlined />}
          onClick={() => {
            setIsModalOpen(true)
            setID(record.id)
          }}
        />
      ),
    },
  ]

  useEffect(() => {
    setLoading(true)
    form.setFieldValue('description', '-')
    expenseService
      .getExpense()
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }, [editingRecord, form])

  const handleAdd = () => {
    const nData = {
      ...form.getFieldsValue(),
      date: getISOString(form.getFieldValue('date').format()), //dayjs
    }

    setLoadingAdd(true)
    expenseService
      .addExpense(nData)
      .then(() => {
        antMessage.success('Thêm thành công.')
        setEditingRecord(!editingRecord)
        form.resetFields()
      })
      .catch((err) =>
        antMessage.error(err.response?.data.title || err.response?.data || err.message),
      )
      .finally(() => setLoadingAdd(false))
  }

  const handleOk = () => {
    setLoadingDelete(true)
    expenseService
      .deleteExpense(id)
      .then(() => {
        const newData = data.filter((item) => !(item.id === id))
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

  // return <Table columns={columns} dataSource={data} rowKey={(record) => record.id} />
  return (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <div className="h-fit md:col-span-2 bg-white rounded-lg drop-shadow">
          <Table
            loading={loading}
            className="overflow-x-auto"
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.id}
          />
        </div>
        <div className="h-fit bg-white rounded-lg drop-shadow">
          <div className="text-xl text-center p-4">Chi tiêu</div>
          <Form form={form} onFinish={handleAdd} className="px-4 grid grid-cols-3 gap-2">
            <label htmlFor="name">Tên:</label>
            <Form.Item
              name="name"
              className="col-span-2"
              rules={[
                {
                  required: true,
                  message: 'Bắt buộc.',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <label htmlFor="price">Giá:</label>
            <Form.Item
              name="price"
              className="col-span-2"
              rules={[
                {
                  required: true,
                  message: 'Bắt buộc.',
                },
              ]}
            >
              <InputNumber
                className="w-full"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
            <label htmlFor="date">Ngày:</label>
            <Form.Item
              name="date"
              className="col-span-2"
              rules={[
                {
                  required: true,
                  message: 'Bắt buộc.',
                },
              ]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <label htmlFor="name">Mô tả:</label>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: 'Bắt buộc.',
                },
              ]}
              name="description"
              className="col-span-2"
            >
              <Input />
            </Form.Item>

            <div className="col-span-3 flex justify-center items-center space-x-2 mb-2">
              <Button htmlType="submit" type="primary" size="large">
                {loadingAdd ? <Spin /> : 'Thêm'}
              </Button>
            </div>
          </Form>
        </div>
      </div>
      <Modal
        title="Xóa chi tiêu"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={loadingDelete ? <Spin /> : 'OK'}
        okButtonProps={{ disabled: loadingDelete }}
      >
        <p>Bạn có chắc chắn xóa chi tiêu này?</p>
      </Modal>
    </>
  )
}

export default Expense
