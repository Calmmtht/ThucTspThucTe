import React, { useEffect, useState } from 'react'
import {
  Table,
  Switch,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Spin,
  Tooltip,
  Flex,
  DatePicker,
  Popconfirm,
} from 'antd'
import userService from '../../service/userService'
import { useMessage } from '../../App'
import { EditTwoTone, DeleteTwoTone, PlusCircleOutlined } from '@ant-design/icons'
import roleService from '../../service/roleService'
import { formatDateTime, getISOString } from '../../service/commonService'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

const dateFormat = 'YYYY/MM/DD'

const columns = (handleLockOut, onEditUser, lockoutLoading, handleDeleteUser) => [
  {
    title: 'Tên người dùng',
    dataIndex: 'fullname',
    sorter: (a, b) => a.fullname.localeCompare(b),
  },
  {
    title: 'Tên đăng nhập',
    dataIndex: 'userName',
    sorter: (a, b) => a.userName - b.userName,
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Quyền',
    dataIndex: 'roles',
    render: (roles) => roles.join(' - '),
  },
  {
    title: 'Ngày hết hạn dịch vụ',
    dataIndex: 'serviceEndDate',
    render: (value) => value && formatDateTime(value),
  },
  {
    title: 'Khóa tài khoản',
    dataIndex: 'lockoutEnable',
    align: 'center',
    render: (value, record) => (
      <Switch
        loading={lockoutLoading}
        onClick={(value) => handleLockOut(value, record.userId)}
        defaultValue={value}
      />
    ),
  },
  {
    title: 'Thực hiện',
    align: 'center',
    render: (_, record) => (
      <Flex justify="center" align="center" className="space-x-1">
        <Tooltip title="Chỉnh sửa">
          <Button onClick={() => onEditUser(record)}>
            <EditTwoTone />
          </Button>
        </Tooltip>
        <Popconfirm
          title={`Xác nhận xóa ${record.fullname}`}
          onConfirm={() => handleDeleteUser(record.userId)}
        >
          <Button>
            <DeleteTwoTone />
          </Button>
        </Popconfirm>
      </Flex>
    ),
  },
]

const Users = () => {
  const [form] = Form.useForm()
  const [formAddUser] = Form.useForm()
  const { antMessage } = useMessage()
  const [isLoading, setIsLoading] = useState(false)
  const [lockoutLoading, setLockoutLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [isUpdateUserInfo, setIsUpdateUserInfo] = useState(false)
  const [isUpdateRoles, setIsUpdateRoles] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalAddUserOpen, setIsModalAddUserOpen] = useState(false)

  const [isChangeServiceEndDate, setIsChangeServiceEndDate] = useState(false)

  const [data, setData] = useState([])
  const [roles, setRoles] = useState([])

  const [currentRoles, setCurrentRoles] = useState([])
  const [previousRoles, setPreviousRoles] = useState([])

  const [userId, setUserId] = useState('')
  const [update, setUpdate] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    userService
      .getAllUser()
      .then((res) => setData(res.data))
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false))

    roleService.getRoles().then((res) => {
      setRoles(
        res.data.map((item) => {
          return {
            value: item.name,
            label: item.name,
          }
        }),
      )
    })
  }, [update])

  const handleLockOut = (isChecked, userId) => {
    const data = { userId: userId }
    setLockoutLoading(true)
    if (isChecked) {
      userService
        .lockout(data)
        .then(() => {
          antMessage.success('Đã khóa tài khoản')
          setLockoutLoading(false)
        })
        .catch((err) => antMessage.error(err.response?.data || err.message))
        .finally(() => setLockoutLoading(false))
    } else {
      userService
        .unlock(data)
        .then(() => {
          antMessage.success('Đã mở khóa tài khoản')
          setLockoutLoading(false)
        })
        .catch((err) => antMessage.error(err.response?.data || err.message))
        .finally(() => setLockoutLoading(false))
    }
  }

  const handleChangeUserInfo = async () => {
    try {
      const values = await form.validateFields()

      const lostRoles = previousRoles.filter((role) => !currentRoles.includes(role))
      const addedRoles = currentRoles.filter((role) => !previousRoles.includes(role))

      setUpdateLoading(true)
      isUpdateUserInfo && (await userService.updateUser(userId, values))

      addedRoles.length > 0 &&
        (await userService.addUserRoles({ userId: userId, roles: addedRoles }))

      lostRoles.length > 0 && (await userService.deleteUserRoles(userId, { roles: lostRoles }))

      isChangeServiceEndDate &&
        (await userService.updateServiceEndDate({
          userId: userId,
          serviceEndDate: values.serviceEndDate && getISOString(values.serviceEndDate),
        }))

      antMessage.success('Cập nhật thành công')
      setIsModalOpen(false)
      setUpdateLoading(false)
      setUpdate(!update)
    } catch (err) {
      console.log(err)
      antMessage.error(err.response?.data?.title || err.response?.data || err.message)
      setUpdateLoading(false)
    }
  }

  const handleDeleteUser = async (userId) =>
    await userService
      .deleteUser(userId)
      .then(() => {
        setUpdate(!update)
        antMessage.success('Đã xóa người dùng')
      })
      .catch((err) =>
        antMessage.error(err.response?.data?.title || err.response?.data || err.message),
      )

  const handleCancle = () => {
    setIsModalOpen(false)
    form.resetFields()
  }

  const handleAddUserCancle = () => {
    setIsModalAddUserOpen(false)
    formAddUser.resetFields()
  }

  const onEditUser = (record) => {
    setIsModalOpen(true)
    setIsUpdateRoles(false)
    setIsUpdateUserInfo(false)

    let newValue = record
    if (record.serviceEndDate) {
      newValue = {
        ...record,
        serviceEndDate: dayjs(record.serviceEndDate, dateFormat),
      }
    }
    form.setFieldsValue(newValue)
    setUserId(record.userId)
    setPreviousRoles(record.roles)
    setCurrentRoles(record.roles)
  }

  const onAddUser = () => {
    setIsModalAddUserOpen(true)
  }

  const handleAddUser = async () => {
    try {
      const values = await formAddUser.validateFields()
      setUpdateLoading(true)
      userService
        .addUser(values)
        .then(() => {
          antMessage.success('Thêm người dùng thành công')
          setIsModalAddUserOpen(false)
          setUpdateLoading(false)
          setUpdate(!update)
        })
        .catch((err) => {
          antMessage.error(err.response?.data || err.message)
          setUpdateLoading(false)
        })
    } catch (err) {}
  }

  return (
    <>
      <Flex align="center" justify="end" className="border-0 space-x-2">
        <Tooltip title="Thêm người dùng">
          <Button type="primary" className="w-20" onClick={onAddUser}>
            <PlusCircleOutlined />
          </Button>
        </Tooltip>
      </Flex>
      <Table
        loading={isLoading}
        columns={columns(handleLockOut, onEditUser, lockoutLoading, handleDeleteUser)}
        dataSource={data}
        className="overflow-x-auto mt-2"
        rowKey={(record) => record.userId}
      />
      <Modal
        title="Thay đổi thông tin"
        open={isModalOpen}
        onOk={handleChangeUserInfo}
        onCancel={handleCancle}
        maskClosable={false}
        okButtonProps={{
          disabled: updateLoading || !(isUpdateUserInfo || isUpdateRoles || isChangeServiceEndDate),
        }}
        okText={updateLoading ? <Spin /> : 'Xác nhận'}
        cancelButtonProps={{ disabled: updateLoading }}
      >
        <Form form={form} disabled={updateLoading} onValuesChange={() => setIsUpdateUserInfo(true)}>
          <Form.Item
            name="fullname"
            rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}
          >
            <Input size="large" placeholder="Tên người dùng" />
          </Form.Item>
          <Form.Item
            name="userName"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
          >
            <Input size="large" placeholder="Tên đăng nhập" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ email' }]}
          >
            <Input size="large" placeholder="Địa chỉ email" />
          </Form.Item>
          <Form.Item name="serviceEndDate">
            <DatePicker
              className="w-full"
              size="large"
              format={{
                format: 'DD-MM-YYYY',
                type: 'mask',
              }}
              onChange={() => setIsChangeServiceEndDate(true)}
              placeholder="Ngày hết hạn dịch vụ"
            />
          </Form.Item>
          <Form.Item name="password">
            <Input.Password size="large" placeholder="Mật khẩu mới" />
          </Form.Item>
        </Form>
        <Select
          size="large"
          mode="multiple"
          className="w-full"
          value={currentRoles}
          onChange={(values) => {
            setIsUpdateRoles(true)
            setCurrentRoles(values)
          }}
          options={roles}
          placeholder="Quyền"
        />
      </Modal>

      <Modal
        title="Thêm người dùng mới"
        open={isModalAddUserOpen}
        onOk={handleAddUser}
        onCancel={handleAddUserCancle}
        maskClosable={false}
        okButtonProps={{ disabled: updateLoading }}
        okText={updateLoading ? <Spin /> : 'Xác nhận'}
        cancelButtonProps={{ disabled: updateLoading }}
      >
        <Form form={formAddUser} disabled={updateLoading}>
          <Form.Item
            name="fullname"
            rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}
          >
            <Input size="large" placeholder="Tên người dùng" />
          </Form.Item>
          <Form.Item
            name="userName"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
          >
            <Input size="large" placeholder="Tên đăng nhập" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ email' }]}
          >
            <Input size="large" placeholder="Địa chỉ email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password size="large" placeholder="Mật khẩu" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Users
