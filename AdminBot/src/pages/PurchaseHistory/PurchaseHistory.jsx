import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import purchaseHistoryService from '../../service/purchaseHistoryService'
import { formatDate, formatVND } from '../../service/commonService'

const PurchaseHistory = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState()

  const columns = [
    {
      title: 'Tên người dùng',
      dataIndex: 'userId',
    },
    {
      title: 'Giá gói',
      dataIndex: 'priceBot',
      sorter: (a, b) => a.priceBot - b.priceBot,
      render: (value) => formatVND(value),
    },
    {
      title: 'Ngày bắt đầu của gói',
      dataIndex: 'startDate',
      render: (value) => formatDate(value),
    },

    {
      title: 'Ngày kết thúc gói',
      dataIndex: 'endDate',
      render: (value) => formatDate(value),
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
    },
  ]

  useEffect(() => {
    setIsLoading(true)
    purchaseHistoryService
      .getPurchaseHistory()
      .then((res) => setData(res.data))
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <Table
      loading={isLoading}
      columns={columns}
      dataSource={data}
      className="overflow-x-auto"
      rowKey={(record) => record.id}
    />
  )
}

export default PurchaseHistory
