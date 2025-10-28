import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import userBotService from '../../service/userBotService'

const UserBot = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])

  const columns = [
    {
      title: 'Người dùng Bot',
      dataIndex: 'user',
      render: (record) => (
        <>
          <span>{record.fullname}</span> - <span>{record.userName}</span>
        </>
      ),
      sorter: (a, b) => a.userId - b.userId,
    },
    {
      title: 'Thông tin Bot',
      dataIndex: 'bot',
      render: (record) => <span>{record.name}</span>,
      sorter: (a, b) => a.botTradingId - b.botTradingId,
    },
  ]

  useEffect(() => {
    setIsLoading(true)
    userBotService
      .getAllUserBot()
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
      rowKey={(record) => record.user?.userId + record.bot?.id}
    />
  )
}

export default UserBot
