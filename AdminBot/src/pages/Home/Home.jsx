import { ArrowDownOutlined, MoneyCollectFilled, DollarTwoTone } from '@ant-design/icons'
import { DatePicker, Card, Statistic, Table, Skeleton, Divider } from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import statisticService from '../../service/statisticService'
import { formatDate, formatVND, getISOString } from '../../service/commonService'
import { useLayoutEffect, useState } from 'react'

const { RangePicker } = DatePicker

const purchaseColumns = [
  {
    title: 'Tên',
    dataIndex: 'userId',
  },
  {
    title: 'Phương thức',
    dataIndex: 'paymentMethod',
  },
  {
    title: 'Ngày mua',
    dataIndex: 'date',
    render: (value) => formatDate(value),
  },
  {
    title: 'Ngày kết thúc',
    dataIndex: 'endDate',
    render: (value) => formatDate(value),
  },
  {
    title: 'Số tiền',
    dataIndex: 'priceBot',
    render: (value) => formatVND(value),
    sorter: (a, b) => a.priceBot - b.priceBot,
  },
]

const expenseColumns = [
  {
    title: 'Loại chi',
    dataIndex: 'name',
    render: (value) => value ?? 'Lương nhân viên',
  },
  {
    title: 'Ngày',
    dataIndex: 'date',
    render: (value, record) => (value ? formatDate(value) : record.month + '/' + record.year),
  },
  {
    title: 'Số tiền',
    dataIndex: 'price',
    render: (value) => formatVND(value),
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
  },
]

const salaryColumns = [
  {
    title: 'Tên nhân viên',
    dataIndex: 'fullName',
  },
  {
    title: 'Tháng',
    dataIndex: 'month',
    sorter: (a, b) => a.month - b.month,
  },
  {
    title: 'Lương',
    dataIndex: 'price',
    render: (value) => formatVND(value),
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: 'Thưởng',
    dataIndex: 'bonus',
    render: (value) => formatVND(value),
    sorter: (a, b) => a.bonus - b.bonus,
  },
  {
    title: 'Tổng lương',
    render: (_, record) => formatVND(record.price + record.bonus),
    sorter: (a, b) => a.bonus - b.bonus,
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
  },
]

const Home = () => {
  const [expenseData, setExpenseData] = useState([])
  const [salaryData, setSalaryData] = useState([])
  const [purchaseData, setPurchaseData] = useState([])

  const [totalObj, setTotalObj] = useState({})
  const [totalThisMonth, setTotalThisMonth] = useState({})
  const [total, setTotal] = useState(0)

  const [loading, setLoading] = useState(false)
  const [totalLoading, setTotalLoading] = useState(false)

  useLayoutEffect(() => {
    const today = new Date()
    const start = getISOString(new Date(today.getFullYear(), today.getMonth(), 1))
    const end = getISOString(new Date(today.getFullYear(), today.getMonth() + 1, 0))

    setTotalLoading(true)
    statisticService
      .getStatistics(start, end)
      .then((res) => {
        setTotalThisMonth({
          expense: res.data.expense.total,
          salary: res.data.salary.total,
          purchaseHistory: res.data.purchaseHistory.total,
        })
      })
      .finally(() => setTotalLoading(false))
  }, [])

  const handleStatistic = (rangeDate) => {
    if (rangeDate) {
      setLoading(true)
      setExpenseData([])
      setSalaryData([])
      setPurchaseData([])

      const start = getISOString(rangeDate[0].format())
      const end = getISOString(rangeDate[1].format())
      statisticService
        .getStatistics(start, end)
        .then((res) => {
          setExpenseData(res.data.expense.expenseList)
          setSalaryData(res.data.salary.salaryList)
          setPurchaseData(res.data.purchaseHistory.purchases)
          setTotalObj({
            expense: res.data.expense.total,
            salary: res.data.salary.total,
            purchaseHistory: res.data.purchaseHistory.total,
          })
          setTotal(res.data.total)
        })
        .finally(() => setLoading(false))
    }
  }
  return (
    <>
      <div className="space-y-4">
        <Divider>Tháng hiện tại</Divider>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-blue-500 shadow-sm" bordered>
            <Statistic
              title={<span className="text-white font-semibold">Doanh thu</span>}
              value={formatVND(totalThisMonth.purchaseHistory)}
              precision={2}
              valueStyle={{
                color: 'whitesmoke',
              }}
              loading={totalLoading}
              prefix={<DollarTwoTone className="text-2xl" />}
            />
          </Card>
          <Card className="bg-rose-500 shadow-sm" bordered>
            <Statistic
              title={<span className="text-white font-semibold">Chi tiêu</span>}
              value={formatVND(totalThisMonth.expense)}
              precision={2}
              valueStyle={{
                color: 'whitesmoke',
              }}
              loading={totalLoading}
              prefix={<ArrowDownOutlined className="text-2xl" />}
            />
          </Card>
          <Card className="bg-emerald-500 shadow-sm" bordered>
            <Statistic
              title={<span className="text-white font-semibold">Lương nhân viên</span>}
              value={formatVND(totalThisMonth.salary)}
              precision={2}
              valueStyle={{
                color: 'whitesmoke',
              }}
              loading={totalLoading}
              prefix={<MoneyCollectFilled className="text-2xl" />}
            />
          </Card>
          <Card className="bg-amber-400 shadow-sm" bordered>
            <Statistic
              title={<span className="text-white font-semibold">Tổng</span>}
              valueStyle={{
                color: 'red',
                fontWeight: 'bold',
              }}
              value={formatVND(
                totalThisMonth.purchaseHistory - (totalThisMonth.expense + totalThisMonth.salary),
              )}
              loading={totalLoading}
            />
          </Card>
        </div>
        <Divider>Thống kê theo ngày</Divider>
        <Card className="bg-gray-100 shadow-sm">
          <div className="space-y-4">
            <RangePicker onChange={handleStatistic} className="w-full" locale={locale} />
            {loading && <Skeleton />}
            {total !== 0 && !loading && (
              <Card bordered>
                <Statistic
                  title="Tổng cộng"
                  valueStyle={{
                    color: total > 0 ? 'yellowgreen' : 'red',
                  }}
                  value={formatVND(total)}
                />
              </Card>
            )}
            {purchaseData.length > 0 && (
              <div className="overflow-x-auto">
                <Table
                  title={() => <span className="text-lg font-semibold">Doanh thu</span>}
                  className="shadow-sm "
                  columns={purchaseColumns}
                  dataSource={purchaseData}
                  rowKey={(record) => record.id}
                  footer={(e) => (
                    <span className="text-lg font-semibold">
                      Tổng cộng: {formatVND(totalObj.purchaseHistory)}
                    </span>
                  )}
                />
              </div>
            )}
            {expenseData.length > 0 && (
              <div className="overflow-x-auto ">
                <Table
                  title={() => <span className="text-lg font-semibold">Chi</span>}
                  className="min-w-full shadow-sm"
                  columns={expenseColumns}
                  dataSource={expenseData}
                  rowKey={(record) => record.id}
                  footer={(e) => (
                    <span className="text-lg font-semibold">
                      Tổng cộng: {formatVND(totalObj.expense)}
                    </span>
                  )}
                />
              </div>
            )}
            {salaryData.length > 0 && (
              <div className="overflow-x-auto ">
                <Table
                  title={() => <span className="text-lg font-semibold">Lương nhân viên</span>}
                  className="min-w-full shadow-sm"
                  columns={salaryColumns}
                  dataSource={salaryData}
                  rowKey={(record) => record.month + record.year + record.userId}
                  footer={(e) => (
                    <span className="text-lg font-semibold">
                      Tổng cộng: {formatVND(totalObj.salary)}
                    </span>
                  )}
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  )
}

export default Home
