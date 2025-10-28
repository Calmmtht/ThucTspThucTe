import axios from 'axios'
import authHeader from './authHeader'

const API_URL = process.env.REACT_APP_BASE_URL + '/api/statistics'

const getStatistics = async (from, to) =>
  await axios.get(API_URL + `/getStatisticsFormTo?from=${from}&to=${to}`, { headers: authHeader() })

const statisticService = {
  getStatistics,
}

export default statisticService
