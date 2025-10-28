import axios from 'axios'
import authHeader from './authHeader'

const API_URL = process.env.REACT_APP_BASE_URL + '/api/profitLoss'

const getProfitLoss = async () => await axios.get(API_URL + '/getAll', { headers: authHeader() })

const deleteProfitLoss = async (id) =>
  await axios.delete(API_URL + `/delete/${id}`, { headers: authHeader() })

const profitLossService = {
  getProfitLoss,
  deleteProfitLoss,
}

export default profitLossService
