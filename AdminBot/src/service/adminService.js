import axios from 'axios'
import authHeader from './authHeader'

// const API_URL = 'https://localhost:7043/api/admin/signal/add'
// const API_URL = 'https://minhnhat27.id.vn/api/admin/signal/add'
const API_URL = process.env.REACT_APP_BASE_URL + "/api/admin"

const adminPost = async (data) => await axios.post(API_URL + "/signal/add", data, { headers: authHeader() })

const adminService = {
  adminPost,
}
export default adminService
