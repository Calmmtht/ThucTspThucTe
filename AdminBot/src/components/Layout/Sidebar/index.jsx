// import Sider from 'antd/es/layout/Sider';
import React, { useEffect, useLayoutEffect, useState } from 'react'

import { Menu } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { useLocation, useNavigate } from 'react-router-dom'
import { navigateItems } from '../../../routes'
import { useAuth } from '../../../App'

import style from './Sidebar.module.css'

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const { state } = useAuth()
  const location = useLocation()
  const [navItems, setNavItems] = useState(navigateItems)

  const regex = location.pathname.match(/^\/[^/]+/)?.at(0) ?? '/'
  const [navSelected, setNavSelected] = useState(regex)

  const handleMenuClick = ({ key }) => navigate(key)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useLayoutEffect(() => {
    if (state.isAuthenticated) setNavItems(navigateItems.filter((e) => e.key !== '/login'))
    else setNavItems(navigateItems)
    setNavSelected(regex)
  }, [state.isAuthenticated, location.pathname, regex])

  return (
    <>
      <Sider
        className={`h-screen top-0 overflow-y-auto ${style.scrollBarHidden}`}
        collapsible
        collapsed={collapsed}
        breakpoint="md"
        onBreakpoint={() => setCollapsed(false)}
        onCollapse={(value) => setCollapsed(value)}
        style={{ position: 'sticky' }}
      >
        {/* <Flex className="text-center justify-center text-2xl p-10">
          <BankTwoTone />
        </Flex> */}
        <Menu
          defaultSelectedKeys={[navSelected]}
          selectedKeys={navSelected}
          className="h-full"
          theme="dark"
          // defaultSelectedKeys={['1']}
          mode="inline"
          items={navItems}
          onClick={handleMenuClick}
        />
      </Sider>
    </>
  )
}

export default Sidebar
