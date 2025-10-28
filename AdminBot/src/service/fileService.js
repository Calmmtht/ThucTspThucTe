import axios from 'axios'
import authHeader from './authHeader'

const API_URL = process.env.REACT_APP_BASE_URL + '/api/admin/upload'
// const API_URL = 'https://0f09705989af6b.lhr.life/api/admin/upload'

const uploadFile = async (data) => await axios.post(API_URL, data, { headers: authHeader() })

const fileService = {
  uploadFile,
}

export default fileService
