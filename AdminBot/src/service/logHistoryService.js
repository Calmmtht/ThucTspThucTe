import axios from 'axios'
import authHeader from './authHeader'

const API_URL = process.env.REACT_APP_BASE_URL + '/api/logHistory'

const getLog = async () => await axios.get(API_URL + '/getAll', { headers: authHeader() })

const deleteLog = async (id) =>
  await axios.delete(API_URL + `/delete/${id}`, { headers: authHeader() })

const logHistoryService = {
  getLog,
  deleteLog,
}

export default logHistoryService
