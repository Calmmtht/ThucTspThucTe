import React, { useEffect, useState } from 'react'
import { Button, Modal, Spin, Table } from 'antd'
import { formatDateTime, formatVND } from '../../service/commonService'
import { DeleteOutlined } from '@ant-design/icons'
import { useMessage } from '../../App'
import profitLossService from '../../service/profitLossService'

const ProfitLoss = () => {
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
      dataIndex: 'date',
      render: (value) => formatDateTime(value),
    },
    {
      title: 'Lợi nhuận',
      dataIndex: 'price',
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
    profitLossService
      .getProfitLoss()
      .then((res) => setData(res.data))
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleOk = () => {
    setLoadingDelete(true)
    profitLossService
      .deleteProfitLoss(id)
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
        title="Xóa Lợi nhuận của người dùng"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText={loadingDelete ? <Spin /> : 'OK'}
        okButtonProps={{ disabled: loadingDelete }}
      >
        <p>Bạn có chắc chắn xóa lợi nhuận của người dùng này?</p>
      </Modal>
    </>
  )
}

export default ProfitLoss
