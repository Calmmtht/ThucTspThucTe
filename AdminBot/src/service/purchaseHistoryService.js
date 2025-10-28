import axios from 'axios'
import authHeader from './authHeader'

const API_URL = process.env.REACT_APP_BASE_URL + '/api/purchaseHistory'

const getPurchaseHistory = async () =>
  await axios.get(API_URL + '/getAll', { headers: authHeader() })

const purchaseHistoryService = {
  getPurchaseHistory,
}

export default purchaseHistoryService
