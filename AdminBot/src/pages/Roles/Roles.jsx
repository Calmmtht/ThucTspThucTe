import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Modal, Spin, Table } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useMessage } from '../../App'
import roleService from '../../service/roleService'

const Roles = () => {
  const { antMessage } = useMessage()
  const [data, setData] = useState([])
  const [form] = Form.useForm()
  const [loadingAdd, setLoadingAdd] = useState(false)
  const [loadingUpdated, setLoadingUpdated] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [id, setID] = useState('')
  const [loadingDelete, setLoadingDelete] = useState(false)

  const [update, setUpdate] = useState(false)

  const columns = (onEdit) => [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   render: (value) => <div className="w-32 truncate">{value}</div>,
    //   width: 150,
    // },
    {
      title: 'Quyền',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b),
    },

    {
      title: 'Action',
      render: (_, record) => (
        <>
          <Button
            className="mr-2 border-0"
            icon={<EditOutlined />}
            onClick={() => {
              setID(record.id)
              onEdit(record)
            }}
          />
          <Button
            className="text-red-600 border-0"
            icon={<DeleteOutlined />}
            onClick={() => {
              setIsModalOpen(true)
              setID(record.id)
            }}
          />
        </>
      ),
    },
  ]

  useEffect(() => {
    setLoading(true)
    roleService
      .getRoles()
      .then((res) => setData(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }, [update])

  const onEdit = (record) => {
    form.setFieldsValue(record)
    setIsEditing(true)
  }

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields()
      setLoadingUpdated(true)
      roleService
        .updateRole({ newRole: values.name, id: id })
        .then((res) => {
          antMessage.success('Cập nhật thành công!')
          setIsEditing(false)
          setUpdate(!update)
          form.resetFields()
        })
        .catch((err) => antMessage.error(err.response?.data || err.message))
        .finally(() => setLoadingUpdated(false))
    } catch (error) {}
  }

  const handleAdd = async () => {
    try {
      const values = await form.validateFields()

      setLoadingAdd(true)
      roleService
        .addRole(values.name)
        .then((res) => {
          antMessage.success('Thêm quyền thành công.')
          setIsEditing(true)
          setUpdate(!update)
          form.resetFields()
        })
        .catch((err) => {
          console.log(err)
          antMessage.error(err.response?.data || err.message)
        })
        .finally(() => setLoadingAdd(false))
    } catch (error) {}
  }

  const handleOk = () => {
    setLoadingDelete(true)
    roleService
      .deleteRole(id)
      .then(() => {
        const newData = data.filter((item) => !(item.id === id))
        setData(newData)
        antMessage.success('Xóa thành công.')
      })
      .catch((err) => {
        console.log(err)
        antMessage.error(err.response?.data || err.message)
      })
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
            className="overflow-x-auto"
            columns={columns(onEdit)}
            dataSource={data}
            rowKey={(record) => record.id}
          />
        </div>
        <div className="h-fit bg-white rounded-lg drop-shadow">
          <div className="text-xl text-center p-4">Quyền</div>
          <Form form={form} className="px-4 grid grid-cols-3 gap-2">
            <label htmlFor="name">Tên quyền:</label>
            <Form.Item
              name="name"
              className="col-span-2"
              rules={[{ required: true, message: 'Vui lòng nhập quyền' }]}
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
        title="Xóa Role"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={loadingDelete ? <Spin /> : 'OK'}
        okButtonProps={{ disabled: loadingDelete }}
      >
        <p>Bạn có chắc chắn xóa gói Role này?</p>
      </Modal>
    </>
  )
}

export default Roles
