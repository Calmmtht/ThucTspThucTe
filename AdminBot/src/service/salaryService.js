import axios from 'axios'
import authHeader from './authHeader'

const API_URL = process.env.REACT_APP_BASE_URL + '/api/salary'

const getAllSalary = async () => await axios.get(API_URL + '/getAll', { headers: authHeader() })

const addSalary = async (data) =>
  await axios.post(API_URL + '/add', data, { headers: authHeader() })

const updateSalary = async (month, year, userId, data) =>
  await axios.put(API_URL + `/update?month=${month}&year=${year}&userId=${userId}`, data, {
    headers: authHeader(),
  })

const deleteSalary = async (month, year, userId) =>
  await axios.delete(API_URL + `/delete?month=${month}&year=${year}&userId=${userId}`, {
    headers: authHeader(),
  })

const salaryService = {
  getAllSalary,
  addSalary,
  updateSalary,
  deleteSalary,
}

export default salaryService
