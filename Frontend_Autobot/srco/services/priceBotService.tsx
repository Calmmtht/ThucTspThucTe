import axios from 'axios';


    export interface PriceBot {
        month: number;
        price: number;
        discount: number;
        botTradingId: number;
        description: string;
    }

const API_URL = import.meta.env.VITE_API_URL + '/api/priceBot';
  
  class PriceBotService {
    async getAllPriceBots(): Promise<PriceBot[]> {
      const response = await axios.get<PriceBot[]>(`${API_URL}/getAll`);
      return response.data;
    }
  
    async getPriceBot(month: number, botTradingId: number): Promise<PriceBot> {
      const response = await axios.get<PriceBot>(`${API_URL}/get`, {
        params: { month, botTradingId }
      });
      return response.data;
    }
  }
  
  export const priceBotService = new PriceBotService();
  export default priceBotService;