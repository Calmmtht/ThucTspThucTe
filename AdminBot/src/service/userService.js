import axios from 'axios'
import authHeader from './authHeader'

// const API_URL = 'https://localhost:7043/api/user'
const API_URL = process.env.REACT_APP_BASE_URL + '/api/user'

const getAllUser = async () => await axios.get(API_URL + '/getAll', { headers: authHeader() })

const lockout = async (data) =>
  await axios.post(API_URL + '/lockout', data, { headers: authHeader() })
const unlock = async (data) =>
  await axios.post(API_URL + '/unlock', data, { headers: authHeader() })

const addUser = async (data) => await axios.post(API_URL + '/add', data, { headers: authHeader() })

const getUserRole = async (role) =>
  await axios.get(API_URL + `/getByRole/${role}`, { headers: authHeader() })

const updateUser = async (userId, data) =>
  await axios.put(API_URL + `/update/${userId}`, data, { headers: authHeader() })

const deleteUser = async (userId) =>
  await axios.delete(API_URL + `/delete/${userId}`, { headers: authHeader() })

const addUserRoles = async (data) =>
  await axios.post(API_URL + '/addUserRoles', data, { headers: authHeader() })

const deleteUserRoles = async (userId, data) =>
  await axios.delete(API_URL + `/deleteUserRoles/${userId}`, {
    data: data,
    headers: authHeader(),
  })

const updateServiceEndDate = async (data) =>
  await axios.put(API_URL + `/updateServiceEndDate`, data, { headers: authHeader() })

const userService = {
  getAllUser,
  lockout,
  unlock,
  getUserRole,
  updateUser,
  addUserRoles,
  deleteUserRoles,
  addUser,
  updateServiceEndDate,
  deleteUser,
}

export default userService
