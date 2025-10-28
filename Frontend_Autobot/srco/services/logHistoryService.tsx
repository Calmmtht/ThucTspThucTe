// src/services/LogHistoryService.ts

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5131/api/logHistory';

export interface LogHistory {
  id: number;
  signal: string;
  profitPointTP: number;
  priceBuy: number;
  numberContract: number;
  profit: number;
  isSL: boolean;
  dateTime: string;
  userId?: string;
  user: {
    id: string;
    userName: string;
  };
}

export interface LogHistoryResponse {
  logHistoryList: LogHistory[];
  countSL: number;
}
// getAll
export interface LogHistoryAllResponse {
  logHistory: LogHistory[];
  countSL: number;
}


const LogHistoryService = {
  getAll: async (): Promise<LogHistoryAllResponse> => {
    const response = await axios.get(`${API_BASE_URL}/getAll`);
    return response.data;
  },

  add: async (data: Omit<LogHistory, 'id' | 'user'>) => {
    const response = await axios.post(`${API_BASE_URL}/add`, data);
    return response.data;
  },

  update: async (id: number, data: Partial<LogHistory>) => {
    const response = await axios.put(`${API_BASE_URL}/update/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axios.delete(`${API_BASE_URL}/delete/${id}`);
    return response.data;
  },

  getByDay: async (day: number, month: number, year: number, userId: string): Promise<LogHistoryResponse> => {
    const response = await axios.get(`${API_BASE_URL}/getLogHistoryDay`, {
      params: { day, month, year, userId },
    });
    return response.data;
  },

  getByMonth: async (month: number, year: number, userId: string): Promise<LogHistoryResponse> => {
    const response = await axios.get(`${API_BASE_URL}/getLogHistoryMonth`, {
      params: { month, year, userId },
    });
    return response.data;
  },

  getByYear: async (year: number, userId: string): Promise<LogHistoryResponse> => {
    const response = await axios.get(`${API_BASE_URL}/getLogHistoryYear`, {
      params: { year, userId },
    });
    return response.data;
  },

  getAllByUser: async (userId: string): Promise<LogHistoryResponse> => {
    const response = await axios.get(`${API_BASE_URL}/getLogHistoryAll`, {
      params: { userId },
    });
    return response.data;
  },
};

export default LogHistoryService;
