import { Fragment } from 'react'
import DefaultLayout from '../components/Layout/DefaultLayout'
import { Navigate, Route } from 'react-router-dom'
import {
  PieChartOutlined,
  UserOutlined,
  FileZipOutlined,
  MoneyCollectOutlined,
  QqOutlined,
  DollarCircleFilled,
  HistoryOutlined,
  RobotFilled,
  RocketOutlined,
  UsergroupDeleteOutlined,
  MacCommandOutlined,
  SendOutlined,
  FormOutlined,
  MoneyCollectFilled,
} from '@ant-design/icons'
import Users from '../pages/Users'
import File from '../pages/File'
import Salary from '../pages/Salary'
import PriceBot from '../pages/PriceBot'
import Login from '../pages/Login'
import Expense from '../pages/Expense'
import Bot from '../pages/Bot'
import Command from '../pages/Command'
import Home from '../pages/Home'
import UserBot from '../pages/UserBot'
import PurchaseHistory from '../pages/PurchaseHistory'
import Roles from '../pages/Roles'
import LogHistory from '../pages/LogHistory'
import ProfitLoss from '../pages/ProfitLoss'

export const navigateItems = [
  { key: '/home', icon: <PieChartOutlined />, label: 'Thống kê' },
  { key: '/command', icon: <SendOutlined />, label: 'Đặt lệnh' },
  {
    key: '1',
    label: 'Người dùng',
    icon: <UsergroupDeleteOutlined />,
    children: [
      { key: '/users', icon: <UserOutlined />, label: 'Người dùng' },
      { key: '/user-bot', icon: <QqOutlined />, label: 'Người dùng Bot' },
      { key: '/profit-loss', icon: <MoneyCollectFilled />, label: 'Lợi nhuận người dùng' },
    ],
  },
  {
    key: '2',
    label: 'Lịch sử',
    icon: <HistoryOutlined />,
    children: [
      { key: '/purchase-history', icon: <HistoryOutlined />, label: 'Lịch sử mua Bot' },
      { key: '/log-history', icon: <FormOutlined />, label: 'Lịch sử đặt lệnh' },
    ],
  },
  {
    key: '3',
    label: 'Quản lý Bot',
    icon: <RobotFilled />,
    children: [
      { key: '/bot', icon: <RobotFilled />, label: 'Bot' },
      { key: '/price-bot', icon: <MoneyCollectOutlined />, label: 'Gói Bot' },
    ],
  },
  {
    key: '4',
    label: 'Quản lý nội bộ',
    icon: <MacCommandOutlined />,
    children: [
      { key: '/expenes', icon: <MoneyCollectOutlined />, label: 'Chi tiêu' },
      { key: '/salary', icon: <DollarCircleFilled />, label: 'Lương nhân viên' },
      { key: '/role', icon: <RocketOutlined />, label: 'Quyền' },
      { key: '/file', icon: <FileZipOutlined />, label: 'File' },
    ],
  },
]

const publicRoutes = [{ path: '/', component: Login, layout: null }]

export const privateRoutes = [
  { path: '/home', component: Home },
  { path: '/command', component: Command },
  { path: '/users', component: Users },
  { path: '/user-bot', component: UserBot },
  { path: '/price-bot', component: PriceBot },
  { path: '/expenes', component: Expense },
  { path: '/bot', component: Bot },
  { path: '/salary', component: Salary },
  { path: '/purchase-history', component: PurchaseHistory },
  { path: '/role', component: Roles },
  { path: '/file', component: File },
  { path: '/log-history', component: LogHistory },
  { path: '/profit-loss', component: ProfitLoss },
]

export const generatePublicRoutes = (isAuthenticated) => {
  return publicRoutes.map((route, index) => {
    const Page = route.component
    let Layout = DefaultLayout

    if (route.layout) {
      Layout = route.layout
    } else if (route.layout === null) {
      Layout = Fragment
    }
    if (isAuthenticated && route.path === '/') {
      return <Route key={index} path={route.path} element={<Navigate to="/home" />} />
    }
    return (
      <Route
        key={index}
        path={route.path}
        element={
          <Layout>
            <Page />
          </Layout>
        }
      />
    )
  })
}

export const generatePrivateRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return privateRoutes.map((route, index) => {
      const Page = route.component
      let Layout = DefaultLayout

      if (route.layout) {
        Layout = route.layout
      } else if (route.layout === null) {
        Layout = Fragment
      }
      return (
        <Route
          key={index}
          path={route.path}
          element={
            <Layout>
              <Page />
            </Layout>
          }
        />
      )
    })
  } else {
    return privateRoutes.map((route, index) => (
      <Route key={index} path={route.path} element={<Navigate to="/" />} />
    ))
  }
}
