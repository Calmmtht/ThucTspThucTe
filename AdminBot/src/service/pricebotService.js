import axios from 'axios'
import authHeader from './authHeader'

// const API_URL = 'https://localhost:7043/api/priceBot'
const API_URL = process.env.REACT_APP_BASE_URL + '/api/priceBot'

const getPriceBot = async () => await axios.get(API_URL + '/getAll', { headers: authHeader() })

const getPriceBotID = async (month, botTradingId) =>
  await axios.get(API_URL + `/get/${month}/${botTradingId}`, { headers: authHeader() })

const updatePriceBot = async (month, botTradingId, data) =>
  await axios.put(API_URL + `/update?month=${month}&botTradingId=${botTradingId}`, data, {
    headers: authHeader(),
  })

const addPriceBot = async (data) =>
  await axios.post(API_URL + '/add', data, { headers: authHeader() })

const deletePrictbot = async (month, botTradingId) =>
  await axios.delete(API_URL + `/delete?month=${month}&botTradingId=${botTradingId}`, {
    headers: authHeader(),
  })

const pricebotService = {
  getPriceBot,
  getPriceBotID,
  updatePriceBot,
  addPriceBot,
  deletePrictbot,
}

export default pricebotService
