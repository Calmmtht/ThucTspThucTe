import React, { useEffect, useState } from 'react'
import { Button, Modal, Spin, Table } from 'antd'
import { formatDateTime, formatVND } from '../../service/commonService'
import logHistoryService from '../../service/logHistoryService'
import { DeleteOutlined, CheckOutlined } from '@ant-design/icons'
import { useMessage } from '../../App'

const LogHistory = () => {
  const { antMessage } = useMessage()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [id, setID] = useState('')
  const [loadingDelete, setLoadingDelete] = useState(false)

  const columns = [
    {
      title: 'Tên người dùng',
      dataIndex: 'fullname',
    },
    {
      title: 'Thời gian',
      dataIndex: 'dateTime',
      render: (value) => formatDateTime(value),
    },
    {
      title: 'Loại lệnh',
      dataIndex: 'signal',
    },
    {
      title: 'Giá đặt',
      dataIndex: 'priceBuy',
    },
    {
      title: 'Giá khớp',
      dataIndex: 'profitPointTP',
    },
    {
      title: 'Cắt lỗ',
      dataIndex: 'isSL',
      render: (value) => {
        return value ? <CheckOutlined /> : '-'
      },
    },
    {
      title: 'Số hợp đồng',
      dataIndex: 'numberContract',
    },
    {
      title: 'Lợi nhuận',
      dataIndex: 'profit',
      render: (value) => formatVND(value),
    },
    {
      title: 'Thực hiện',
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
    setIsLoading(true)
    logHistoryService
      .getLog()
      .then((res) => setData(res.data.logHistory))
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleOk = () => {
    setLoadingDelete(true)
    logHistoryService
      .deleteLog(id)
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

  return (
    <>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={data}
        className="overflow-x-auto"
        rowKey={(record) => record.id}
      />
      <Modal
        title="Xóa Role"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText={loadingDelete ? <Spin /> : 'OK'}
        okButtonProps={{ disabled: loadingDelete }}
      >
        <p>Bạn có chắc chắn xóa gói Role này?</p>
      </Modal>
    </>
  )
}

export default LogHistory
