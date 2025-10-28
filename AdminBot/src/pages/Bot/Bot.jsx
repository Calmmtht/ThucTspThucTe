import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Modal, Spin, Table } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import botService from '../../service/botService'
import { useMessage } from '../../App'

const columns = (onEdit, setBotId, setIsModalOpen) => [
  {
    title: 'Mã bot',
    dataIndex: 'id',
    //   sorter: (a, b) => a.id - b.id,
  },
  {
    title: 'Tên Bot',
    dataIndex: 'name',
    //   sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: 'Tỷ lệ lãi',
    dataIndex: 'interestRate',
  },
  {
    title: 'Lợi nhuận',
    dataIndex: 'profit',
  },
  {
    title: 'Số lệnh',
    dataIndex: 'commandNumber',
  },
  {
    title: 'Tỉ lệ thắng (%)',
    dataIndex: 'winRate',
  },
  {
    title: 'Thực hiện',
    render: (_, record) => (
      <>
        <Button
          className="mr-2 border-0"
          icon={<EditOutlined />}
          onClick={() => {
            onEdit(record)
            setBotId(record.id)
          }}
        />
        <Button
          className="text-red-600 border-0"
          icon={<DeleteOutlined />}
          onClick={() => {
            setIsModalOpen(true)
            setBotId(record.id)
          }}
        />
      </>
    ),
  },
]

const Bot = () => {
  const { antMessage } = useMessage()
  const [data, setData] = useState([])
  const [form] = Form.useForm()
  const [loadingupdated, setLoadingupdated] = useState(false)
  const [loadingAdd, setLoadingAdd] = useState(false)
  const [editingRecord, setEditingRecord] = useState(false)
  const [botId, setBotId] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)

  const [update, setUpdate] = useState(false)

  useEffect(() => {
    setLoading(true)
    botService
      .getAllBot()
      .then((res) => setData(res.data))
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoading(false))
  }, [update])

  const onEdit = (record) => {
    form.setFieldsValue(record)
    setEditingRecord(true)
  }

  const handleUpdate = () => {
    setLoadingupdated(true)
    const formData = form.getFieldsValue()
    botService
      .updateBot(botId, formData)
      .then(() => {
        antMessage.success('Cập nhật thành công!')
        setEditingRecord(false)
        form.resetFields()
        setBotId('')
        setUpdate(!update)
      })
      .catch((err) => {
        antMessage.error(err.response?.data || err.message)
      })
      .finally(() => setLoadingupdated(false))
  }

  const handleAdd = () => {
    setLoadingAdd(true)
    botService
      .addBot(form.getFieldsValue())
      .then(() => {
        antMessage.success('Thêm bot thành công.')
        form.resetFields()
        setUpdate(!update)
      })
      .catch((err) => antMessage.error(err.response?.data || err.message))
      .finally(() => setLoadingAdd(false))
  }

  const handleOk = () => {
    setLoadingDelete(true)
    botService
      .deleteBot(botId)
      .then(() => {
        const newData = data.filter((item) => !(item.id === botId))
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
    setEditingRecord(false)
    form.resetFields()
  }

  return (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <div className="h-fit md:col-span-2 bg-white rounded-lg drop-shadow">
          <Table
            loading={loading}
            className="overflow-x-auto"
            columns={columns(onEdit, setBotId, setIsModalOpen)}
            dataSource={data}
            rowKey={(record) => record.id}
          />
        </div>
        <div className="h-fit bg-white rounded-lg drop-shadow">
          <div className="text-xl text-center p-4">Bot</div>
          <Form form={form} className="px-4 grid grid-cols-3 gap-2">
            <label htmlFor="name">Tên Bot:</label>
            <Form.Item name="name" className="col-span-2">
              <Input />
            </Form.Item>
            <label htmlFor="interestRate">Lãi suất:</label>
            <Form.Item name="interestRate" className="col-span-2">
              <Input />
            </Form.Item>
            <label htmlFor="profit">Lợi nhuận:</label>
            <Form.Item name="profit" className="col-span-2">
              <Input />
            </Form.Item>
            <label htmlFor="commandNumber">Số lệnh:</label>
            <Form.Item name="commandNumber" className="col-span-2">
              <Input />
            </Form.Item>
            <label htmlFor="winRate">Tỉ lệ thắng:</label>
            <Form.Item name="winRate" className="col-span-2">
              <Input />
            </Form.Item>
            <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
              <Button
                htmlType="submit"
                type="primary"
                size="large"
                className=""
                onClick={handleUpdate}
                disabled={!editingRecord}
              >
                {loadingupdated ? <Spin /> : 'Cập nhật'}
              </Button>
              <Button
                htmlType="submit"
                type="primary"
                size="large"
                className=" "
                onClick={handleAdd}
                disabled={editingRecord}
              >
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
        <Modal
          title="Xóa gói"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText={loadingDelete ? <Spin /> : 'OK'}
          okButtonProps={{ disabled: loadingDelete }}
        >
          <p>Bạn có chắc chắn xóa gói của Bot này?</p>
        </Modal>
      </div>
    </>
  )
}

export default Bot
