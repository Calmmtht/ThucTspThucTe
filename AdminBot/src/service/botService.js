import axios from 'axios'
import authHeader from './authHeader'

// const API_URL = 'https://localhost:7043/api/botTrading'
const API_URL = process.env.REACT_APP_BASE_URL + '/api/botTrading'

const getAllBot = async () => await axios.get(API_URL + '/getAll', { headers: authHeader() })

const addBot = async (data) => await axios.post(API_URL + '/add', data, { headers: authHeader() })

const updateBot = async (id, data) =>
  await axios.put(API_URL + `/update/${id}`, data, { headers: authHeader() })

const deleteBot = async (id) =>
  await axios.delete(API_URL + `/delete/${id}`, { headers: authHeader() })

const botService = {
  getAllBot,
  addBot,
  updateBot,
  deleteBot,
}

export default botService
