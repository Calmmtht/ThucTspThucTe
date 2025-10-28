import { Avatar, Flex, Popconfirm } from 'antd'
import React, { useEffect, useState } from 'react'
import { LogoutOutlined } from '@ant-design/icons'
import { useAuth } from '../../../App'
import authService from '../../../service/authService'
import authActions from '../../../service/authAction'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const { state, dispatch } = useAuth()
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const user = authService.getCurrentUser()
    user ? setUsername(user.name) : setUsername('')
  }, [state.isAuthenticated])

  const handleLogout = () => {
    dispatch(authActions.LOGOUT)
    authService.logout()
    navigate('/')
  }

  // const [time, setTime] = useState(new Date())

  // useEffect(() => {
  //   const timerId = setInterval(() => {
  //     setTime(new Date())
  //   }, 1000)

  //   return () => clearInterval(timerId) // Cleanup interval on component unmount
  // }, [])

  return (
    <>
      <Flex
        align="center"
        justify="end"
        className="bg-white p-3 space-x-4 text-center sticky top-0 z-30 border-b h-20"
      >
        {/* <div></div>
        <div className="font-sans font-semibold text-xl">{time.toLocaleTimeString()}</div> */}

        <Flex align="center" className="space-x-2">
          {state.isAuthenticated && (
            <span className="text-xl text-slate-700">Hello {username}!</span>
          )}
          <Popconfirm title="Bạn có chắc muốn đăng xuất?" onConfirm={handleLogout}>
            <Avatar
              icon={<LogoutOutlined />}
              style={{ backgroundColor: '#87d068' }}
              className="cursor-pointer"
            />
          </Popconfirm>
        </Flex>
      </Flex>
    </>
  )
}

export default Header
