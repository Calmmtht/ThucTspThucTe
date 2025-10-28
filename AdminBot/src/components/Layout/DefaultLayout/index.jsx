import React from 'react'
import Sidebar from '../Sidebar'
import { Layout } from 'antd'
import Header from '../Header'
import Footer from '../Footer'
import { Content } from 'antd/es/layout/layout'

const DefaultLayout = ({ children }) => {
  return (
    <div>
      <Layout>
        <Sidebar />
        <Layout>
          <Header />
          <Content className="m-4 p-4 drop-shadow rounded-lg bg-white">{children}</Content>
          <Footer />
        </Layout>
      </Layout>
    </div>
  )
}

export default DefaultLayout
