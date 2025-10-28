import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5131';

  export interface BotTrading {
    id: number;
    name: string;
    interestRate: number;
    profit: number;
    commandNumber: number;
    winRate: number;
  }
  
  class BotTradingService {
    async getAllBotTradings(): Promise<BotTrading[]> {
      const response = await axios.get<BotTrading[]>(`${API_URL}/api/botTrading/getAll`);
      return response.data;
    }

    async getBotTradingPrice(): Promise<BotTrading[]>{
      const response = await axios.get<BotTrading[]>(`${API_URL}/api/priceBot/get`);
      return response.data;
    }
  }
  
  export const botTradingService = new BotTradingService();
  export default botTradingService;