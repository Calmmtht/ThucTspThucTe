import axios from 'axios'
import authHeader from './authHeader'

// const API_URL = 'https://localhost:7043/api/priceBot'
const API_URL = process.env.REACT_APP_BASE_URL + '/api/role'

const getRoles = async () => await axios.get(API_URL + '/get', { headers: authHeader() })

const updateRole = async (data) =>
  await axios.put(API_URL + `/update`, data, {
    headers: authHeader(),
  })

const addRole = async (role) =>
  await axios.post(API_URL + `/add`, { role }, { headers: authHeader() })

const deleteRole = async (roleId) =>
  await axios.delete(API_URL + `/delete/${roleId}`, { headers: authHeader() })

const roleService = {
  getRoles,
  updateRole,
  addRole,
  deleteRole,
}

export default roleService
